class Brute extends Module {
    constructor(targetNode, targetDomain) {
        super(targetNode, targetDomain);
    }

    buildUI() {
        let userList = ""
        if (app.modules.userenumerate.store) {
            app.modules.userenumerate.store.forEach(user => {
                userList += `<tr><td data-username="${user.slug}" onclick="app.currentModule.selectUser(this.dataset.username)">${user.slug}</td></tr>`
            })
        }


        let ui = `<div id="outputField">
            <h2>Brute Force PW Guess</h2>
            <p>Export für Burp, direktes Bruteforcing aus dem Browser nicht möglich ohne Proxy (CORS)</p>
            <h3>User:</h3>
            <table class="table table-striped">
                <thead>
                    <tr><th>Username</th></tr>
                </thead>
                <tbody>
                    ${userList}
                </tbody>
                
            </table>
            <table  class="table table-striped table-hover" id="outputTable">
                <thead>
                    <tr>
                        <th>Passwort</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>`

        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.run()" id="checkButton">Run</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVUser">Export CSV</button>
                       <!--<button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWUser">Export RAW</button>-->
                       <button class="btn btn-secondary" onclick="app.currentModule.stopRun()">Stop</button>
                       <button class="btn btn-secondary" onclick="app.currentModule.clearPersistence()" id="clearUser">Clear</button>
                        `

        return {moduleUI: ui, moduleButtons: buttons}
    }

    renderCSV() {
        let data = this.store
        let csvData = ["data"]
        data.forEach(row => {
            csvData.push(`${row.test}`)
        })
        return csvData.join("\n")
    }

    selectUser(userName) {
        app.share.username = userName
        notification(`${userName} ausgewählt. Sie können das Modul jetzt ausführen.`)
    }

    generatePasswords(userName) {
        let pws = []

        // numbers at end
        let userNameIncr = userName
        for (let i=1; i<10;i++) {
            userNameIncr += i
            pws.push(userNameIncr)
        }

        // username register year + season
        let year = new Date().getFullYear()
        let seaons = ["frühling", "spring", "fruhling", "sommer", "summer", "herbst", "fall", "autumn", "winter"]
        let startYear = year - 10
        for (startYear; startYear <= year; startYear++) {
            pws.push(`${userName}${startYear}`)
            seaons.forEach(season => {
                pws.push(`${userName}${season}${startYear}`)
                pws.push(`${userName}${capitalise(season)}${startYear}`)
            })
        }

        // username birth year boomer edition
        let birthYear = 1950
        for (birthYear; birthYear <= 1980; birthYear++) {
            pws.push(`${userName}${birthYear}`)
            pws.push(`${userName}${birthYear-1900}`)
        }



        return pws
    }

    renderResults(data) {
        let pwHTML = ''
        data.forEach(pw => {
            let currentPWHTML = `<tr><td>${pw}</td></tr>`
            pwHTML += currentPWHTML
        })
        return pwHTML
    }

    async run() {
        let userName = app.share.username
        if (!userName) {
            notification("Kein Username ausgewählt")
            return
        }
        let pws = this.generatePasswords(userName)
        this.nextPW = true
        this.store = pws

        /*
        let i = 0
        while (this.nextPW) {
            let form = new FormData()
            form.append("log", userName[i]);
            form.append("pwd", "DHW4wjr6dqr7zqj!ebn");

            let res = await fetch(this.targetDomain + "wp-login.php", {method: 'post', body: form, mode: 'cors'})
            console.log(res)
            if (res.url = this.targetDomain + "wp-login.php") {

            }
            let page = await res.text()

            i++
        }
         */

        this.targetNode.querySelector("#outputTable tbody").innerHTML = this.renderResults(pws)

    }

    stop() {
        this.nextPW = false
        notification("Modul angehalten")
    }

    renderCSV() {
        return this.store.join("\n")
    }
}