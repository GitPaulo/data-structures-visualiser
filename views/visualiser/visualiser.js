/*global visualisationCanvas, terminalInstance*/

const CodeMirror = require('codemirror');
const Beautify   = require('js-beautify').js;
const util       = require("../../structures/modules/utility");
const p5         = require('p5');
 
var _                 = require('codemirror/mode/jsx/jsx');
var VisualisationItem = require('../../structures/classes/VisualisationItem.js');

/* Core Elements */
let pageElement         = document.getElementById("page");
let loadingElement      = document.getElementById("loading_visualiser");

/* Page Elements */
let loadingTitleElement = document.getElementById("loading_visualiser_title");
let quadrantsElement    = document.getElementById("quadrants");
let sidebarElement      = document.getElementById("sidebar");
let opensidebarElement  = document.getElementById("open_sidebar");
let closesidebarElement = document.getElementById("close_sidebar");

/* Quadrant Elements */
// Text Item (Quadrant)
let noitemContentElement = document.getElementById("noitem_content");
let itemContentElement   = document.getElementById("item_content");

// Code Follow (Quadrant)
let codeFollowElement      = document.getElementById('visualiser_text_area'); 
let overwriteButtonElement = document.getElementById('overwrite_button');

// Visualiser (Quadrant)
let canvasID                   = 'visualisation_canvas'; // used in canvas.js
let visualisationCanvasElement = document.getElementById(canvasID);
let playButtonElement          = document.getElementById('play_button');
let pauseButtonElement         = document.getElementById('pause_button');
let forwardButtonElement       = document.getElementById('step_backward_button');
let backwardButtonElement      = document.getElementById('step_forward_button');
let speedSliderElement         = document.getElementById('step_speed');

// Console (Quadrant) [mostly on console.js]

/* Global Variables */
var activeItem = null;
var items      = null;
var speed      = 1; // multiplier

/* Side bar items loader */
(function () {
    items = require("../../structures/datastructures");

    let visualiserItemLoad = function (item) {
        // canvas update (probably auto since active item reference changes!)
        activeItem = item;

        // UI update
        loadingElement.style.display   = "block";
        quadrantsElement.style.display = "none";
        loadingTitleElement.innerHTML  = `Loading '${item.id}'`

        setTimeout(() => {
            loadingElement.style.display   = "none";
            quadrantsElement.style.display = "block";
        }, 1000);

        // Text quadrant update
        noitemContentElement.style.display = "none";
        itemContentElement.innerHTML       = ""; // clear current html

        let titleElement       = document.createElement("h1");
        titleElement.innerHTML = item.descriptiveData.Title;
        itemContentElement.appendChild(titleElement);

        let descriptionElement       = document.createElement("p");
        descriptionElement.innerHTML = item.descriptiveData.Description;
        itemContentElement.appendChild(descriptionElement);

        if (item.descriptiveData.Image !== "") {
            let imageElement = document.createElement("img");
            imageElement.src = "../../" + item.descriptiveData.Image;
            itemContentElement.appendChild(imageElement);
        }

        itemContentElement.appendChild((() => {let x=document.createElement("h1"); x.innerHTML="Operations"; return x })()); // ay lmao

        let operationTextData = item.descriptiveData.Operations;
        for (let operation in operationTextData) {
            let operationTextObject = operationTextData[operation];

            let operationTitleElement            = document.createElement("h2");
            operationTitleElement.style.fontSize = "2.8vh";
            operationTitleElement.innerHTML      = "&rBarr; " + operation;
            itemContentElement.appendChild(operationTitleElement);

            let operationDescriptionElement       = document.createElement("p");
            operationDescriptionElement.innerHTML = `<b>Description:</b> ${operationTextObject.Description}`;
            itemContentElement.appendChild(operationDescriptionElement);

            let operationComplexityElement       = document.createElement("p");
            operationComplexityElement.innerHTML = `<b>Complexity:</b> ${operationTextObject.Complexity}`;
            itemContentElement.appendChild(operationComplexityElement);
        }

        let spaceComplexityElement            = document.createElement("h2");
        spaceComplexityElement.style.fontSize = "2.8vh";
        spaceComplexityElement.innerHTML      = `<b>Space Complexity:</b> ${item.descriptiveData["Space Complexity"]}`;
        itemContentElement.appendChild(spaceComplexityElement);

        // Code quadrant update
        let code = Beautify(activeItem.__proto__.constructor.toString(), { indent_size: 3, space_in_empty_paren: true });
        codeFollowEditor.setValue(code);
        
        setTimeout(() => {
            codeFollowEditor.refresh();
            console.log("Refreshed code follow editor.");
        }, 1000);
        
        console.log(activeItem.id, "loaded successfully!");
    }

    let addSideBarCategory = function (cname) {
        let categoryLabelElement       = document.createElement("h1");
        categoryLabelElement.innerHTML = util.capitalise(cname);
        categoryLabelElement.classList.add("item-section-label");

        sidebarElement.appendChild(categoryLabelElement);
    }

    let addSideBarItem = function (item) {
        let itemLabelElement       = document.createElement("a");
        itemLabelElement.innerHTML = item.id;
        itemLabelElement.classList.add("item-label");

        // on click function
        itemLabelElement.onclick = function (){
            let cname = "hvr-float-shadow";
            this.classList.add(cname);
            let el = this;
            setTimeout(() => el.classList.remove(cname), 1000);
            visualiserItemLoad(item);
        }
        // bind
        itemLabelElement.onclick.bind(itemLabelElement);

        sidebarElement.appendChild(itemLabelElement);
    }

    for (let categoryName in items) {
        let categoryItems = items[categoryName];
        addSideBarCategory(categoryName);
        for (let item of categoryItems) {
            addSideBarItem(item)
        }
    }
})();

/* Event functions */
let waitCanvasResize = () => {
    setTimeout(() => {
        if (visualisationCanvas)
            visualisationCanvas.setup(visualisationCanvasElement.offsetWidth, visualisationCanvasElement.offsetHeight);
    }, 800);
}

opensidebarElement.onclick = function() {
    pageElement.style.marginLeft   = "17%";
    pageElement.style.width        = "83%";
    sidebarElement.style.width     = "17%";
    sidebarElement.style.display   = 'inline-block';
    opensidebarElement.innerHTML   = "|";
    opensidebarElement.style.color = "#818181";
    waitCanvasResize();
}

closesidebarElement.onclick = function() {
    pageElement.style.marginLeft   = "0%";
    pageElement.style.width        = "100%";
    sidebarElement.style.width     = "0%";
    sidebarElement.style.display   = "block";
    opensidebarElement.innerHTML   = "&#9776; Open Sidebar";
    opensidebarElement.style.color = "white";
    waitCanvasResize();
}

playButtonElement.onclick = function () {
    visualisationCanvas.noLoop = false;
    terminalInstance.write("Canvas animation resumed!");
}

pauseButtonElement.onclick = function () {
    visualisationCanvas.noLoop = true;
    terminalInstance.write("Canvas animation paused!");
}

backwardButtonElement.onclick = function () {

}

forwardButtonElement.onclick = function () {

}

speedSliderElement.onchange = function () {
    speed = speedSliderElement.value;
    terminalInstance.write(`Animation speed multiplier changed to: ${speed}`);
}

overwriteButtonElement.onclick = function () {
    alert("Working on it!");
}

/* Code mirror initialisation */
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

codeFollowEditor.setCode = function (func, beautifyData={ indent_size: 3, space_in_empty_paren: true }) {
    // Copy operation code to editor
    var code = Beautify(func.toString(), beautifyData);
    codeFollowEditor.setValue(code);
}

codeFollowEditor.resetCode = function (beautifyData={ indent_size: 3, space_in_empty_paren: true }) {
    if (activeItem === null ) {
        codeFollowEditor.setValue(DEFAULT_CODEFOLLOW_STRING);
        return;
    }

    var code = Beautify(activeItem.__proto__.constructor.toString(), beautifyData); 
    codeFollowEditor.setValue(code);
}

