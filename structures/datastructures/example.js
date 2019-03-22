/* global VisualisationItem */

/*************************************************************
 *  THIS IS AN EXAMPLE FILE ON ADDING A DATA STRUCTURE ITEM 
 ************************************************************/
class ExampleDataStructure extends VisualisationItem {
	constructor(itemData) {
		super(
			"Name", 
			itemData,
			[], // state (Array of Graphic Element - each element must implement draw(env))
			// State can be an abject if we override how we handle it in the draw(); (could be anything actually)
		);
	}

	// In detail example:
	async* insert(index, value) {
		// Check paramas (ALL PARAMETERS ARE STRINGS BECAUSE THEY ARE USER INPUT!)
		index = Number(index);
		value = Number(value);

		if ( isNaN(index) || isNaN(value) )
			return { success:false, message:`` };

		// State changing code
		// ........

		// Define Step
		this.shouldYield() ? yield : this.storeState();
		await this.sleep();

		// State changing code
		// ........

		// Return result
		return { success:true, message:`` };
	}

	async* remove() {
		yield;

		return { success:true, message:`` };
	}

	async* search() {
		yield;
        
		return { success:true, message:`` };
	}

	// Multi-operation support: This method will return approiate coroutine!
	async *sort() {
		yield;

		return { success:true, message:`` };
	}

	// Extra methods: shouldYield(), resetState(), storeState(), clearStorage(), draw() (Override if extra functionality needed)
	// There are also constants we can override/use! (check VisualisationItem.js)
}

ExampleDataStructure.prototype.insert.help = ``;
ExampleDataStructure.prototype.remove.help = ``;
ExampleDataStructure.prototype.search.help = ``;
ExampleDataStructure.prototype.sort.help   = ``;

module.exports = ExampleDataStructure;