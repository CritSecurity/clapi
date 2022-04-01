function notification(notificationText, duration) {
    if(duration === undefined) {
        duration = 2500
    }
    let notificationBox = document.querySelector("#notificationBox")
    notificationBox.querySelector("#message").innerText = notificationText
    notificationBox.classList.remove('flyOut')
    notificationBox.style.display = 'block'
    notificationBox.classList.add('flyIn')
    if (duration === 0) {

    } else {
        window.setTimeout(() => {
            hideNotification()
        }, duration)
    }
}

function hideNotification() {

    let notificationBox = document.querySelector("#notificationBox")
    notificationBox.classList.remove('flyIn')
    notificationBox.classList.add('flyOut')
    window.setTimeout(() => {

        notificationBox.classList.remove('flyIn', 'flyOut')
        notificationBox.style.display = 'none'
        notificationBox.querySelector("#message").innerText = ""
    }, 950)

}

function displaySpinner() {
    document.querySelector("#loadingIndicator").innerHTML = ` <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`
}

function hideSpinner() {
    document.querySelector("#loadingIndicator").innerHTML = ""
}

function download(data, filename, type) {
    let file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function toggleLightMode() {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");

    if (document.body.classList.contains('dark')) {
        // switch to light
        document.body.classList.remove("dark")
        metaThemeColor.setAttribute("content", "#154194")



    } else {
        // switch to dark
        document.body.classList.add("dark")
        metaThemeColor.setAttribute("content", "#001636")

    }
}

function toggleMenu() {
    let menuList = document.querySelector("#moduleList")
    if (menuList.style.display === 'none') {
        menuList.style.display = "inline-block"
    } else if (menuList.style.display === '') {
        menuList.style.display = "inline-block"
    } else {
        menuList.style.display = "none"
    }

}

function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function showCredits() {
    document.querySelector("#credits").style.display = "block"
}

function hideCredits() {
    document.querySelector("#credits").style.display = "none"
}

async function loadReadMe() {

    let welcomeCard = `<div id="welcomeCardDesktop" class="card welcomeCard">
            <div class="card-body">
                <h5 class="card-title">Welcome</h5>
                <p class="card-text">Add a target domain.<br /><br />README.md:<pre></pre></p>
            </div>
        </div>

        <div id="welcomeCardMobile" class="card welcomeCard">
            <div class="card-body">
                <h5 class="card-title">Welcome</h5>
                <p class="card-text">Add a target domain and open the top menu to see available modules<br /><br />README.md:<pre></pre></p>
            </div>
        </div>`
    document.querySelector("#mount").innerHTML = welcomeCard
    document.querySelector("#runContainer").innerHTML = ""

    let res = await fetch("./README.md", {method: "GET"})
    res = await res.text()
    document.querySelectorAll("#mount .welcomeCard .card-body pre").forEach(pre => {
        res = res.replace(/^!.*$/mg, "")
        pre.innerText = res
    })
}