
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
        //console.log(`Sleeping animation of ${this.constructor.name} for: ${t}ms.`);
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

/***** Help Strings For Operations *****/
VisualisationItem.prototype.insert.help = `Performs an insertion operation. [DEFAULT DOC]`;
VisualisationItem.prototype.remove.help = `Performs a remove operation. [DEFAULT DOC]`;
VisualisationItem.prototype.search.help = `Preforms a search operation. [DEFAULT DOC]`;
VisualisationItem.prototype.sort.help   = `Performs a sort operation. [DEFAULT DOC]'`;

/***** Constants *****/
VisualisationItem.ASCENDING_SORTING_TYPE  = "Ascending Order";
VisualisationItem.DESCENDING_SORTING_TYPE = "Descending Order";

VisualisationItem.SORTING_TYPES = {
	["asc"] 		: VisualisationItem.ASCENDING_SORTING_TYPE,
	["ascending"]	: VisualisationItem.ASCENDING_SORTING_TYPE,
	["desc"]		: VisualisationItem.DESCENDING_SORTING_TYPE,
	["descending"]	: VisualisationItem.DESCENDING_SORTING_TYPE,
}

VisualisationItem.COLORS = {
	"success" : [50, 255, 50],
	"fail"	  : [255, 60, 50],
	"pointer" : [50, 80, 255],
	"ordered" : [90, 220, 90],
}

module.exports = VisualisationItem;