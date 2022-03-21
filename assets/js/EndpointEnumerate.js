class EndpointEnumerate extends Module {
    constructor(targetNode, targetDomain) {
        super(targetNode, targetDomain);
    }


    buildUI() {
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

        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.run()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVUser">Export CSV</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWUser">Export RAW</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.clearPersistence()" id="clearUser">Clear</button>
                        `

        return {moduleUI: ui, moduleButtons: buttons}
    }

    renderResults(data) {
        let endpointsHTML = ""
        data.namespaces.forEach(endpoint => {
            endpointsHTML += `<tr><td>${endpoint}</td><td><a href="${app.targetDomain}wp-json/${endpoint}" target="_blank">${app.targetDomain}wp-json/${endpoint}</a></td></tr>`
        })

        return endpointsHTML
    }

    async run() {
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

    renderCSV() {
        let data = this.store
        let csvData = ["name"]
        data.forEach(endpoint => {
            csvData.push(`${endpoint}`)
        })

        return csvData.join("\n")
    }

}