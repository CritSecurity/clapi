class MediaEnumerate {
    constructor(targetNode) {
        this.targetNode = targetNode
        this.executed = false
        this.keyname = this.getKeyName()
        this.store = null

        if (localStorage.getItem(this.keyname)) {
            this.executed = true
            this.getMedia()
        }
    }

    getKeyName() {
        this.keyname = `${app.getDomainName()}_mediaenumerate`
        return this.keyname
    }

    render() {
        let ui = `<div id="outputField">
            <h2>Enumerate Uploaded Media</h2>
            <table class="table table-striped table-hover">
                <thead>
                    <tr><th>Filename</th><th>MIME</th><th>Uploaded</th></tr>
                </thead>
                <tbody>
                
                
                </tbody>
            </table>
        </div>`
        this.targetNode.innerHTML = ui
        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.getMedia()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVMedia">Export CSV</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWMedia">Export RAW</button>`
        document.querySelector("#runContainer").innerHTML = buttons
    }

    async getMedia() {
        window.displaySpinner()
        let mediaHTML = "nichts gefunden"
        if (this.executed) {
            this.store = await this.load()
            mediaHTML = this.renderResults(this.store)

        } else {
            let pageNumber = 1
            let hasNextPage = true
            let foundMedia = []
            while (hasNextPage) {
                let url = app.targetDomain + `wp-json/wp/v2/media/?page=${pageNumber}&per_page=100`
                let res = await fetch(url, {method: "GET"})
                if ((await res).ok) {
                    res = await res.json()
                    foundMedia.push.apply(foundMedia, res)
                    pageNumber++


                } else {
                    hasNextPage = false
                }

            }
            this.executed = true
            mediaHTML = this.renderResults(foundMedia)
            this.persist(foundMedia)

        }



        document.querySelector("#outputField table tbody").innerHTML = mediaHTML
        window.hideSpinner()



    }

    renderResults(data) {
        let mediaHTML = ""
        data.forEach(media => {
            try {
                let currentUserHTML = `<tr><td><a target="_blank" href="${media.source_url}">${media.slug}</a></td><td>${media.mime_type}</td><td>${media.date}</td></tr>`
                mediaHTML += currentUserHTML
            } catch (e) {

            }

        })
        return mediaHTML
    }

    forceRun() {
        this.executed = false
        this.getMedia()
    }

    async load() {
        let data = JSON.parse(localStorage.getItem(this.keyname))
        this.store = data
        return data
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
        let csvData = ["filename;mime;uploaded;url"]
        data.forEach(media => {
            csvData.push(`${media.slug};${media.mime_type};${media.date};${media.source_url}`)
        })

        download(csvData.join("\n"), `media_${app.getDomainName()}.csv`, "text/csv")
    }

    async exportRAW() {
        let data = JSON.stringify(this.store)
        download(data, `media_${app.getDomainName()}.json`, "application/json")
    }
}