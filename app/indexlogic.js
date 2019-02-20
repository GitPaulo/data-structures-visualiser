const VIEW_FOLDER_PATH = `${__dirname}/views`;

function nextPage(pageName){
    //document.getElementByClass("main").style.display = "none";
    document.location.href = VIEW_FOLDER_PATH + `/${pageName}/${pageName}.html`;
}

document.getElementById("visualiser_button").onclick = function() {
    nextPage("visualiser");
}

document.getElementById("playground_button").onclick = function() {
    nextPage("playground");
}

document.getElementById("about_button").onclick = function() {
    nextPage("about");
}

