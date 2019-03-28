/* global VisualisationItem, codeFollowEditor, util, activeOperation*/
class StaticArray extends VisualisationItem {
    constructor(itemData) {
        const length = 10;
        super(
            "Static Array",
            itemData,
            Array.from({
                length
            }, (v, i) => new StaticArray.ElementGraphic(length, i, Math.floor((Math.random() * 40) - 20)))
        );
    }

    async *insert(index, value) {
        // check params
        index = Number(index);
        value = Number(value);

        if (isNaN(index) || isNaN(value))
            return {
                success: false,
                message: `Invalid parameters! Must be of type 'Number'!`
            };

        if (index >= this.state.length || index < 0)
            return {
                success: false,
                message: `Index '${index}' was out of bounds! Bounds: (0 <= index < 10)`
            };

        let element = this.state[index];
        element.value = value;
        element.setColor(this.constructor.COLORS.success);

        // Define a step
        await this.step(`Overwriting value at index ${index} to ${value}`) && (yield);

        // Reset color
        element.resetColor();

        return {
            success: true,
            message: `Element ${value} inserted at index [${index}]`
        };
    }

    async *remove(index) {
        // check params
        index = Number(index);

        if (isNaN(index))
            return {
                success: false,
                message: `Invalid parameter, must be of type 'Number'!`
            };

        if (index >= this.state.length || index < 0)
            return {
                success: false,
                message: `Index '${index}' was out of bounds! Bounds: (0 <= index < 10)`
            };

        let element = this.state[index];
        element.value = 0;
        element.setColor(this.constructor.COLORS.fail);

        // Define a step
        await this.step(`Overwriting value at index ${index} to 0`) && (yield);

        // Reset color
        element.resetColor();

        return {
            success: true,
            message: `Element removed from index [${index}]`
        };
    }

    async *search(value) {
        // check params
        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid parameter, must be of type 'Number'!`
            };

        let found = false;

        for (let element of this.state) {
            element.setColor(this.constructor.COLORS.pointer);

            // Define a step
            await this.step(`Comparing: ${element.value} == ${value}`) && (yield);

            found = element.value == value;

            if (found) {
                element.setColor(this.constructor.COLORS.success);
            } else {
                element.setColor(this.constructor.COLORS.fail);
            }

            // Define a step
            await this.step(`Result: ${found}`) && (yield);

            // Reset color
            element.resetColor();

            if (found)
                break;
        }

        let str = found ? "found" : "not found";
        return {
            success: found,
            message: `Element ${value} was ${str} in the array!`
        };
    }

    // Multi-operation support: This method will return approiate coroutine!
    sort(method, type) {
        let sfunc = this.constructor.sortingMethods[method];

        if (typeof sfunc === "undefined")
            return {
                success: false,
                message: `Invalid sorting method! Check !instructions.`
            };

        type = this.constructor.SORTING_TYPES[String(type).toLowerCase()];

        if (typeof type === "undefined")
            return {
                success: false,
                message: `Invalid type of sorting! Check !instructions.`
            };

        return {
            success: true,
            coroutine: sfunc,
            args: [method, type]
        };
    }
}

// Current object of 'activeItem' is bound to these methods! (this === activeItem)
// Same arguments as the function that returns these!
StaticArray.sortingMethods = {
    bubble: async function* (method, type) {
        let items = this.state;
        let length = items.length;

        for (let i = 0; i < length; i++) {
            // set color of sorted array part
            for (let k = 0; k < i; k++)
                items[length - 1 - k].setBorderColor(this.constructor.COLORS.ordered);

            // Notice that j < (length - i)
            for (let j = 0; j < (length - i - 1); j++) {
                // highlight
                items[j].setColor(this.constructor.COLORS.pointer);
                items[j + 1].setColor(this.constructor.COLORS.pointer);

                // Define a step
                await this.step(`Comparing ${items[j].value} and ${items[j+1].value}`) && (yield);

                // Reset pair color
                items[j].setToLastColor();
                items[j + 1].setToLastColor();

                // Compare the adjacent positions
                let comparisonBoolean = (type === this.constructor.ASCENDING_SORTING_TYPE) ? (items[j].value > items[j + 1].value) : (items[j].value < items[j + 1].value);

                if (comparisonBoolean) {
                    // Swap the values
                    let tmp = items[j].value;
                    items[j].value = items[j + 1].value;
                    items[j + 1].value = tmp;
                }

                let hcolor = comparisonBoolean ? this.constructor.COLORS.fail : this.constructor.COLORS.success;
                items[j].setColor(hcolor, 500);
                items[j + 1].setColor(hcolor, 500);

                // Define a step
                await this.step(comparisonBoolean ? "Values out of order" : "Values in order") && (yield);

                // Reset pair color
                items[j].setToLastColor();
                items[j + 1].setToLastColor();
            }
        }

        items[0].setBorderColor(this.constructor.COLORS.ordered); // last one sorted!

        // Define a step
        await this.step("Marking last element as ordered!") && (yield);

        // Clear color!
        for (let i = 0; i < length; i++)
            items[i].resetColor();

        return {
            success: true,
            message: `Array finished sorting in '${type}' order via '${method}' sort!`
        };
    },
    insertion: async function* (method, type) {
        let items = this.state;
        let length = items.length;

        for (let i = 0; i < length; i++) {
            let value = items[i].value;

            // highlight
            items[i].setBorderColor([200, 90, 175]);

            // Define a step
            await this.step(`Highlighting outer loop index: ${i}`) && (yield);

            // store the current item value so it can be placed right
            let j;
            let itsTimeToDuel = (type === this.constructor.ASCENDING_SORTING_TYPE) ? ">" : "<"; // DUDUDUDUUD

            for (j = i - 1; j > -1 && eval(`items[j].value ${itsTimeToDuel} value`); j--) {
                items[j + 1].setColor(this.constructor.COLORS.pointer);

                // Define a step
                await this.step(`Comparison was true for: ${items[j].value} ${itsTimeToDuel} ${value}`) && (yield);

                items[j + 1].value = items[j].value;

                items[j + 1].setToLastColor();
            }

            items[j + 1].setColor(this.constructor.COLORS.success);

            // Define a step
            await this.step(`Swapped values`) && (yield);

            // the last item we've reached should now hold the value of the currently sorted item
            items[j + 1].value = value;

            items[j + 1].setToLastColor();
        }

        // Define a step
        await this.step(`Last element sorted by default.`) && (yield);

        // Clear color!
        for (let i = 0; i < length; i++)
            items[i].resetColor();

        return {
            success: true,
            message: `Array finished sorting in '${type}' order via '${method}' sort!`
        };
    }
}

StaticArray.prototype.insert.help = `Insert an element(value) at posistion(index) in the array.`;
StaticArray.prototype.remove.help = `Removes an element at posistion(index) from the array. (set to 0)`;
StaticArray.prototype.search.help = `Preforms linear search on the array for a (value).`;
StaticArray.prototype.sort.help = `Sorts the array.\n (method): ${Object.keys(StaticArray.sortingMethods)+""} \n (type): 'ascending' or 'descending'`;

StaticArray.ElementGraphic = class {
    constructor(arrayLength, index, value, structure = {
        width: 70,
        height: 70,
        x: 0,
        y: 0
    }) {
        this.arrayLength = arrayLength;

        this.index = index;
        this.value = value;

        this.width = structure.width;
        this.height = structure.height;
        this.x = structure.x;
        this.y = structure.y;

        this.resetColor();
    }

    setBorderColor(color) {
        this.borderColor = color;
    }

    setColor(color) {
        this.previousRectColor = this.rectColor;
        this.rectColor = color;
    }

    setToLastColor() {
        if (this.previousRectColor)
            this.rectColor = this.previousRectColor;
        else
            this.resetColor();
    }

    resetColor() {
        this.rectColor = [255, 255, 255];
        this.borderColor = [70, 70, 70];
        this.textColor = [0, 0, 0];
    }

    draw(env) {
        let offset_x = (env.width - (this.arrayLength * this.width)) / 2;
        let offset_y = env.height * .5;

        // draw box
        this.x = offset_x + this.width * this.index;
        this.y = offset_y - this.height / 2;

        env.fill(...this.borderColor);
        env.rect(this.x, this.y, this.width, this.height);
        env.fill(...this.rectColor);
        env.rect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

        // draw value
        env.textFont(env.NORMAL_FONT);
        env.textSize(35);

        let value = String(this.value);
        let tw = env.textWidth(value);
        let th = env.textSize();

        env.fill(...this.textColor);
        env.text(value, this.x + this.width / 2 - tw / 2, this.y + this.height / 2 + th / 2.5);

        // draw index
        env.textSize(20);

        let index = "[" + String(this.index) + "]";
        let tw2 = env.textWidth(index);
        let th2 = env.textSize();

        env.fill(...this.rectColor);
        env.text(index, this.x + this.width / 2 - tw2 / 2, this.y + this.height + th2 + 10);
    }
}

// Export Class
module.exports = StaticArray;