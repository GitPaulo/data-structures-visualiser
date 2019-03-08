class VisualisationItem {
    constructor(id, descriptiveData) {
        this.id 			 = id;
        this.descriptiveData = descriptiveData; // from yaml object
    }
    
    insert() {
        throw "Not implemented!";
    }

    remove() {
        throw "Not implemented!";
    }

    search() {
        throw "Not implemented!";
    }

    draw() {
        throw "Not implemented!";
    }
}

module.exports = VisualisationItem;