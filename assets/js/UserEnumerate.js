class UserEnumerate {
    constructor(targetNode) {
        this.targetNode = targetNode
        this.executed = false

        if (localStorage.getItem("userenumerate")) {
            this.executed = true
            this.checkWithURL()
        }
    }

    render() {
        let ui = `<div id="outputField">
            <table>
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
        document.querySelector("#runContainer").innerHTML = `<button class="btn btn-primary" onclick="app.currentModule.checkWithURL()" id="checkButton">Run</button>`
    }

    async checkWithURL() {
        window.displaySpinner()
        let usersHTML = "nichts gefunden"

        if (this.executed) {
            // already run, load from persistence to avoid another call to target
            let data = await this.load()
            usersHTML = this.renderResults(data)

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

    async load() {
        return JSON.parse(localStorage.getItem("userenumerate"))
    }

    persist(data) {
        localStorage.setItem("userenumerate", JSON.stringify(data))
    }
}