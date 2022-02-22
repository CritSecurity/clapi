class UserEnumerate {
    constructor(targetNode) {
        this.targetNode = targetNode
        this.executed = false
        this.keyname = this.getKeyName()
        this.store = null

        if (localStorage.getItem(this.keyname)) {
            this.executed = true
            this.checkWithURL()
        }
    }

    getKeyName() {
        this.keyname = `${app.getDomainName()}_userenumerate`
        return this.keyname
    }

    render() {
        let ui = `<div id="outputField">
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
        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.checkWithURL()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVUser">Export CSV</button>
                        `
        document.querySelector("#runContainer").innerHTML = buttons
    }

    async checkWithURL() {
        window.displaySpinner()
        let usersHTML = "nichts gefunden"

        if (this.executed) {
            // already run, load from persistence to avoid another call to target
            this.store = await this.load()
            usersHTML = this.renderResults(this.store)

        } else {
            let url = app.targetDomain
            let apiURL = url + "wp-json/wp/v2/users?orderby=id"
            let res = await fetch(apiURL, {method: "GET"})
            if ((await res).ok) {
                res = await res.json()

                this.executed = true
                usersHTML = this.renderResults(res)
                this.persist(res)
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
        this.checkWithURL()
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
            notification("Fehler beim Speichern des Resultats. Sie sollten es sofort exportieren um keine Daten zu verlieren.")
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
}