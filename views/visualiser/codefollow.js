/* global codeFollowElement, activeItem, Beautify */
const CodeMirror = require('codemirror');

const DEFAULT_CODEFOLLOW_STRING = `/* No Data Structure selected! Please open the side bar for selection. */`;

var codeFollowEditor = CodeMirror.fromTextArea(codeFollowElement, {
    mode:                "jsx",
    styleActiveLine:     true,
    styleActiveSelected: true,
    lineNumbers:         true,
    lineWrapping:        true
});

codeFollowEditor.setSize("100%", "90%");
codeFollowEditor.setValue(DEFAULT_CODEFOLLOW_STRING);

let waitRefresh = () => { // seems to fix the problem? Too lazy to figure out why.
    setTimeout(() => {
        codeFollowEditor.refresh();
        codeFollowEditor.focus();
        codeFollowEditor.refresh();
        console.log("Refreshed code editor!");
    }, 1000);
}

codeFollowEditor.setCode = function (func, beautifyData={ indent_size: 3, space_in_empty_paren: true }) {
    // Copy operation code to editor
    var code = Beautify(func.toString(), beautifyData);
    codeFollowEditor.setValue(code);
    waitRefresh();
}

codeFollowEditor.resetCode = function (beautifyData={ indent_size: 3, space_in_empty_paren: true }) {
    if (activeItem === null ) {
        codeFollowEditor.setValue(DEFAULT_CODEFOLLOW_STRING);
        return;
    }

    var code = Beautify(activeItem.__proto__.constructor.toString(), beautifyData); 
    codeFollowEditor.setValue(code);
    waitRefresh();
}