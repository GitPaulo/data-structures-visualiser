/* global util, VisualisationItem, activeItem*/
class BinaryHeap extends VisualisationItem {
	constructor(itemData) {
        const length = 15;
		super(
			"Binary Heap", 
			itemData,
			{
                // Children(A[i]) = A[2i+1], A[2i+2]
                "num_elements" : 0,
                "array"        : Array.from({length}, (v, i) => new BinaryHeap.WrapElement(length, i)), // Array of Array nodes
            } 
		);
	}

	async* insert(value) {
		// Check paramas
		value = Number(value);

		if (isNaN(value))
			return { success:false, message:`Invalid paremeter! Parameter 'value' must be a number!` };

        if (this.state.num_elements >= this.state.array.length)
            return { success:false, message:`The heap is full!` };

        /***** Add new node at the end *****/
        let i          = this.state.num_elements;
        let newElement = this.state.array[i];

        newElement.setValues(value);
        newElement.setColors(this.constructor.COLORS.success);
		
		// define Step
		await this.step() && (yield);

        newElement.resetColors();
        
        /***** Bubble up! *****/
        let j = i;
        let currentElement = newElement;
        while (j > 0) {
            let pi            = Math.floor((j-1)/2);
            let parentElement = activeItem.state.array[pi];
            
            let pvalue = parentElement.resolveValue();
            let nvalue = currentElement.resolveValue();
            
            currentElement.setBorderColors(this.constructor.COLORS.success);

            // define Step
            await this.step() && (yield);

            parentElement.setBorderColors(this.constructor.COLORS.success);

            // define Step
            await this.step() && (yield);

            let completed = pvalue < nvalue;
            let color     = completed ? this.constructor.COLORS.success : this.constructor.COLORS.fail;

            currentElement.setColors(color);
            parentElement.setColors(color);
    
            // define Step
            await this.step() && (yield);

            currentElement.resetColors();
            parentElement.resetColors();

            if (completed)
                break;
            
            parentElement.setValues(nvalue);
            currentElement.setValues(pvalue);

            j = pi;
            currentElement = parentElement;
        }
        
        // Increment num elements
        this.state.num_elements++;

		// Return result
		return { success:true, message:`Inserted ${value} in the heap and mainted heap-property!` };
	}

	async* remove() {
        // check state
        if (this.state.num_elements <= 0)
            return { success:false, message:`The heap is empty!` };

        /***** Remove top element *****/
        let nthElement  = this.state.array[this.state.num_elements-1];
        let rootElement = this.state.array[0];
        
        // Decrement num elements!
        this.state.num_elements--;

        if (nthElement == rootElement) {
            nthElement.setColors(this.constructor.COLORS.fail);

            // define a step
            await this.step() && (yield);
    
            nthElement.resetColors();
            nthElement.setValues(null);
            return { success:true, message:`Root node removed!` };
        }

        let nthValue = nthElement.resolveValue();
        nthElement.setColors(this.constructor.COLORS.pointer);
        
        // define a step
        await this.step() && (yield);

        rootElement.setColors(this.constructor.COLORS.fail);

        // define a step
        await this.step() && (yield);

        nthElement.resetColors();
        nthElement.setValues(null);

        // define a step
        await this.step() && (yield);
        
        rootElement.setValues(nthValue);
        rootElement.setColors(this.constructor.COLORS.success);

        // define Step
        await this.step() && (yield);

        rootElement.resetColors();

        /***** Trickle down! *****/
        let n = this.state.num_elements;
        let i = 0;
        do {
            let j = -1;

            let currentElement = this.state.array[i];
            let cvalue         = currentElement.resolveValue();

            let ri                = Math.floor(2*i + 2);
            let rightChildElement = this.state.array[ri];
            let rvalue            = rightChildElement.resolveValue();

            let li               = Math.floor(2*i + 1);
            let leftChildElement = this.state.array[li];
            let lvalue           = leftChildElement.resolveValue();

            console.log({cvalue, rvalue, lvalue})

            if (rvalue !== null && rvalue < cvalue) {
                if (lvalue < rvalue) {
                    j = li;
                } else {
                    j = ri;
                }
            } else {
                if (lvalue !== null && lvalue < cvalue) {
                    j = li;
                }
            }
            
            if (j >= 0) {
                let jelement = this.state.array[j];
                let jvalue   = jelement.resolveValue();

                currentElement.setBorderColors(this.constructor.COLORS.success);

                // define step
                await this.step() && (yield);
    
                jelement.setBorderColors(this.constructor.COLORS.success);
    
                // define step
                await this.step() && (yield);

                jelement.setColors(this.constructor.COLORS.fail);
                currentElement.setColors(this.constructor.COLORS.fail);

                // define a step
                await this.step() && (yield);
                
                jelement.resetColors();
                currentElement.resetColors();

                jelement.setValues(cvalue);
                currentElement.setValues(jvalue);
            }

            i = j;

            // define a step
            await this.step() && (yield);

        } while (i >= 0); 

		return { success:true, message:`Removed element from heap and maintained heap-property!` };
	}
    
    // Complex object and needs extra stuff - edges to be drawn!
    draw(env) {
		for (let element of this.state.array) {
			element.draw(env);
        }
	}
}

BinaryHeap.prototype.insert.help = `Inserts a (value) into the heap. (maintains heap property!)`;
BinaryHeap.prototype.remove.help = `Removes the top element out of the heap. (mantains heap property!)`;

BinaryHeap.WrapElement = class {
    constructor(arrayLength, index, value) {
        this.node = new BinaryHeap.NodeGraphic(index);
        this.cell = new BinaryHeap.CellGraphic(arrayLength, index); 
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

    setValues(value){
        this.node.value = value;
        this.cell.value = value;
    }

    resolveValue(){
        if (this.node.value !== this.cell.value)
            throw "Uh oh cell and node dont match?";

        return this.node.value;
    }

    draw(env) {
        this.node.draw(env);
        this.cell.draw(env);
    }
}

BinaryHeap.CellGraphic = class {
	constructor(arrayLength, index) {
		this.arrayLength = arrayLength;

		this.index  = index;
		this.value  = null;
		
		this.width  = 48;
		this.height = 48;
		this.x      = null;
		this.y 		= null;

		this.resetColor();
	}
	
	setBorderColor(color) {
		this.borderColor = color;
	}

	setColor(color) {
		this.previousRectColor = this.rectColor;
		this.rectColor 		   = color;
	}

	setToLastColor() {
		if (this.previousRectColor) 
			this.rectColor = this.previousRectColor;
		else
			this.resetColor();
	}

	resetColor() {
		this.rectColor   = [255, 255, 255];
		this.borderColor = [70, 70, 70];
		this.textColor   = [0, 0, 0];
	}

	draw(env) {
		let offset_x = (env.width - (this.arrayLength * this.width))/2;
		let offset_y = env.height*.8;

		// draw box
		this.x = offset_x + this.width*this.index;
		this.y = offset_y - this.height/2;
		
		env.fill(...this.borderColor);
		env.rect(this.x, this.y, this.width, this.height);
		env.fill(...this.rectColor);
		env.rect(this.x+4, this.y+4, this.width-8, this.height-8);

        // draw value
        if (this.value !== null) {
            env.textFont(env.NORMAL_FONT);
            env.textSize(30);

            let value = String(this.value);
            let tw = env.textWidth(value);
            let th = env.textSize();

            env.fill(...this.textColor);
            env.text(value, this.x + this.width/2 - tw/2, this.y + this.height/2 + th/2.5);
        }

		// draw index
		env.textSize(20);

		let index = "[" + String(this.index) + "]";
        let tw2 = env.textWidth(index);
        let th2 = env.textSize();

		env.fill(...this.rectColor);
		env.text(index, this.x + this.width/2 - tw2/2, this.y + this.height + th2 + 10);
	}
}

BinaryHeap.NodeGraphic = class {
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
        this.innerColor  = [255, 255, 255];
        this.textColor   = [40, 40, 40];
    }

    draw(env) {
        // Dont draw nodes that dont exist!
        if (this.value === null)
            return;

        // Specific to root and others
        if (this.index === 0) { // root
            this.x = env.width/2;
            this.y = this.radius/1.8;
        } else { // based of parent!
            let pi     = Math.floor((this.index-1)/2);
            let parent = activeItem.state.array[pi].node;
            
            let d = Math.floor(Math.log2(this.index+1)); // Get depth of node by index
            let offset = (this.radius*2 + 100) / Math.pow(2, d-1); // based on depth!

            // Even indices are right tree nodes! Odd are left!
            this.x = (this.index % 2) === 0 ? parent.x + offset : parent.x - offset;
            this.y = parent.y + this.radius*1.5;
           
            // line to parent
            env.strokeWeight(6);
            env.stroke(255, 255, 255);
            env.line(parent.x, parent.y + this.radius/2, this.x, this.y);
            env.stroke(0,0,0)
            env.strokeWeight(1); 
        }

        // border
        env.fill(this.borderColor);
        env.ellipse(this.x, this.y, this.radius);

        // inner
        env.fill(this.innerColor);
        env.ellipse(this.x, this.y, this.radius-this.borderThickness);

        // draw value
		env.textFont(env.NORMAL_FONT);
		env.textSize(26);

		let value = String(this.value);
        let tw = env.textWidth(value);
        let th = env.textSize();

		env.fill(...this.textColor);
        env.text(value, this.x - tw/2, this.y + th/2.5);
    }
}

module.exports = BinaryHeap;