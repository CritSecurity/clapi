class UserEnumerate {
    constructor(targetNode) {
        this.targetNode = targetNode
        this.executed = false
    }

    render() {
        this.targetNode.innerHTML = `<span id="spinner"></span>`
        let ui = `<div id="outputField">
            <h2>Enumerate User Names</h2>
            <ul>
            </ul>
        </div>`
        this.targetNode.innerHTML = ui
        document.querySelector("#runContainer").innerHTML = `<button class="btn btn-primary" onclick="app.currentModule.checkWithURL()" id="checkButton">Run</button>`
    }

    async checkWithURL() {
        window.displaySpinner()
        let url = app.targetDomain
        let apiURL = url + "wp-json/wp/v2/users"
        let res = await fetch(apiURL, {method: "GET"})
        if ((await res).ok) {
            res = await res.json()
            let usersHTML = ""
            res.forEach(user => {
                let currentUserHTML = `<li>id: ${user.id} - ${user.name}</li>`
                usersHTML += currentUserHTML
            })

            document.querySelector("#outputField ul").innerHTML = usersHTML
        } else {
            document.querySelector("#outputField ul").innerHTML = "nichts gefunden"
        }
        window.hideSpinner()
    }
}