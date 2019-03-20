
/* global util, activeOperation*/
class VisualisationItem {
    constructor(id, descriptiveData, state) {
        this.id 			 = id;
        this.descriptiveData = descriptiveData; // from yaml object
        this.state           = state;
        this.storage         = [];
    }
        
    insert() {
        throw `Insert operation is not implemented for ${this.constructor.name}.`;
    }

    remove() {
        throw `Remove operation is not implemented for ${this.constructor.name}.`;
    }

    search() {
        throw `Search operation is not implemented for ${this.constructor.name}.`;
    }

    sort() {
        throw `Sort operation is not implemented for ${this.constructor.name}.`;
    }

    async sleep(ms=600) {
        let t = ms/activeOperation.speed;
        console.log(`Sleeping animation of ${this.constructor.name} for: ${t}ms.`);
        await util.sleep(t);
    }

    /*******
     * Below methods are encorouged to be overwritten if
     * extra functionality is needed!
    */
   
    shouldYield() {
        return activeOperation.shouldYield;
    }

	resetState() {
		if (this.storage[0]) {
            Object.assign(this.state, this.storage[0]);
            console.log(`State reset for ${this.constructor.name}.`);
		} else {
			throw "No initial state to reset to!";
		}
	}

	storeState() {
        // Currently there are no circular objects (but just in case) [AVOID THEM BTW]
		let copy = util.cloneCircular(this.state);
		this.storage.push(copy);
    }
    
    clearStorage() {
        this.storage = [];
        console.log(`Cleared step-state storage for ${this.constructor.name}.`);
    }

    draw(env) {
		for (let element of this.state) {
			element.draw(env);
		}
	}
}

module.exports = VisualisationItem;