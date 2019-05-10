/* global VisualisationItem, activeItem, util, logger */

class BinaryTree extends VisualisationItem {
    constructor(itemData) {
        const length = 15;
        super(
            "Binary Tree",
            itemData, {
                // Children(A[i]) = A[2i+1], A[2i+2]
                "num_elements": 0,
                "array": Array.from({
                    length
                }, (v, i) => new BinaryTree.WrapElement(length, i)), // Array of Array nodes
            }
        );
    }

    async *insert(value) {
        // check params
        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid paremeter! Parameter 'value' must be a number!`
            };

        let btArray = this.state.array;
        let n = this.state.num_elements;
            
        const MAX_SIZE = btArray.length;

        if (n >= MAX_SIZE)
            return {
                success: false,
                message: `The Binary Tree is full!`
            };

        let pointer = n;
        let newElement = btArray[pointer];
        newElement.setValues(value);
        newElement.setColors(this.constructor.COLORS.success);

        // define Step
        await this.step(`Set value at [${pointer}] to ${value}`) && (yield);

        newElement.resetColors();

        this.state.num_elements++;

        return {
            success: true,
            message: `Inserted ${value} to the Binary Tree!`
        };
    }

    async *remove() {
        // check params
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Tree is empty!`
            };

        let btArray = this.state.array;
        let pointer = this.state.num_elements - 1;
        let newElement = btArray[pointer];
        newElement.setValues(null);
        newElement.setColors(this.constructor.COLORS.fail);

        // define Step
        await this.step(`Set value at [${pointer}] to null`) && (yield);

        newElement.resetColors();

        this.state.num_elements--;

        return {
            success: true,
            message: `Remove last inserted node from Binary Tree`
        };
    }

    // Multi operation support: pre-order, post-order, in-order
    search(value, method) {
        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid parameter! Parameter 'value' must be a number!`
            };

        let sfunc = this.constructor.searchingMethods[method];

        if (typeof sfunc === "undefined")
            return {
                success: false,
                message: `Invalid searching method! Check !instructions.`
            };

        return {
            success: true,
            coroutine: sfunc,
            args: [value, method]
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

// Current object of 'activeItem' is bound to these methods! (this === activeItem)
// Same arguments as the function that returns these!
// Note: A stack is used instead of recursion for the transversal algorithms to keep everything in the Generative Function
BinaryTree.searchingMethods = {
    inorder: async function* (value, method) {
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Tree is empty!`
            };
        
        let btArray = this.state.array;
        let currentElement = btArray[0]; // Start at root
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();

        let stack = [];
        let found = false;

        while (cvalue != null || stack.length > 0) {
            // Transverse left subtree first and push nodes to stack.
            while (cvalue !== null) {
                // Push currentElement
                stack.push(currentElement);

                let leftChild = btArray[this.leftChildOf(cindex)];
                currentElement = leftChild;

                cvalue = !currentElement ? null : currentElement.resolveValue();
                cindex = !currentElement ? null : currentElement.resolveIndex();
            }

            // The relevant node!
            currentElement = stack.pop();
            cvalue = !currentElement ? null : currentElement.resolveValue();
            cindex = !currentElement ? null : currentElement.resolveIndex();

            currentElement.setBorderColors(this.constructor.COLORS.success);
            // define Step
            await this.step(`Highlighting ${cvalue}`) && (yield);
            currentElement.resetColors();

            if (cvalue === value)
                found = true;

            currentElement.setColors(found ? this.constructor.COLORS.success : this.constructor.COLORS.fail);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (found)
                break;

            // Check right subtree
            let rightChild = btArray[this.rightChildOf(cindex)];
            currentElement = rightChild;
            cvalue = !currentElement ? null : currentElement.resolveValue();
            cindex = !currentElement ? null : currentElement.resolveIndex();
        }

        let fstr = found ? "" : " not";
        return {
            success: found,
            message: `Element ${value} has${fstr} been found by ${method} transversal method!`
        };
    },
    outorder: async function* (value, method) {
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Tree is empty!`
            };

        let btArray = this.state.array;
        let currentElement = btArray[0]; // Start at root
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();

        let stack = [];
        let found = false;

        while (cvalue !== null || stack.length > 0) {
            // Transverse right subtree first and push nodes to stack.
            while (cvalue !== null) {
                // Push currentElement
                stack.push(currentElement);

                let rightChild = btArray[this.rightChildOf(cindex)];
                currentElement = rightChild;

                cvalue = !currentElement ? null : currentElement.resolveValue();
                cindex = !currentElement ? null : currentElement.resolveIndex();
            }

            // Pop the relevant node!
            currentElement = stack.pop();
            cvalue = !currentElement ? null : currentElement.resolveValue();
            cindex = !currentElement ? null : currentElement.resolveIndex();

            currentElement.setBorderColors(this.constructor.COLORS.success);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (cvalue === value)
                found = true;

            currentElement.setColors(found ? this.constructor.COLORS.success : this.constructor.COLORS.fail);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (found)
                break;

            // Check left subtree
            let leftChild = btArray[this.leftChildOf(cindex)];
            currentElement = leftChild;
            cvalue = !currentElement ? null : currentElement.resolveValue();
            cindex = !currentElement ? null : currentElement.resolveIndex();
        }

        let fstr = found ? "" : " not";
        return {
            success: found,
            message: `Element ${value} has${fstr} been found by ${method} transversal method!`
        };
    },
    preorder: async function* (value, method) {
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Tree is empty!`
            };

        let btArray = this.state.array;
        let currentElement = btArray[0]; // Start at root
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();

        let stack = [currentElement]; // push root to stack
        let found = false;

        while (cvalue !== null && stack.length > 0) {
            // Pop the relevant node!
            currentElement = stack.pop();
            cvalue = currentElement.resolveValue();
            cindex = currentElement.resolveIndex();

            currentElement.setBorderColors(this.constructor.COLORS.success);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (cvalue === value)
                found = true;

            currentElement.setColors(found ? this.constructor.COLORS.success : this.constructor.COLORS.fail);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (found)
                break;

            // Push right and left child on stack if they exist
            let rightChild = btArray[this.rightChildOf(cindex)];

            if (typeof rightChild !== "undefined" && rightChild.resolveValue() !== null)
                stack.push(rightChild);

            // Left child
            let leftChild = btArray[this.leftChildOf(cindex)];

            if (typeof leftChild !== "undefined" && leftChild.resolveValue() !== null)
                stack.push(leftChild);
        }

        let fstr = found ? "" : " not";
        return {
            success: found,
            message: `Element ${value} has${fstr} been found by ${method} transversal method!`
        };
    },
    postorder: async function* (value, method) { // might be wrong!
        if (this.state.num_elements <= 0)
            return {
                success: false,
                message: `The Binary Tree is empty!`
            };


        let btArray = this.state.array;
        let currentElement = btArray[0]; // Start at root
        let cvalue = currentElement.resolveValue();
        let cindex = currentElement.resolveIndex();

        let stack = [currentElement]; // push root to stack
        let found = false;

        while (cvalue != null && stack.length > 0) {
            // Pop the relevant node!
            currentElement = stack.pop();
            cvalue = currentElement.resolveValue();
            cindex = currentElement.resolveIndex();

            currentElement.setBorderColors(this.constructor.COLORS.success);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (cvalue === value)
                found = true;

            currentElement.setColors(found ? this.constructor.COLORS.success : this.constructor.COLORS.fail);
            // define Step
            await this.step() && (yield);
            currentElement.resetColors();

            if (found)
                break;

            // Left child
            let leftChild = btArray[this.leftChildOf(cindex)];

            if (typeof leftChild !== "undefined" && leftChild.resolveValue() !== null)
                stack.push(leftChild);

            // Push right and left child on stack if they exist
            let rightChild = btArray[this.rightChildOf(cindex)];

            if (typeof rightChild !== "undefined" && rightChild.resolveValue() !== null)
                stack.push(rightChild);
        }

        let fstr = found ? "" : " not";
        return {
            success: found,
            message: `Element ${value} has${fstr} been found by ${method} transversal method!`
        };
    },
}

BinaryTree.prototype.insert.help = `Insert a (value) in to the binary tree. At the deepest available node.`;
BinaryTree.prototype.remove.help = `Remove an element from the binary tree. At the deepest taken node.`;
BinaryTree.prototype.search.help = `Searches the Binary Tree.\n (value): Value to search in tree. \n (type): ${Object.keys(BinaryTree.searchingMethods)+""}`;

BinaryTree.WrapElement = class {
    constructor(arrayLength, index) {
        this.node = new BinaryTree.NodeGraphic(index);
        this.cell = new BinaryTree.CellGraphic(arrayLength, index);
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

BinaryTree.CellGraphic = class {
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

BinaryTree.NodeGraphic = class {
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

module.exports = BinaryTree;