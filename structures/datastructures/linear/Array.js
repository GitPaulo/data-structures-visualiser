/*********
 * NOTES: 
 * 	- "value" comes from console and is a string! Because of JS we can usually ignore this if we use double equals operators.
 *  - Improve highlight for sorting?
 */
class StaticArray extends VisualisationItem {
	constructor(itemData) {
		super("Static Array", itemData);
		
		// Array DS
		this.array = Array.from({length: 10}, (v, i) => new StaticArray.ElementGraphic(this, i, Math.floor((Math.random()*40)-20)));
	}
	
	async insert(index, value) {
		let element   = this.array[index];
		element.value = value;
		await element.highlight([30, 220, 30], 1500);

		return { success:true, message:`Element ${value} inserted at index [${index}]` };
	}

	async remove(index) {
		let element   = this.array[index];
		element.value = 0;
		await element.highlight([220, 30, 30], 1500);

		return { success:true, message:`Element removed from index [${index}]` };
	}

	async search(value) {
		for (let element of this.array) {
			await element.highlight([50, 40, 190], 500);
			if (element.value == value){
				await element.highlight([50, 290, 50], 1200);
				return { found:true, message:`Element was found at position ${element.index}!` };
			} else {
				await element.highlight([220, 60, 50], 700);
			}
		}
		return { found:false, message:`Element was not found in the array!` };
	}

	async sort(method, type) {
        let sfunc = StaticArray.sortingMethods[method];
        
        if (typeof sfunc === "undefined")
            return { success: false, message: `Invalid sorting method! Check !instructions.` };
		
		type = StaticArray.sortingTypes[String(type).toLowerCase()];
		if ( type === "undefined" )
			return { success: false, message: `Invalid type of sorting! Check !instructions.` }; 
		
		codeFollowEditor.setCode(sfunc);
		
		sfunc = sfunc.bind(this);
		await sfunc(type); // start sorting
		
		codeFollowEditor.resetCode();

        return { success: true, message: `Sorting method '${method}' was performed with type '${type}'!` };
	}
	
	draw(env) {
		for (let element of this.array) {
			element.draw(env);
		}
	}
}

StaticArray.ASCENDING_TYPE = "Ascending Order";
StaticArray.DESCEDING_TYPE = "Descending Order";

StaticArray.sortingTypes = {
	["asc"] 		: StaticArray.ASCENDING_TYPE,
	["ascending"]	: StaticArray.ASCENDING_TYPE,
	["desc"]		: StaticArray.DESCEDING_TYPE,
	["descending"]	: StaticArray.DESCEDING_TYPE,
}

// Current object of 'activeItem' is bound to these methods! (this === activeItem)
StaticArray.sortingMethods = {
	bubble : async function(type) {
		let items  = this.array;
		let length = items.length;
		for (let i = 0; i < length; i++) { 
			// Notice that j < (length - i)
			for (let j = 0; j < (length - i - 1); j++) { 
				// highlight
				await items[i].highlight([20,120,50], 700);
				await items[j].highlight([120, 60, 50], 400);
				await items[j+1].highlight([120, 60, 50], 400);

				// Compare the adjacent positions
				let comparisonBoolean = (type === StaticArray.ASCENDING_TYPE) ? (items[j].value > items[j+1].value) : (items[j].value < items[j+1].value);

				if(comparisonBoolean) {
					// Swap the values
					let tmp	   	     = items[j].value;  
					items[j].value   = items[j+1].value;
					items[j+1].value = tmp;
				}
			}        
		}
	},
	insertion : async function(type) {
		let items  = this.array;
		let length = items.length;
		for (let i = 0; i < length; i++) {
			let value = items[i].value;
			// store the current item value so it can be placed right
			for (let j = i - 1; j > -1 && items[j].value > value; j--) {
				// loop through the items in the sorted array (the items from the current to the beginning)
				// copy each item to the next one
				items[j + 1].value = items[j].value;
			}
			// the last item we've reached should now hold the value of the currently sorted item
			items[j + 1].value = value;
		}		
	}
}

StaticArray.prototype.insert.help = `Insert an element(value) at posistion(index) in the array.`;
StaticArray.prototype.remove.help = `Removes an element at posistion(index) from the array. (set to 0)`;
StaticArray.prototype.search.help = `Preforms linear search on the array for a (value).`;
StaticArray.prototype.sort.help   = `Sorts the array.\n (method): ${Object.keys(StaticArray.sortingMethods)+""} \n (type): 'ascending' or 'descending'`;

StaticArray.ElementGraphic = class {
	constructor(parent, index, value, structure={width:70,height:70,x:0,y:0}) {
		this.parent = parent;
		this.index  = index;
		this.value  = value;
		
		this.width  = structure.width;
		this.height = structure.height;
		this.x      = structure.x;
		this.y 		= structure.y;

		this.resetColor();
	}
	
	async highlight(color, ms){
		let oldc = this.rectColor;
		this.rectColor = color;
		console.log("sleep", ms, "multi", speed);
		await util.sleep(ms/speed); 
		this.rectColor = oldc;
	}

	setColor(color) {
		this.rectColor = color;
	}

	resetColor() {
		this.rectColor   = StaticArray.ElementGraphic.DEFAULT_COLOR;
		this.borderColor = StaticArray.ElementGraphic.DEFAULT_BORDER_COLOR;
		this.textColor   = StaticArray.ElementGraphic.DEFAULT_TEXT_COLOR;
	}

	draw(env) {
		let offset_x = (env.width - (this.parent.array.length * this.width))/2;
		let offset_y = env.height*.5;

		// draw box
		this.x = offset_x + this.width*this.index;
		this.y = offset_y - this.height/2;
		
		env.fill(...this.borderColor);
		env.rect(this.x, this.y, this.width, this.height);
		env.fill(...this.rectColor);
		env.rect(this.x+4, this.y+4, this.width-8, this.height-8);

		// draw value
		env.textFont(env.NORMAL_FONT);
		env.textSize(35);

		let value = String(this.value);
        let tw = env.textWidth(value);
        let th = env.textSize();

		env.fill(...this.textColor);
		env.text(value, this.x + this.width/2 - tw/2, this.y + this.height/2 + th/2.5);
		
		// draw index
		env.textSize(20);

		let index = "[" + String(this.index) + "]";
        let tw2 = env.textWidth(index);
        let th2 = env.textSize();

		env.fill(...this.rectColor);
		env.text(index, this.x + this.width/2 - tw2/2, this.y + this.height + th2 + 10);
	}
}

StaticArray.ElementGraphic.DEFAULT_COLOR 		= [255, 255, 255];
StaticArray.ElementGraphic.DEFAULT_TEXT_COLOR 	= [70, 70, 70];
StaticArray.ElementGraphic.DEFAULT_BORDER_COLOR = [0, 0, 0];

// Export Class
module.exports = StaticArray;