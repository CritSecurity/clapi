class Application {
    constructor(targetNode) {
        this.targetDomain = null
        this.targetNode = targetNode
        this.currentModule = null

        this.modules = {
            "userenumerate": new UserEnumerate(this.targetNode, this.targetDomain),
            "mediaenumerate": new MediaEnumerate(this.targetNode, this.targetDomain),
            "endpointenumerate": new EndpointEnumerate(this.targetNode, this.targetDomain),
            "brute": new Brute(this.targetNode, this.targetDomain)
        }

        this.share = {}
    }

    setDomain(url) {
        url = url.replace(new RegExp("/s"), "")

        if (url === "") {
            this.targetDomain = null
            return
        }

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = 'https://' + url
        }

        if (!url.endsWith("/")) {
            url += "/"
        }

        if (url.match("https?:\\/\\/(?:www\\.)?([-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b)*\\/")) {
            this.targetDomain = url
            if (this.currentModule) {
                this.currentModule.executed = false
                this.currentModule.activate()
            }
            this.appendHistory(url, this.getDomainName(url))
            notification(`Die Domain "${url}" wurde als Ziel gesetzt.`)
        } else {
            notification("Ungültige Domain")
        }


    }

    loadModule(moduleName) {

        this.currentModule = this.modules[moduleName]

        if (this.currentModule) {
            this.currentModule.render()
            this.currentModule.activate()
        }
    }

    getDomainName() {
        if (this.targetDomain) {
            return this.targetDomain.replace("https://", "").replace("http://", "").replace(/\./g, "-").replace(/\//g, "")
        } else {
            notification("Keine Zieldomain gesetzt")
            return "nodomain"
        }

    }

    appendHistory(url, name) {
        let history = JSON.parse(localStorage.getItem("history"))
        if (history === null) {
            history = {}
        }
        let historyItem = {"url": url, "name": name}
        history[name] = historyItem
        localStorage.setItem("history", JSON.stringify(history))
        this.buildHistoryUI()

    }

    buildHistoryUI() {
        let history = JSON.parse(localStorage.getItem("history"))
        if (history) {
            let historyHTML = ""
            Object.entries(history).forEach(historyItem => {
                historyHTML += `<option value="${historyItem[1].url}">${historyItem[1].name}</option>`
            })
            document.querySelector("#history").innerHTML = historyHTML
        }
    }
}