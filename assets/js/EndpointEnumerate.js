class EndpointEnumerate {
    constructor(targetNode, targetDomain) {
        this.targetNode = targetNode
        this.executed = false
        this.keyname = null
        this.store = null
        this.targetDomain


        console.info("loaded module: EndpointEnumerate")
    }

    activate() {
        if (this.targetDomain !== app.targetDomain) {
            this.store = null
        }

        this.targetDomain = app.targetDomain

        this.getKeyName()
        if (localStorage.getItem(this.keyname) || this.store) {
            this.executed = true
            this.getEndpoints()
        }
    }

    getKeyName() {
        this.keyname = `${app.getDomainName()}_endpointenumerate`
        return this.keyname
    }

    render() {
        let ui = `<div id="outputField">
            <h2>Enumerate REST Endpoints</h2>
            <table  class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Enpoint</th><th>Route</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>`
        this.targetNode.innerHTML = ui
        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.getEndpoints()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVUser">Export CSV</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWUser">Export RAW</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.clearPersistence()" id="clearUser">Clear</button>
                        `
        document.querySelector("#runContainer").innerHTML = buttons
    }

    renderResults(data) {
        let endpointsHTML = ""
        data.namespaces.forEach(endpoint => {
            endpointsHTML += `<tr><td>${endpoint}</td><td><a href="${app.targetDomain}wp-json/${endpoint}" target="_blank">${app.targetDomain}wp-json/${endpoint}</a></td></tr>`
        })

        return endpointsHTML
    }

    async getEndpoints() {
        window.displaySpinner()
        let endpointsHTML = ""
        if (this.executed) {
            if (localStorage.getItem(this.getKeyName())) {
                this.store = await this.load()
            }
            try {
                endpointsHTML = this.renderResults(this.store)
            } catch (e) {
                notification("No valid data")
            }
        } else {
            try {
                let url = app.targetDomain + 'wp-json'
                let res = await fetch(url, {method: "GET"})
                if (res.ok) {
                    res = await res.json()
                    this.executed = true
                    endpointsHTML = this.renderResults(res)
                    this.persist(res)

                }
            } catch (e) {
                notification(e.toString())
            }
        }

        document.querySelector("#outputField table tbody").innerHTML = endpointsHTML
        window.hideSpinner()
    }

    forceRun() {
        this.executed = false
        this.getEndpoints()
    }

    async load() {
        return JSON.parse(localStorage.getItem(this.getKeyName()))
    }

    persist(data) {
        this.store = data
        try {
            localStorage.setItem(this.getKeyName(), JSON.stringify(data))
        } catch (e) {
            console.error(e)
            notification("Fehler beim Speichern des Resultats. Sie sollten es sofort exportieren um keine Daten zu verlieren.", 0)
        }
    }

    async exportCSV() {
        let data = this.store
        let csvData = ["name"]
        data.forEach(endpoint => {
            csvData.push(`${endpoint}`)
        })

        download(csvData.join("\n"), `endpoints_${app.getDomainName()}.csv`, "text/csv")
    }

    async exportRAW() {
        let data = JSON.stringify(this.store)
        download(data, `endpoints_${app.getDomainName()}.json`, "application/json")
    }

    clearPersistence() {
        if (confirm("Möchten Sie die Daten der Endpoint Enumeration wirklich löschen?")) {
            localStorage.removeItem(this.getKeyName())
        }
    }

}