/* global util, VisualisationItem, activeItem, logger*/
class Queue extends VisualisationItem {
    constructor(itemData) {
        const length = 10;
        super(
            "Queue",
            itemData, {
                "head_pointer": new Queue.PointerGraphic("head"),
                "tail_pointer": new Queue.PointerGraphic("tail"),
                "array": Array.from({
                    length
                }, (v, i) => new Queue.ElementGraphic(length, i))
            },
        );
    }

    async *insert(value) {
        // check params
        value = Number(value);

        if (isNaN(value))
            return {
                success: false,
                message: `Invalid parameter, must be of type 'Number'!`
            };

        let tailElement = this.state["tail_pointer"];
        let headElement = this.state["head_pointer"];
        let queueArray  = this.state.array; 

        if (tailElement.value === headElement.value && queueArray[tailElement.value].value !== null)
            return {
                success: false,
                message: `The Queue is full!`
            };

        let element = queueArray[tailElement.value];
        element.value = value;
        element.setColor(Queue.COLORS.success);

        // Define a step
        await this.step(`Enqueuing ${value} at the the tail (index=${tailElement.value}).`) && (yield);

        // Reset color
        element.resetColor();

        // Increment tail (Circularity!)
        tailElement.value = tailElement.value >= queueArray.length - 1 ? 0 : tailElement.value + 1;

        return {
            success: true,
            message: `Element ${value} enqueued!`
        };
    }

    async *remove() {
        let tailElement = this.state["tail_pointer"];
        let headElement = this.state["head_pointer"];
        let queueArray  = this.state.array;

        if (tailElement.value === headElement.value && queueArray[headElement.value].value === null)
            return {
                success: false,
                message: `The Queue is empty!`
            };

        let element   = queueArray[headElement.value];
        let oldvalue  = element.value;
        element.value = null;
        element.setColor(Queue.COLORS.fail);

        // Define a step
        await this.step(`Dequeueing value ${oldvalue} from head (index=${headElement.value})`) && (yield);

        // Reset color
        element.resetColor();

        // Increment head (Circularity!)
        headElement.value = headElement.value >= queueArray.length - 1 ? 0 : headElement.value + 1;

        return {
            success: true,
            message: `Element ${oldvalue} dequeued!`
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

        let tailElement = this.state["tail_pointer"];
        let headElement = this.state["head_pointer"];
        let queueArray  = this.state.array;

        if (tailElement.value === headElement.value && queueArray[headElement.value].value === null)
            return {
                success: false,
                message: `The Queue is empty!`
            };

        let found = false;
        let i = headElement.value;
        let stopi = tailElement.value;

        do {
            /***** Dequeue Value *****/
            let element  = queueArray[headElement.value];
            let oldvalue = element.value;

            /***** Compare Value  *****/
            if (oldvalue == value) {
                element.setColor(Queue.COLORS.success);
                found = true;
            } else {
                element.setColor(Queue.COLORS.fail);
            }

            // Define a step
            await this.step(`Comparsion: (${oldvalue} == ${value}) = ${oldvalue == value}`) && (yield);

            // Reset color
            element.resetColor();

            // Increment head (Circularity!)
            element.value = null;
            headElement.value = headElement.value >= queueArray.length - 1 ? 0 : headElement.value + 1;

            // Define a step
            await this.step(`Incremented head pointer. (index=${headElement.value})`) && (yield);

            /***** Queue value back! *****/
            element = queueArray[tailElement.value];
            element.value = oldvalue;

            // Define a step
            await this.step(`Enqueued value ${oldvalue} back in the queue.`) && (yield);

            // Increment tail (Circularity!)
            tailElement.value = tailElement.value >= queueArray.length - 1 ? 0 : tailElement.value + 1;

            // Define a step
            await this.step(`Incremented tail pointer. (index=${tailElement.value})`) && (yield);

            // Increment search index
            i = headElement.value;
        } while (i !== stopi);

        let str = found ? "found" : "not found";
        return {
            success: found,
            message: `Element ${value} was ${str} in the Queue!`
        };
    }

    async *sort(type) {
        // param check
        type = this.constructor.SORTING_TYPES[String(type).toLowerCase()];

        if (typeof type === "undefined")
            return {
                success: false,
                message: `Invalid type of sorting! Check !instructions.`
            };

        let tailElement = this.state["tail_pointer"];
        let headElement = this.state["head_pointer"];
        let queueArray  = this.state.array;

        if (tailElement.value === headElement.value && queueArray[headElement.value].value === null)
            return {
                success: false,
                message: `The Queue is empty!`
            };

        const MAX = queueArray.length;
        let front = headElement.value
        let rear = tailElement.value;

        let numElements = front > rear ? (MAX - front + rear) : (rear - front); // inclusive

        for (let i = 0; i < numElements; i++) {
            /***** Dequeue item *****/
            let element1 = queueArray[headElement.value];
            let oldvalue1 = element1.value;
            element1.value = null;
            element1.setColor(Queue.COLORS.pointer);

            // Define a step
            await this.step(`Dequeue: ${oldvalue1}`) && (yield);

            // Reset color
            element1.resetColor();

            // Increment head (Circularity!)
            headElement.value = headElement.value >= MAX - 1 ? 0 : headElement.value + 1;

            for (let j = 0; j < (numElements - 1); j++) {
                /***** Dequeue item *****/
                let element2 = queueArray[headElement.value];
                let oldvalue2 = element2.value;
                element2.value = null;
                element2.setColor(Queue.COLORS.pointer);

                // Define a step
                await this.step(`Dequeue: ${oldvalue2}`) && (yield);

                // Reset color
                element2.resetColor();

                // Increment head (Circularity!)
                headElement.value = headElement.value >= MAX - 1 ? 0 : headElement.value + 1;

                /***** Compare Element1 and Element2 and enqueue based on result *****/
                let operator = (type === this.constructor.ASCENDING_SORTING_TYPE) ? ">" : "<";
                let comparisonBoolean = eval(`(${Number(oldvalue1)} ${operator} ${Number(oldvalue2)})`);
                let enqueueValue = comparisonBoolean ? oldvalue2 : oldvalue1;

                let element3 = queueArray[tailElement.value];
                element3.value = enqueueValue;
                element3.setColor(Queue.COLORS.success);

                // Define a step
                await this.step(`Comparison: (${oldvalue1} ${operator} ${oldvalue2}) == ${comparisonBoolean}`) && (yield);

                // Reset color
                element3.resetColor();

                // Increment tail (Circularity!)
                tailElement.value = tailElement.value >= MAX - 1 ? 0 : tailElement.value + 1;

                if (!comparisonBoolean)
                    oldvalue1 = oldvalue2;
            }

            /***** enqueue oldvalue1 *****/
            let element4 = queueArray[tailElement.value];
            element4.value = oldvalue1;
            element4.setColor(Queue.COLORS.pointer);

            // Define a step
            await this.step(`Enqueue: ${oldvalue1}`) && (yield);

            // Reset color
            element4.resetColor();

            // Increment tail (Circularity!)
            tailElement.value = tailElement.value >= MAX - 1 ? 0 : tailElement.value + 1;
        }

        return {
            success: true,
            message: `Sort completed on Queue!`
        };
    }

    // We are having a more complex state so we override draw!
    draw(env) {
        this.state["head_pointer"].draw(env);
        this.state["tail_pointer"].draw(env);

        for (let element of this.state.array) {
            element.draw(env);
        }
    }
}

Queue.prototype.insert.help = `Enqueue a (value) to the queue.`;
Queue.prototype.remove.help = `Dequeue a value from the queue.`;
Queue.prototype.search.help = `Search a (value) in the queue.`;
Queue.prototype.sort.help = `Sort the queue in 'ascending' or 'descending' order.`;

Queue.PointerGraphic = class {
    constructor(name) {
        this.name = name;
        this.value = 0;

        // Dynamically generated (for responsive canvas resize purposes)
        this.width = 0, this.height = 0;
        this.x = 0, this.y = 0;

        this.resetColor();
    }

    setBorderColor(color) {
        this.borderColor = color;
    }

    setColor(color) {
        this.rectColor = color;
    }

    setTextColor(color) {
        this.text = color;
    }

    resetColor() {
        this.borderColor = this.name === "head" && [40, 180, 130] || this.name === "tail" && [190, 30, 120] || [40, 40, 40];
        this.rectColor = [250, 250, 250];
        this.textColor = [255, 255, 255];
    }

    draw(env) {
        // dynamic size & positioning
        this.width  = env.width  * 0.09;
        this.height = env.height * 0.18;
        this.x = env.width * (this.name == "head" ? 0.1 : 0.25);
        this.y = env.height * 0.15;

        // draw border rect
        env.fill(...this.borderColor);
        env.rect(this.x, this.y, this.width, this.height);
        // draw inner rect
        env.fill(...this.rectColor);
        env.rect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

        // text env config
        env.textFont(env.NORMAL_FONT);

        // draw name
        env.fill(...this.textColor);
        env.textSize(env.height * 0.06);

        let tw = env.textWidth(this.name);
        let th = env.textSize();

        env.text(this.name, this.x + this.width / 2 - tw / 2, this.y - th / 2);

        // draw value
        env.fill(40, 40, 40);
        env.textSize(env.height * 0.10);

        let value = String(this.value);
        let tw2 = env.textWidth(value);
        let th2 = env.textSize();

        env.text(value, this.x + this.width / 2 - tw2 / 2, this.y + this.height / 2 + th2 / 2.5);
    }
}

Queue.ElementGraphic = class {
    constructor(arrayLength, index) {
        this.arrayLength = arrayLength;

        this.index = index;
        this.value = null;

        // Dynamically generated (for responsive canvas resize purposes)
        this.width = 0, this.height = 0;
        this.x = 0, this.y = 0;

        this.resetColor();
    }

    setBorderColor1(color) {
        this.borderColor1 = color;
    }

    setBorderColor2(color) {
        this.borderColor2 = color;
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
        this.borderColor1 = [70, 70, 70];
        this.borderColor2 = [70, 70, 70];
        this.textColor = [0, 0, 0];
    }

    draw(env) {
        // dynamic size & positioning
        this.width  = env.width  * 0.09;
        this.height = env.height * 0.18;

        let offset_x = (env.width - (this.arrayLength * this.width)) / 2;
        let offset_y = env.height * .6;

        // draw box
        this.x = offset_x + this.width * this.index - 5; //shhhh
        this.y = offset_y - this.height / 2;

        // border
        // Not bad old man. Next time less scuffed. Like really.
        let bc1, bc2;
        if (this.index === activeItem.state["head_pointer"].value && this.index === activeItem.state["tail_pointer"].value) {
            bc1 = activeItem.state["head_pointer"].borderColor;
            bc2 = activeItem.state["tail_pointer"].borderColor;
        } else if (this.index === activeItem.state["head_pointer"].value) {
            bc1 = activeItem.state["head_pointer"].borderColor;
            bc2 = activeItem.state["head_pointer"].borderColor;
        } else if (this.index === activeItem.state["tail_pointer"].value) {
            bc1 = activeItem.state["tail_pointer"].borderColor;
            bc2 = activeItem.state["tail_pointer"].borderColor;
        } else {
            bc1 = this.borderColor1;
            bc2 = this.borderColor2;
        }

        env.fill(...bc1);
        env.rect(this.x, this.y, this.width / 2, this.height);

        env.fill(...bc2);
        env.rect(this.x + this.width / 2, this.y, this.width / 2, this.height);

        // element box
        env.fill(...this.rectColor);
        env.rect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

        // draw value
        if (this.value !== null) { // dont draw empty cells
            env.textFont(env.NORMAL_FONT);
            env.textSize(env.height * 0.10);

            let value = String(this.value);
            let tw = env.textWidth(value);
            let th = env.textSize();

            env.fill(...this.textColor);
            env.text(value, this.x + this.width / 2 - tw / 2, this.y + this.height / 2 + th / 2.5);
        }

        // draw index
        env.textSize(env.height * 0.06);

        let index = "[" + String(this.index) + "]";
        let tw2 = env.textWidth(index);
        let th2 = env.textSize();

        env.fill(...this.rectColor);
        env.text(index, this.x + this.width / 2 - tw2 / 2, this.y + this.height + th2 + 10);
    }
}

module.exports = Queue;
