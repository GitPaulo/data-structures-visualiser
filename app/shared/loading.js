const INTERVAL = 1300;

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, INTERVAL);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

onReady(function () {
    let pageElement    = document.getElementById("page");
    let loadingElement = document.getElementById("loading");

    pageElement.style.visibility = "visible";
    loadingElement.style.display = "none";
});