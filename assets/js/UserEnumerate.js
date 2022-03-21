class UserEnumerate extends Module{
    constructor(targetNode, targetDomain) {
        super(targetNode, targetDomain);
    }


    buildUI() {
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

        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.run()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVUser">Export CSV</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWUser">Export RAW</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.clearPersistence()" id="clearUser">Clear</button>
                        `

        return {moduleUI: ui, moduleButtons: buttons}
    }

    async run() {
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

    renderCSV() {
        let data = this.store
        let csvData = ["id;name;slug"]
        data.forEach(user => {
            csvData.push(`${user.id};${user.name};${user.slug}`)
        })
        return csvData.join("\n")
    }

}