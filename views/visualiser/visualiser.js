/*global visualisationCanvas, terminalInstance, codeFollowEditor*/
const Beautify   = require('js-beautify').js;
const util       = require("../../structures/modules/utility");
const p5         = require('p5');
 
// Load codemiror mode for JavaScript
require('codemirror/mode/jsx/jsx');

// Load as Global now so we can extend without require later :)
var VisualisationItem                    = require('../../structures/classes/VisualisationItem.js');
var { PerformanceObserver, performance } = require('perf_hooks');

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
let forwardButtonElement       = document.getElementById('step_forward_button');
let backwardButtonElement      = document.getElementById('step_backward_button');
let speedSliderElement         = document.getElementById('step_speed');

// Console (Quadrant) [mostly on console.js]

/**************** Active Item Definition ****************/
// Represents the active data structure meta data!
// (NOT THE DS ITSELF!)
var activeItem      = null;
var items           = null;

// Operation object literal to deal with the DS operation coroutines in a easy manner!
let controlObject = {       
    operation   : null,
    shouldYield : false,
    shouldReset : false,
    resetOnSC   : false,
    inProgress  : false,
    isPaused    : false,
    speed       : 1,
    offset      : 0,
    setSpeed : function (speed) {
        this.speed = util.clamp(speed, 0, 10);
        terminalInstance.write(`Set animation speed multiplier to: ${this.speed}`);
    },
    assign : function (operation) {
        this.operation  = operation;
        
        // Store pre operation state in activeItem.storage[0]
        activeItem.storeState();
        
        console.log("Assigned new active operation coroutine: ", operation);
        console.log("Stored intial state in storage[0]", activeItem.storage[0]);
    },
    terminate : function (fromStop, rvalue) {
        this.shouldYield = true;
        this.operation.return().then(() => {          
            this.operation   = null;
            this.shouldYield = false;
            this.inProgress  = false;
            this.isPaused    = false;

            if (fromStop || this.shouldReset) {
                if (fromStop || this.resetOnSC && rvalue.success || !this.resetOnSC ) {
                    activeItem.resetState();
                }
            }

            activeItem.clearStorage();
            codeFollowEditor.resetCode();
            
            if (!rvalue.success)
                terminalInstance.write("[OPERATION UNSUCCESSFULL]");
            else
                terminalInstance.write("[OPERATION SUCCESSFULL]");

            terminalInstance.write(rvalue.message);
        });
    },
    resume : function (input) {
        if (this.inProgress && !this.isPaused) {
            terminalInstance.write("Animation already in progress!");
            return;
        }
        
        if (this.offset !== 0) // return to where we left!
            activeItem.shiftStateToResume();

        if (this.isPaused)
            terminalInstance.write("Animation resumed!");

        this.inProgress  = true;
        this.shouldYield = false;
        this.isPaused    = false;
        this.offset      = 0;

        this.operation.next(input).then((result) => {
            // If coroutine is not done that means it yeiled thus there was a pause!
            if (result.done === false) { 
                terminalInstance.write("Operation paused successfully!");
            } else { // animation ended!
                console.log(result)
                this.terminate(false, result.value);
            }
        }).catch((error) => {
            terminalInstance.write(`[CAUGHT ERROR] ${error}`);
            throw error;
        });
    },
    pause : function () {
        if (this.isPaused) {
            terminalInstance.write("Animation is already paused!");
            return;
        }

        this.shouldYield = true;
        this.isPaused    = true;
    },
    stop : function () {
        if (!this.inProgress) {
            terminalInstance.write("There is no operation animation to stop!");
            return;
        }

        this.terminate(true, {success:false, message:`Animation was forced to stop.`});
    },
    back : function () {
        if (!this.isPaused) {
            terminalInstance.write("Animation needs to be paused before steping back/forward!");
            return;
        }

        let n = activeItem.storage.length-1;

        if (!activeItem.storage[n+this.offset-1]) {
            terminalInstance.write("Cannot move to a backward state!");
            return;
        }

        this.offset--;
        let pointer = n + this.offset;
        
        activeItem.shiftState(pointer);
        terminalInstance.write(`Moving to a backward state. Storage pointer: ${pointer}`);
    },
    forward : function () {
        if (!this.isPaused) {
            terminalInstance.write("Animation needs to be paused before steping back/forward!");
            return;
        }

        let n = activeItem.storage.length-1;

        if (!activeItem.storage[n+this.offset+1]) {
            terminalInstance.write("Cannot move to a forward state!");
            return;
        }

        this.offset++;
        let pointer = n + this.offset;
        
        activeItem.shiftState(pointer);
        terminalInstance.write(`Moving to a forward state. Storage pointer: ${pointer}`);
    },
};

// Just doing this because i miss meta-tables :)
let metaTable = {
    operationControls : [ "resume", "pause", "stop", "back", "forward" ],
    get: function (target, name) {
        // console.log("kek", name, target, target[name]);
        if (typeof target[name] !== "undefined") {
            if (this.operationControls.indexOf(name) > -1 && target.operation === null){
                return () => terminalInstance.write("There is no active operation to control!");
            }
        } else {
            throw `Invalid access to active operation object! target: ${target}, ${name}`;
        }
        return target[name];
    }
}

// Our global boy :)
var activeOperation = new Proxy(controlObject, metaTable);

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
        codeFollowEditor.setCode(activeItem.__proto__.constructor);
        
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
};

playButtonElement.onclick = function () {
    activeOperation.resume();
}

pauseButtonElement.onclick = function () {
    activeOperation.pause();
}

backwardButtonElement.onclick = function () {
    activeOperation.back();
}

forwardButtonElement.onclick = function () {
    activeOperation.forward();
}

speedSliderElement.onchange = function () {
    activeOperation.setSpeed(speedSliderElement.value);
}

overwriteButtonElement.onclick = function () {
    if (activeItem === null)
        return alert("Select a data structure first!");

    let newClassFunction = null;
    
    try {
        newClassFunction = eval("(" + codeFollowEditor.getValue() + ")"); // parentehsis turn block into expression
    } catch (error) {
        terminalInstance.write(`[MEMORY OVERWRITE ERROR] ${error}`);
        return;
    }

    if (newClassFunction.name !== activeItem.constructor.name)
        return alert("Not allowed to edit non class specific code");

    let protoKeys = Object.getOwnPropertyNames(newClassFunction.prototype);
    for (let key of protoKeys) {
        if (key === "constructor")
            continue;

        console.log(">>>", key);
        activeItem[key] = newClassFunction.prototype[key];
    }

    alert("Code for the current data structure overwritten!");
}