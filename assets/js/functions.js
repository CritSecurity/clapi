function notification(notificationText, duration) {
    if(duration === undefined) {
        duration = 2500
    }
    let notificationBox = document.querySelector("#notificationBox")
    notificationBox.querySelector("#message").innerText = notificationText
    notificationBox.style.display = 'block'
    if (duration === 0) {

    } else {
        window.setTimeout(() => {
            hideNotification()
        }, duration)
    }
}

function hideNotification() {

    let notificationBox = document.querySelector("#notificationBox")
    notificationBox.style.display = 'none'
    notificationBox.querySelector("#message").innerText = ""
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