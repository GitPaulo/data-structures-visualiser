/* global VisualisationItem */

class LinkedList extends VisualisationItem {
    constructor(itemData) {
        super(
            "Linked List (Singly)",
            itemData,
            [], // State
        );
    }

    // In detail example:
    async *insert(index, value) {
        // Check paramas (ALL PARAMETERS ARE STRINGS BECAUSE THEY ARE USER INPUT!)
        index = Number(index);
        value = Number(value);

        if (isNaN(index) || isNaN(value))
            return {
                success: false,
                message: ``
            };

        // State changing code
        // ........

        // Define Step
        await this.step() && (yield);

        // State changing code
        // ........

        // Return result
        return {
            success: true,
            message: ``
        };
    }

    async *remove() {
        // Step
        await this.step() && (yield);

        return {
            success: true,
            message: ``
        };
    }

    async *search() {
        // Step
        await this.step() && (yield);

        return {
            success: true,
            message: ``
        };
    }

    // Multi-operation support: This method will return approiate coroutine!
    async *sort() {
        // Step
        await this.step() && (yield);

        return {
            success: true,
            message: ``
        };
    }
}

LinkedList.prototype.insert.help = ``;
LinkedList.prototype.remove.help = ``;
LinkedList.prototype.search.help = ``;
LinkedList.prototype.sort.help = ``;

module.exports = LinkedList;