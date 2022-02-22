class Application {
    constructor(targetNode) {
        this.targetDomain = null
        this.targetNode = targetNode
        this.currentModule = null
    }

    setDomain(url) {
        url = url.replace(new RegExp("/s"), "")

        if (url == "") {
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
            notification(`Die Domain "${url}" wurde als Ziel gesetzt.`)
        } else {
            notification("Ungültige Domain")
        }


    }

    loadModule(moduleName) {


        if (moduleName === 'userenumerate') {
            this.targetNode.innerHTML = `<span id="spinner"></span>`
            this.currentModule = new UserEnumerate(this.targetNode)

        }

        if (moduleName === 'mediaenumerate') {
            this.targetNode.innerHTML = `<span id="spinner"></span>`
            this.currentModule = new MediaEnumerate(this.targetNode)

        }

        if (this.currentModule) {
            this.currentModule.render()
            this.currentModule.getKeyName()
        }
    }

    getDomainName() {
        if (this.targetDomain) {
            return this.targetDomain.replace("https://", "").replace("http://", "").replace(".", "").replace("/", "")
        } else {
            notification("Keine Zieldomain gesetzt")
            return "nodomain"
        }

    }
}