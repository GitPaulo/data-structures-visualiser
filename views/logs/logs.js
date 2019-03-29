const path = require('path');
const Logger = require("../../structures/modules/logger");
const fs = require('fs');
const CodeMirror = require('codemirror');

// Logger instance
var logger = Logger.getInstance();

// Page Elements
let editorElement = document.getElementById("logs-editor_text_area");
let exportButton  = document.getElementById("export_logs_button");
let clearButton   = document.getElementById("clear_logs_button");

// Create folder for logs exports (same as playground - im lazy)
let folder_name = "../../data";
let rootPath = path.dirname(require.main.filename);
let folderPath = path.join(rootPath, folder_name);

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Events
exportButton.onclick = function () {
    let filepath = path.join(folderPath, new Date().getTime() + Math.random() + "_LOGS.txt");
    fs.writeFile(filepath, editor.getValue(), () => {
        alert(`Saved logs to ${filepath}`);
    });
}

clearButton.onclick = function () {
    localStorage[logger.STORAGE_KEY] = "";
    editor.setValue("");
    alert("Cleared logs in local storage!");
}

// Code mirror setup
const editor = CodeMirror.fromTextArea(editorElement, {
    //mode: "jsx",
    lineNumbers: true
});

let logString = localStorage["logs"] || "[NO LOGS FOUND!]";
editor.setValue(logString);

editor.setSize('100%', '100%');