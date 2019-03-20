/* global util, VisualisationItem*/
class Queue extends VisualisationItem {
	constructor(itemData) {
		super(
			"Queue", 
			itemData,
			{},
		);
	}

	async* insert(index, value) {
		yield;

		return { success:true, message:`Element ${value} inserted at index [${index}]` };
	}

	async* remove(index) {
		yield;

		return { success:true, message:`Element removed from index [${index}]` };
	}

	async* search(value) {
        yield;
        
		return { success:false, message:`Element was not found in the array!` };
	}

	// Multi-operation support: This method will return approiate coroutine!
	async *sort(method, type) {
        yield;
	}

	draw(env) {
	
	}
}

Queue.prototype.insert.help = ``;
Queue.prototype.remove.help = ``;
Queue.prototype.search.help = ``;
Queue.prototype.sort.help   = ``;

module.exports = Queue;