// "Array" is taken :b
class StaticArray extends VisualisationItem {
	constructor(itemData) {
		super("Static Array", itemData);
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

	draw(env) {
		for (let element of this.array) {
			element.draw(env);
		}
	}
}

StaticArray.ElementGraphic = class {
	constructor(parent, index, value) {
		this.parent = parent;
		this.index  = index;
		this.value  = value;
		
		this.width  	 = 70;
		this.height 	 = 70;
		this.x      	 = 0;
		this.y 			 = 0;
		this.rectColor   = [255, 255, 255];
		this.borderColor = [0, 0, 0];
		this.textColor   = [70, 70, 70];
	}

	async highlight(color, ms){
		let oldc = this.rectColor;
		this.rectColor = color;
		await util.sleep(ms);
		this.rectColor = oldc;
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

module.exports = StaticArray;