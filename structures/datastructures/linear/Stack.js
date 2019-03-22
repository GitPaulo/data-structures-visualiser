/* global util, VisualisationItem, activeItem*/
class Stack extends VisualisationItem {
	constructor(itemData) {
		const length = 6;
		super(
			"Stack", 
			itemData,
			{
				pointer : new Stack.PointerGraphic(),
				array   : Array.from({length}, (v, i) => new Stack.ElementGraphic(length, i))
			}, // state 
		);
	}

	// In detail example:
	async* insert(value) {
		let pointer 	= this.state.pointer;
		let nextElement = this.state.array[pointer.value + 1];

		if (typeof nextElement === "undefined") 
			return { success:false, message:`Stack is full!` };

		pointer.value++;

		// Define a step
		this.shouldYield() ? yield : this.storeState();
		await this.sleep(400);

		nextElement.value = value;
		nextElement.setColor(Stack.COLORS.success);

		// Define a step
		this.shouldYield() ? yield : this.storeState();
		await this.sleep();

		nextElement.resetColor();
		
		return { success:true, message:`Pushed ${value} on to the Stack!` };
	}

	async* remove() {
		let pointer 	   = this.state.pointer;
		let currentElement = this.state.array[pointer.value];

		if (pointer.value <= -1)
			return { success:false, message:`Stack is empty!` };

		pointer.value--;

		// Define a step
		this.shouldYield() ? yield : this.storeState();
		await this.sleep(400)

		let oldvalue = currentElement.value;
		currentElement.value = null;
		currentElement.setColor(Stack.COLORS.fail);

		// Define a step
		this.shouldYield() ? yield : this.storeState();
		await this.sleep();

		currentElement.resetColor();

		return { success:true, message:`Popped ${oldvalue} off the Stack!` };
	}

	async* search(value) {
		yield;
        
		return { success:true, message:`` };
	}

	async *sort(method, type) {
		yield;

		return { success:true, message:`` };
	}

	// Complex state object requires draw override
	draw(env) {
		this.state["pointer"].draw(env);
		
		for (let element of this.state.array) {
			element.draw(env);
		}
	}
}

Stack.prototype.insert.help = ``;
Stack.prototype.remove.help = ``;
Stack.prototype.search.help = ``;
Stack.prototype.sort.help   = ``;

Stack.COLORS = {
	"success" : [50, 255, 50],
	"fail"	  : [255, 60, 50],
	"pointer" : [50, 80, 255],
	"ordered" : [90, 220, 90],
}

Stack.PointerGraphic = class {
	constructor() {
		this.value  = -1;

		this.x      = 0;
		this.y 		= 0;
		this.size   = 22;

		this.resetColor();
	}

	setColor(color) {
		this.color = color;
	}

	setTextColor(color) {
		this.text = color;
	}

	resetColor () {
		this.color   	 = [250, 0, 50];
		this.textColor   = [255, 255, 255];
	}

	draw(env) {
		let element, ax, ay;

		if (this.value === -1) {
			element = activeItem.state.array[0];
			ax = element.x + this.size/2;
			ay = element.y + element.height + this.size;
		} else {
			element = activeItem.state.array[this.value];
			ax = element.x + element.width + this.size + 15;  
			ay = element.y + this.size;
		}

		let offset = this.size;

		env.fill(...this.color);

		env.push(); // start new drawing state
		env.translate(ax, ay); // translates to the destination vertex
		env.rotate(env.PI/2*-1); // rotates the arrow point
		env.triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); // draws the arrow point as a triangle
		env.pop();

		env.textFont(env.NORMAL_FONT);
		env.textSize(24);

		let str = "Top Of Stack" + ((this.value === -1 && " (EMPTY)") || "");
		let tw = env.textWidth(str);
		let th = env.textSize();

		env.fill(...this.textColor);
		env.text(str, ax + offset + 10, ay + this.size/2 - 2);
	}
}

Stack.ElementGraphic = class {
	constructor(arrayLength, index, value, structure={width:150,height:50,x:0,y:0}) {
		this.arrayLength = arrayLength;

		this.index  = index;
		this.value  = null;
		
		this.width  = structure.width;
		this.height = structure.height;
		this.x      = structure.x;
		this.y 		= structure.y;

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
		let offset_x = env.width*.5;
		let offset_y = (this.arrayLength * this.height); 

		// draw box
		this.x = offset_x - this.width/2;
		this.y = offset_y - this.height * this.index;
		
		// border
		env.fill(...this.borderColor);
		env.rect(this.x, this.y, this.width, this.height);

		// inner rect
		env.fill(...this.rectColor);
		env.rect(this.x+4, this.y+4, this.width-8, this.height-8);

		// draw value
		if (this.value !== null) {
			env.textFont(env.NORMAL_FONT);
			env.textSize(35);

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
		env.text(index, this.x - tw2 - 10, this.y + this.height/2 + th2/2);
	}
}

module.exports = Stack;