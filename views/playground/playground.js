const path = require('path');
const CodeMirror = require('codemirror');
const Beautify = require("js-beautify").js;
const {
    dialog
} = require('electron').remote;
let _ = require('codemirror/mode/jsx/jsx');

const fs = require('fs');

// Create folder for code exports
let folder_name = "../../data";
let rootPath = path.dirname(require.main.filename);
let folderPath = path.join(rootPath, folder_name);

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Page Elements
let editorElement = document.getElementById('editor_text_area');
let runButtonElement = document.getElementById('run_button');
let beautifyButtonElement = document.getElementById("beautify_button");
let importButtonElement = document.getElementById("import_button");
let exportButtonElement = document.getElementById("export_button");

// Popup Elements
let importPopupElement = document.getElementById("import_frame");
let importPopupCloseButtonElement = document.getElementById("import_close");
let importPopupContentElement = document.getElementById("import_content");
let importPopupSelectElement = document.getElementById("import_select");
let importPopupButtonElement = document.getElementById("import_import");
let importPopupExternalElement = document.getElementById("import_external");

// Code mirror setup
const editor = CodeMirror.fromTextArea(editorElement, {
    mode: "jsx",
    lineNumbers: true
});

editor.setValue(`function test() {
    for (let i=1; i<10; i++) {
        console.log(i);
    }
}

test();`);

editor.setSize('100%', '100%');

// Event functions
runButtonElement.onclick = function () {
    console.log(eval(editor.getValue()));
}

beautifyButtonElement.onclick = function () {
    editor.setValue(Beautify(editor.getValue(), {
        indent_size: 3,
        space_in_empty_paren: true
    }))
}

importButtonElement.onclick = function () {
    importPopupElement.style.display = "block";
}

exportButtonElement.onclick = function () {
    let filepath = path.join(folderPath, new Date().getTime() + Math.random() + ".txt");
    fs.writeFile(filepath, editor.getValue(), () => {
        alert(`Saved contents of editor to ${filepath}`);
    });
}

importPopupCloseButtonElement.onclick = async function () {
    importPopupContentElement.classList.add("slide-out");
    await setTimeout(() => {
            importPopupElement.style.display = "none";
            importPopupContentElement.classList.remove("slide-out")
        },
        600);
}

importPopupSelectElement.onchange = function () {
    let value = importPopupSelectElement.value;

    if (value === "%external%") {
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections']
        }, function (files) {
            if (files !== undefined) {
                // handle files
                importPopupExternalElement.style.display = "block";
                importPopupExternalElement.children[0].innerHTML = files.toString();
            }
        });
    } else {
        // internal import (reset label - handle this import below func)
        importPopupExternalElement.style.display = "none";
    }
}

importPopupButtonElement.onclick = function () {
    let newText = null;
    let selectValue = importPopupSelectElement.value;

    if (selectValue === "%external%") {
        let externalPathElement = importPopupExternalElement.children[0];
        let filePathArray = externalPathElement.innerHTML.split(",");
        for (let filePath of filePathArray) {
            let fileContent = fs.readFileSync(filePath);
            newText += `${fileContent}` + "\n";
        }
    } else {
        // DS/ALG presets
    }

    editor.setValue(newText);
}