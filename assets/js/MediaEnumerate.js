class MediaEnumerate {
    constructor(targetNode) {
        this.targetNode = targetNode
        this.executed = false
    }

    render() {
        this.targetNode.innerHTML = `<span id="spinner"></span>`
        let ui = `<div id="outputField">
            <h2>Enumerate Uploaded Media</h2>
            <table>
                <thead>
                    <tr><th>Filename</th><th>MIME</th><th>Uploaded</th></tr>
                </thead>
                <tbody>
                
                
                </tbody>
            </table>
        </div>`
        this.targetNode.innerHTML = ui
        document.querySelector("#runContainer").innerHTML = `<button class="btn btn-primary" onclick="app.currentModule.getMedia()" id="checkButton">Run</button>`
    }

    async getMedia() {
        window.displaySpinner()
        let mediaHTML = "nichts gefunden"
        if (this.executed) {
            let data = await this.load()
            mediaHTML = this.renderResults(data)

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

    async load() {
        return JSON.parse(localStorage.getItem("mediaenumerate"))
    }

    persist(data) {
        localStorage.setItem("mediaenumerate", JSON.stringify(data))
    }
}