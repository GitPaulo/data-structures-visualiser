
class VisualisationItem {
    constructor(id, descriptiveData) {
        this.id 			 = id;
        this.descriptiveData = descriptiveData; // from yaml object
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
}

module.exports = VisualisationItem;