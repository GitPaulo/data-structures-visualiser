const CodeMirror = require('codemirror');

let _ = require('codemirror/mode/jsx/jsx');

var visualiserElement   = document.getElementById("visualiser");
var sidebarElement      = document.getElementById("sidebar");
var opensidebarElement  = document.getElementById("open_sidebar");
var closesidebarElement = document.getElementById("close_sidebar");
let codeFollowElement   = document.getElementById('visualiser_text_area');
let playButtonElement   = document.getElementById('play_button');
let pauseButtonElement  = document.getElementById('pause_button');

opensidebarElement.onclick = function() {
    // Dynamic Width calculation?
    visualiserElement.style.marginLeft = "280px";
    sidebarElement.style.width         = "280px";
    sidebarElement.style.display       = 'inline-block'
    opensidebarElement.style.display   = 'none';
}

closesidebarElement.onclick = function() {
    visualiserElement.style.marginLeft = "0%";
    sidebarElement.style.width         = "0%";
    sidebarElement.style.display       = "block";
    opensidebarElement.style.display   = "inline-block";
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
    lineNumbers: true
});

editor.setValue(`
function notWorkingYet() {

}
`);

editor.setSize("100%", "100%");

jQuery(document).ready(function(event){

});

 