/* global VisualisationItem */
class BinarySearchTree extends VisualisationItem {
    constructor(itemData) {
        super(
            "Binary Search Tree", 
            itemData,
        );
        // Root Node of BST
        this.root = new BinarySearchTree.NodeGraphic(Math.floor(Math.random() * 100));
    }

    async insert(value) {
        // VALUES MUST NOT REPEAT IN BST!
        let newNode = new BinarySearchTree.NodeGraphic(value);

        if (this.root === null) {
            this.root = newNode;
            return { success:true, message:`Element ${value} inserted at the root!` };
        } 
        
        let currentNode = this.root;
        let depth       = 0;

        while (currentNode !== null && currentNode !== newNode) {
            if (newNode.value < currentNode.value) {
                if (currentNode.left === null) {
                    currentNode.left = newNode;
                } 
                currentNode = currentNode.left;
            } else {
                if (currentNode.right === null) {
                    currentNode.right = newNode;
                }
                currentNode = currentNode.right;
            }
            depth++;
        }
        
        return { success:true, message:`Element ${value} inserted at depth ${depth}` };
    }

    async remove(value) {
        if (this.root === null) 
            return { success: false, message:`There are no elements to remove in the tree!` }; 
        
        let previousNode = null;
        let currentNode  = this.root;
        let depth        = 0;

        while (currentNode !== null ) {
            if (currentNode.value == value) {
                break;
            } else if (value < currentNode.value) {
                currentNode  = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
            previousNode = currentNode;
        }

        if (currentNode === null)
            return { success: false, message:`Could not find a node with value: ${value}` }; 

        if (currentNode.value > previousNode.value)
            previousNode.right = null;
        else
            previousNode.left = null;

        return { success: true, message:`Removed node of value: ${value} at depth ${depth}` };
    }

    async search(method, value) {
        let found = false;
        let tfunc = BinarySearchTree.transversalMethods[method];
        
        if (typeof tfunc === "undefined")
            return { success: false, message: `Invalid transversal method! Check !instructions.` };

        found = tfunc(this.root, value); // start at root!

        let not = found ? "" : "not";
        return { success: found, message: `Value ${value} was ${not} found via ${method} transversal!` };
    }

    async sort() {

    }

    draw(env) {
        
    }
}

BinarySearchTree.transversalMethods = {
    preorder : function(node, value) { 
        if (node != null) { 
            console.log(node.value);
            if (value == node.value)
                return true; 
            BinarySearchTree.transversalMethods.preorder(node.left); 
            BinarySearchTree.transversalMethods.preorder(node.right); 
        } 
    },

    postorder : function (node, value) { 
        if (node != null) { 
            BinarySearchTree.transversalMethods.postorder(node.left); 
            BinarySearchTree.transversalMethods.postorder(node.right); 
            console.log(node.value); 
            if (value == node.value)
                return true;  
        } 
    },

    inorder : function(node, value) {
        if (node !== null){ 
            BinarySearchTree.transversalMethods.inorder(node.left); 
            console.log(node.value); 
            if (value == node.value)
                return true;  
            BinarySearchTree.transversalMethods.inorder(node.right); 
        } 
    },
}

BinarySearchTree.prototype.insert.help = `1`;
BinarySearchTree.prototype.remove.help = `2`;
BinarySearchTree.prototype.search.help = `Searches the BST using one of the (methods):\n ${Object.keys(BinarySearchTree.transversalMethods)+""}`;
BinarySearchTree.prototype.sort.help   = `4`;

BinarySearchTree.NodeGraphic = class {
    constructor(value) {
        this.value = value;
        this.left  = null;
        this.right = null;
        // parent?
    }

    draw(env) {

    }
}

module.exports = BinarySearchTree;