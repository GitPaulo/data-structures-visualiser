class BinarySearchTree extends VisualisationItem {
    constructor(itemData) {
        super("Binary Search Tree", itemData);
    }

    draw(env) {
        env.rect(30, 20, 55, 55, 20);
    }
}

module.exports = BinarySearchTree;