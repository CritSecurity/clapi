class Application {
    constructor(targetNode) {
        this.targetDomain = null
        this.targetNode = targetNode
        this.currentModule = null
    }

    setDomain(url) {
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

        this.targetDomain = url
        notification(`Die Domain "${url}" wurde als Ziel gesetzt.`)
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
        }
    }

    getDomainName() {
       return this.targetDomain.replace("https://", "").replace("http://", "").replace(".", "").replace("/", "")
    }
}