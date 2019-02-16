const CodeMirror = require('codemirror');
require('codemirror/mode/jsx/jsx');

var editorElement = document.getElementById('editor_text_area');

const editor = CodeMirror.fromTextArea(editorElement, {
    mode:  "jsx",
    lineNumbers: true
});

editor.setValue(`console.log("Hello world!");`);
editor.setSize("100%", "100%");

document.getElementById("run_button").onclick = function () {
    console.log(eval(editor.getValue()));
}
 
document.getElementById("import_button").onclick = function () {
    
}

document.getElementById("export_button").onclick = function () {
    
}

