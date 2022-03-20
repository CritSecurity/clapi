class Module {
    constructor(targetNode, targetDomain) {
        this.targetNode = targetNode
        this.executed = false
        this.keyname = null
        this.store = null
        this.targetDomain = targetDomain
        console.info(`loaded module: ${this.constructor.name}`)
    }

    activate() {
        if (this.targetDomain !== app.targetDomain) {
            this.store = null
        }

        this.targetDomain = app.targetDomain

        this.getKeyName()
        if (localStorage.getItem(this.keyname) || this.store) {
            this.executed = true
            this.run()
        }
    }

    getKeyName() {
        this.keyname = `${app.getDomainName()}_${this.constructor.name}`
        return this.keyname
    }

    async run() {
        notification("empty plugin run")
    }

    buildUI() {
        return {moduleUI: `<h2>Empty Module Template</h2>`, moduleButtons: `<button disabled class="btn btn-primary">Run</button>`}
    }

    render() {
        let uiHTML = this.buildUI()
        this.targetNode.innerHTML = uiHTML.moduleUI
        document.querySelector("#runContainer").innerHTML = uiHTML.moduleButtons
    }

    renderResults(data) {
        return `<tr><td>Modul ${this.constructor.name}</td></tr>`
    }

    forceRun() {
        this.executed = false
        this.run()
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

    renderCSV() {
        return ""
    }

    async exportCSV() {
        let csvData = this.renderCSV()
        download(csvData, `${this.constructor.name}_${app.getDomainName()}.csv`, "text/csv")
    }

    async exportRAW() {
        let data = JSON.stringify(this.store)
        download(data, `${this.constructor.name}_${app.getDomainName()}.json`, "application/json")
    }

    clearPersistence() {
        if (confirm(`Möchten Sie die Daten des Moduls ${this.constructor.name} wirklich löschen?`)) {
            localStorage.removeItem(this.getKeyName())
        }
    }
}