const VIEW_FOLDER_PATH = `${__dirname}/views`;

document.getElementById("visualiser_button").onclick = function() {
    document.location.href = VIEW_FOLDER_PATH + "/visualiser/visualiser.html";
}

document.getElementById("playground_button").onclick = function() {
    document.location.href = VIEW_FOLDER_PATH + "/playground/playground.html";
}

document.getElementById("about_button").onclick = function() {
    document.location.href = VIEW_FOLDER_PATH + "/about/about.html";
}

