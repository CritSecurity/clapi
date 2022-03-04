class UserEnumerate {
    constructor(targetNode, targetDomain) {
        this.targetNode = targetNode
        this.executed = false
        this.keyname = null
        this.store = null
        this.targetDomain = targetDomain


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
            this.getUsers()
        }
    }

    getKeyName() {
        this.keyname = `${app.getDomainName()}_userenumerate`
        return this.keyname
    }

    render() {
        let ui = `<div id="outputField">
            <h2>Enumerate Users</h2>
            <table  class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Slug</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>`
        this.targetNode.innerHTML = ui
        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.getUsers()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVUser">Export CSV</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWUser">Export RAW</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.clearPersistence()" id="clearUser">Clear</button>
                        `
        document.querySelector("#runContainer").innerHTML = buttons
    }

    async getUsers() {
        window.displaySpinner()
        let usersHTML = "nichts gefunden"

        if (this.executed) {
            // already run, load from persistence to avoid another call to target
            if (localStorage.getItem(this.getKeyName())) {
                this.store = await this.load()
            }
            try {
                usersHTML = this.renderResults(this.store)
            } catch (e) {
                notification("No valid data")
            }


        } else {
            let url = app.targetDomain
            let apiURL = url + "wp-json/wp/v2/users?orderby=id"
            try {
                let res = await fetch(apiURL, {method: "GET"})
                if (res && res.ok) {
                    res = await res.json()

                    this.executed = true
                    usersHTML = this.renderResults(res)
                    this.persist(res)
                } else {

                }
            } catch (e) {
                notification(e.toString())
            }

        }

        // render results / data
        document.querySelector("#outputField table tbody").innerHTML = usersHTML
        window.hideSpinner()
    }

    renderResults(data) {
        let usersHTML = ""
        data.forEach(user => {
            let currentUserHTML = `<tr><td>${user.id}</td><td>${user.name}</td><td>${user.slug}</td></tr>`
            usersHTML += currentUserHTML
        })
        return usersHTML
    }

    forceRun() {
        this.executed = false
        this.getUsers()
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
        let csvData = ["id;name;slug"]
        data.forEach(user => {
            csvData.push(`${user.id};${user.name};${user.slug}`)
        })

        download(csvData.join("\n"), `users_${app.getDomainName()}.csv`, "text/csv")
    }

    async exportRAW() {
        let data = JSON.stringify(this.store)
        download(data, `users_${app.getDomainName()}.json`, "application/json")
    }

    clearPersistence() {
        if (confirm("Möchten Sie die Daten der User Enumeration wirklich löschen?")) {
            localStorage.removeItem(this.getKeyName())
        }
    }
}