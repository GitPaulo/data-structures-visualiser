/* global VisualisationItem */

class BinarySearchTree extends VisualisationItem {
	constructor(itemData) {
		super(
			"Name", 
			itemData,
			[], // state
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

BinarySearchTree.prototype.insert.help = ``;
BinarySearchTree.prototype.remove.help = ``;
BinarySearchTree.prototype.search.help = ``;
BinarySearchTree.prototype.sort.help   = ``;

module.exports = BinarySearchTree;