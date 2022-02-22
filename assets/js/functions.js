function notification(notificationText) {
    let notificationBox = document.querySelector("#notificationBox")
    notificationBox.querySelector("#message").innerText = notificationText
    notificationBox.style.display = 'block'
    window.setTimeout(() => {
        hideNotification()
    }, 2500)

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