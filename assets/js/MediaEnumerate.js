class MediaEnumerate extends Module {
    constructor(targetNode, targetDomain) {
        super(targetNode, targetDomain);
    }

    buildUI() {
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

        let buttons = `<button class="btn btn-primary" onclick="app.currentModule.run()" id="checkButton">Run</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.forceRun()" id="checkButtonForce">Run -f</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.exportCSV()" id="exportCSVMedia">Export CSV</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.exportRAW()" id="exportRAWMedia">Export RAW</button>
                        <button class="btn btn-secondary" onclick="app.currentModule.clearPersistence()" id="clearMedia">Clear</button>`

        return {moduleUI: ui, moduleButtons: buttons}
    }

    async run() {
        window.displaySpinner()
        let mediaHTML = "nothing found"
        if (this.executed) {
            if (localStorage.getItem(this.getKeyName())) {
                this.store = await this.load()
            }
            try {
                mediaHTML = this.renderResults(this.store)
            } catch (e) {
                notification("No valid data")
            }


        } else {
            let pageNumber = 1
            let hasNextPage = true
            let foundMedia = []
            try {
                while (hasNextPage) {
                    let url = app.targetDomain + `wp-json/wp/v2/media/?page=${pageNumber}&per_page=100`
                    let res = await fetch(url, {method: "GET"})
                    if (res.ok) {
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
            } catch (e) {
                notification(e.toString())
            }

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

    async renderCSV() {
        let data = this.store
        let csvData = ["filename;mime;uploaded;url"]
        data.forEach(media => {
            csvData.push(`${media.slug};${media.mime_type};${media.date};${media.source_url}`)
        })

        return csvData.join("\n")
    }

}