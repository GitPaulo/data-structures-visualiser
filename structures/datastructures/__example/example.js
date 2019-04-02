/* global VisualisationItem */

/*************************************************************
 *  THIS IS AN EXAMPLE FILE ON ADDING A DATA STRUCTURE ITEM 
 ************************************************************/
class ExampleDataStructure extends VisualisationItem {
    constructor(itemData) {
        super(
            "Example Name",
            itemData,
            [], // State (Array of Graphic Element - each element must implement draw(env))
            // State can be an abject if we override how we handle it in the draw(); (could be anything actually)
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

    /*****
     * Extra methods: 
     * 		- shouldYield()
     * 		- resetState()
     * 		- storeState() 
     * 		- clearStorage()
     * 		- shiftState(index)
     * 		- shiftStateToResume()
     * 		- draw(env) 
     * (Override if extra functionality needed)
     */

    /*****
     * Event methods
     *      - mousePressed(env)
     *      - mouseReleased(env)
     */
    
    /***** 
     * Constants of Parent class:
     * 		- VisualisationItem.ASCENDING_SORTING_TYPE
     * 		- VisualisationItem.DESCENDING_SORTING_TYPE
     * 		- VisualisationItem.SORTING_TYPES
     * 		- VisualisationItem.COLORS
     */
}

ExampleDataStructure.prototype.insert.help = ``;
ExampleDataStructure.prototype.remove.help = ``;
ExampleDataStructure.prototype.search.help = ``;
ExampleDataStructure.prototype.sort.help = ``;

module.exports = ExampleDataStructure;