/* global VisualisationItem, activeItem, util, logger */

class BinarySearchTree extends VisualisationItem {
    constructor(itemData) {
        const length = 15;
        super(
            "Binary Search Tree",
            itemData, {
                // Children(A[i]) = A[2i+1], A[2i+2]
                "num_elements": 0,
                "array": Array.from({
                    length
                }, (v, i) => new BinarySearchTree.WrapElement(length, i)), // Array of Array nodes
            }
        );
    }

    async *insert(value) {
        // check params
        const MAX_SIZE = this.state.array.length;

        if (this.state.num_elements >= MAX_SIZE)
            return {
                success: false,
                message: `The Binary Search Tree is full!`
            };

        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid paremeter! Parameter 'value' must be a number!`
            };

        let rootElement = this.state.array[0];
        let currentElement = rootElement;
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();

        /***** Search for value's place *****/
        while (cvalue !== null) {
            currentElement.setBorderColors(this.constructor.COLORS.success);

            // Define Step
            await this.step(`Highlighting ${cvalue}`) && (yield);

            currentElement.resetColors();

            let nextIndex = -1;

            if (cvalue <= value) { // left
                nextIndex = this.rightChildOf(cindex);
            } else { // right
                nextIndex = this.leftChildOf(cindex);
            }

            if (nextIndex < 0 || nextIndex >= MAX_SIZE)
                return {
                    success: false,
                    message: "Binary Search Tree cannot grow beyond the current max-depth!"
                };

            currentElement = this.state.array[nextIndex];
            cvalue = currentElement.resolveValue();
            cindex = currentElement.resolveIndex();
        }

        /***** Insert the Value  *****/
        logger.print({
            currentElement,
            cindex,
            cvalue
        })
        let newElement = this.state.array[cindex];

        newElement.setValues(value);
        newElement.setColors(this.constructor.COLORS.success);

        // define Step
        await this.step(`Inserting ${value} at [${cindex}]`) && (yield);

        newElement.resetColors();

        this.state.num_elements++;

        return {
            success: true,
            message: `Inserted ${value} to the Binary Search Tree!`
        };
    }

    async *remove(value) {
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Search Tree is empty!`
            };

        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid paremeter! Parameter 'value' must be a number!`
            };

        let rootElement = this.state.array[0];
        let currentElement = rootElement;
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();
        let found = false;

        const MAX_SIZE = this.state.array.length;

        /***** Search for value's place *****/
        while (cvalue !== null) {
            currentElement.setBorderColors(this.constructor.COLORS.success);

            // Define Step
            await this.step(`Highlighting ${cvalue}`) && (yield);

            currentElement.resetColors();

            let nextIndex = -1;

            if (cvalue === value) { // found, current
                found = true;
                break;
            } else if (cvalue <= value) { // left
                nextIndex = this.rightChildOf(cindex);
            } else { // right
                nextIndex = this.leftChildOf(cindex);
            }

            if (nextIndex < 0 || nextIndex >= MAX_SIZE)
                break;

            currentElement = this.state.array[nextIndex];
            cvalue = currentElement.resolveValue();
            cindex = currentElement.resolveIndex();
        }

        /***** If found remove the value  *****/

        if (!found)
            return {
                success: false,
                message: `Could not find ${value} in the Binary Search tree!`
            };

        let newElement = this.state.array[cindex];
        newElement.setColors(this.constructor.COLORS.fail);

        // define Step
        await this.step(`Removing ${cvalue}...`) && (yield);

        newElement.resetColors();
        newElement.setValues(null);

        // define step
        await this.step(`Set value at [${cindex}] to null`) && (yield);

        this.state.num_elements--;

        return {
            success: true,
            message: `Found and removed ${value} fro the Binary Search Tree!`
        };
    }

    async *search(value) {
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Search Tree is empty!`
            };

        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid paremeter! Parameter 'value' must be a number!`
            };

        let rootElement = this.state.array[0];
        let currentElement = rootElement;
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();
        let found = false;

        const MAX_SIZE = this.state.array.length;

        /***** Search for value's place *****/
        while (cvalue !== null) {
            currentElement.setBorderColors(this.constructor.COLORS.success);

            // Define Step
            await this.step(`Highlighting ${cvalue}`) && (yield);

            currentElement.resetColors();

            let nextIndex = -1;
            let fcolor = this.constructor.COLORS.fail;

            if (cvalue === value) { // found, current
                found = true;
                fcolor = this.constructor.COLORS.success;
            } else if (cvalue <= value) { // left
                nextIndex = this.rightChildOf(cindex);
            } else { // right
                nextIndex = this.leftChildOf(cindex);
            }

            currentElement.setColors(fcolor);

            // Define Step
            await this.step(`Comparison: (${cvalue} == ${value}) = ${found}`) && (yield);

            currentElement.resetColors();

            if (found || nextIndex < 0 || nextIndex >= MAX_SIZE)
                break;

            currentElement = this.state.array[nextIndex];
            cvalue = currentElement.resolveValue();
            cindex = currentElement.resolveIndex();
        }

        let fstr = found ? "Found" : "Could not find"
        return {
            success: found,
            message: `${fstr} ${value} in the Binary Search tree!`
        };
    }

    // Extra functions - For Binary trees!
    parentOf(index) {
        return Math.floor((index - 1) / 2);
    }

    rightChildOf(index) {
        return Math.floor(2 * index + 2);
    }

    leftChildOf(index) {
        return Math.floor(2 * index + 1);
    }

    depthOf(index) {
        return Math.floor(Math.log2(index + 1));
    }

    // Complex object and needs extra stuff - edges to be drawn!
    draw(env) {
        for (let element of this.state.array) {
            element.draw(env);
        }
    }
}

BinarySearchTree.prototype.insert.help = `Inserts a (value) in the BST.`;
BinarySearchTree.prototype.remove.help = `Removes a (value) from the BST.`;
BinarySearchTree.prototype.search.help = `Search for the existance of a (value) in the BST`;

BinarySearchTree.WrapElement = class {
    constructor(arrayLength, index) {
        this.node = new BinarySearchTree.NodeGraphic(index);
        this.cell = new BinarySearchTree.CellGraphic(arrayLength, index);
    }

    setBorderColors(color) {
        this.node.setBorderColor(color);
        this.cell.setBorderColor(color);
    }

    setColors(color) {
        this.node.setColor(color);
        this.cell.setColor(color);
    }

    resetColors() {
        this.node.resetColor();
        this.cell.resetColor();
    }

    setValues(value) {
        this.node.value = value;
        this.cell.value = value;
    }

    resolveValue() {
        if (this.node.value !== this.cell.value)
            throw "Uh oh, cell and node value dont match?";

        return this.node.value;
    }

    resolveIndex() {
        if (this.node.index !== this.cell.index)
            throw "Uh oh, cell and node index dont match?";

        return this.node.index;
    }

    draw(env) {
        this.node.draw(env);
        this.cell.draw(env);
    }
}

BinarySearchTree.CellGraphic = class {
    constructor(arrayLength, index) {
        this.arrayLength = arrayLength;

        this.index = index;
        this.value = null;

        this.width = 48;
        this.height = 48;
        this.x = null;
        this.y = null;

        this.resetColor();
    }

    setBorderColor(color) {
        this.borderColor = color;
    }

    setColor(color) {
        this.previousRectColor = this.rectColor;
        this.rectColor = color;
    }

    setToLastColor() {
        if (this.previousRectColor)
            this.rectColor = this.previousRectColor;
        else
            this.resetColor();
    }

    resetColor() {
        this.rectColor = [255, 255, 255];
        this.borderColor = [70, 70, 70];
        this.textColor = [0, 0, 0];
    }

    draw(env) {
        let offset_x = (env.width - (this.arrayLength * this.width)) / 2;
        let offset_y = env.height * .8;

        // draw box
        this.x = offset_x + this.width * this.index;
        this.y = offset_y - this.height / 2;

        env.fill(...this.borderColor);
        env.rect(this.x, this.y, this.width, this.height);
        env.fill(...this.rectColor);
        env.rect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

        // draw value
        if (this.value !== null) {
            env.textFont(env.NORMAL_FONT);
            env.textSize(30);

            let value = String(this.value);
            let tw = env.textWidth(value);
            let th = env.textSize();

            env.fill(...this.textColor);
            env.text(value, this.x + this.width / 2 - tw / 2, this.y + this.height / 2 + th / 2.5);
        }

        // draw index
        env.textSize(20);

        let index = "[" + String(this.index) + "]";
        let tw2 = env.textWidth(index);
        let th2 = env.textSize();

        env.fill(...this.rectColor);
        env.text(index, this.x + this.width / 2 - tw2 / 2, this.y + this.height + th2 + 10);
    }
}

BinarySearchTree.NodeGraphic = class {
    constructor(index) {
        this.value = null;
        this.index = index;

        this.x = null;
        this.y = null;

        this.radius = 48;
        this.borderThickness = 6;

        this.resetColor();
    }

    setBorderColor(color) {
        this.borderColor = color;
    }

    setColor(color) {
        this.innerColor = color;
    }

    setTextColor(color) {
        this.textColor = color;
    }

    resetColor() {
        this.borderColor = [20, 20, 20];
        this.innerColor = [255, 255, 255];
        this.textColor = [40, 40, 40];
    }

    draw(env) {
        // Dont draw nodes that dont exist!
        if (this.value === null)
            return;

        // Specific to root and others
        if (this.index === 0) { // root
            this.x = env.width / 2;
            this.y = this.radius / 1.8;
        } else { // based of parent!
            let pi = Math.floor((this.index - 1) / 2);
            let parent = activeItem.state.array[pi].node;

            let d = Math.floor(Math.log2(this.index + 1)); // Get depth of node by index
            let offset = (this.radius * 2 + 100) / Math.pow(2, d - 1); // based on depth!

            // Even indices are right tree nodes! Odd are left!
            this.x = (this.index % 2) === 0 ? parent.x + offset : parent.x - offset;
            this.y = parent.y + this.radius * 1.5;

            // line to parent
            env.strokeWeight(6);
            env.stroke(255, 255, 255);
            env.line(parent.x, parent.y + this.radius / 2, this.x, this.y);
            env.stroke(0, 0, 0)
            env.strokeWeight(1);
        }

        // border
        env.fill(this.borderColor);
        env.ellipse(this.x, this.y, this.radius);

        // inner
        env.fill(this.innerColor);
        env.ellipse(this.x, this.y, this.radius - this.borderThickness);

        // draw value
        env.textFont(env.NORMAL_FONT);
        env.textSize(26);

        let value = String(this.value);
        let tw = env.textWidth(value);
        let th = env.textSize();

        env.fill(...this.textColor);
        env.text(value, this.x - tw / 2, this.y + th / 2.5);
    }
}

module.exports = BinarySearchTree;