// "Array" is taken :b
class VArray extends VisualisationItem {
	constructor(itemData) {
		super("Array", itemData);
	}

	draw(env) {
		env.rect(30, 20, 55, 55);
		console.log("K")
	}
}

module.exports = VArray;