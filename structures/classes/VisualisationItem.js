
/* global util, activeOperation*/
/***
 * Rules of extending this class.
 * All operation methods are expected to be of type "AsyncGeneratorFunc"
 *  - Yield where a step should be.
 * 
 * IF you want there to be more than one algorithm for a certain operation:
 * (Multi operations are advised to be implemented this way)
 *  1. Operation function will be of regular "Func" type.
 *  2. Arguments will be parsed in operation function. 
 *      - If correct then return apropriate coroutine (stored anywhere)
 *      - Else return message object
 */
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

    draw() {
        throw `Draw function not implemented.`;
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

    async sleep(ms=1000) {
        let t = ms/activeOperation.speed;
        console.log(`Sleeping animation of ${this.constructor.name} for: ${t}ms.`);
        await util.sleep(t);
    }
}

module.exports = VisualisationItem;