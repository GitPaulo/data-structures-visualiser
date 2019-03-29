let nextPage = function (pageName) {
    document.location.href = `../${pageName}/${pageName}.html`;
}

/* event functions */
document.getElementById('visualiser_button').onclick = function () {
    nextPage('visualiser');
}

document.getElementById('playground_button').onclick = function () {
    nextPage('playground');
}

document.getElementById('logs_button').onclick = function () {
    nextPage('logs');
}