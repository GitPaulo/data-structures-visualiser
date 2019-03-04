const CodeMirror = require('codemirror');

let _ = require('codemirror/mode/jsx/jsx');

var pageElement         = document.getElementById("page");
var sidebarElement      = document.getElementById("sidebar");
var opensidebarElement  = document.getElementById("open_sidebar");
var closesidebarElement = document.getElementById("close_sidebar");
let codeFollowElement   = document.getElementById('visualiser_text_area');
let playButtonElement   = document.getElementById('play_button');
let pauseButtonElement  = document.getElementById('pause_button');

opensidebarElement.onclick = function() {
    // Dynamic Width calculation?
    pageElement.style.marginLeft   = "280px";
    sidebarElement.style.width     = "280px";
    sidebarElement.style.display   = 'inline-block';
    opensidebarElement.innerHTML   = "|";
    opensidebarElement.style.color = "#818181";
}

closesidebarElement.onclick = function() {
    pageElement.style.marginLeft   = "0%";
    sidebarElement.style.width     = "0%";
    sidebarElement.style.display   = "block";
    opensidebarElement.innerHTML   = "&#9776; Open Sidebar";
    opensidebarElement.style.color = "white";
}

playButtonElement.onclick = function () {
    noLoop = false;
    terminalInstance.write("Canvas animation resumed!");
}

pauseButtonElement.onclick = function () {
    noLoop = true;
    terminalInstance.write("Canvas animation paused!");
}

const editor = CodeMirror.fromTextArea(codeFollowElement, {
    mode:  "jsx",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true
});

editor.setSize("100%", "100%");

editor.setValue(`/* This section will contain the algorithm for the respective animation*/
function notWorkingYet() {
    let bannanas = "yum yum";
    for (let i = 1; i < 1000; i++) { 
        console.log("nom", "nom");
    }
    return bannanas;
}
`);

jQuery(document).ready(function(event){

});

 