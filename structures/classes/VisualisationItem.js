class VisualisationItem {
    constructor(id, descriptiveData) {
        this.id              = id;
        this.descriptiveData = descriptiveData; // from yaml object
    }

    draw() {
        throw "Not implemented!";
    }
}

module.exports = VisualisationItem;