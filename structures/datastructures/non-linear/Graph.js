/* global VisualisationItem */

class Graph extends VisualisationItem {
    constructor(itemData) {
        super(
            "Directed Graph",
            itemData, {
                "elements": [],
                "adjacency-map": {},
            },
        );
    }

    async *insert(transitions) {
        // check params
        if (this.state.elements.length >= 26)
            return {
                success: false,
                message: `Node limit reached! (26)`
            };
        
        transitions = transitions === "none" ? [] : transitions.split('|');
        
        // check validity of input
        for (let value of transitions)
            if (!this.state["adjacency-map"][value])
                return {
                    success: false,
                    message: `Invalid transition value!`
                }

        // Create new node
        const ASCII_ALPHABET_START = 97;

        let idvalue    = String.fromCharCode(ASCII_ALPHABET_START + this.state.elements.length);
        let NodeClass  = this.constructor.NodeGraphic;
        let newElement = new NodeClass(idvalue);
        
        // Update adjacency map & push element
        this.state["adjacency-map"][idvalue] = {
            element: newElement,
            transitions
        };

        this.state.elements.push(newElement);

        newElement.setColor(this.constructor.COLORS.success);
        
        // Define Step
        await this.step() && (yield);

        newElement.resetColor();

        // Return result
        return {
            success: true,
            message: `Added a new node ${idvalue} to the Graph. Transitions: ${transitions}`
        };
    }

    async *remove(id) {
        // check params
        if (this.state.elements.length <= 0)
            return {
                success: false,
                message: `Graph is empty!`
            };
        
        let robject = this.state["adjacency-map"][id];

        if (!robject)
            return {
                success: false,
                message: `Invalid node id!`
            }
        
        let removeElement = robject.element;
        removeElement.setColor(this.constructor.COLORS.fail);

        // Step
        await this.step() && (yield);

        removeElement.resetColor();

        // actually remove 
        for (let i=0; i<this.state.elements.length; i++)
            if (this.state.elements[i].value === removeElement.value)
                delete this.state.elements.splice(i, 1);
        
        delete this.state["adjacency-map"][id];
        
        return {
            success: true,
            message: `Removed '${id}' from Graph!`
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

    draw(env) {
        if (this.state.elements.length <= 0) {
            let text = "Graph is Empty!";
            // Title
            env.textFont(env.CAPS_FONT);
            env.textSize(env.TITLE_SIZE);

            let tw = env.textWidth(text);
            let th = env.textSize();

            env.fill(...env.TEXT_COLOR);
            env.text(text, env.width / 2 - tw / 2, env.height / 2 + th / 2);
            return;
        }

        // draw transition (first to go in the back)
        let map = this.state["adjacency-map"];
        for (let fromElementID in this.state["adjacency-map"]) {
            let data = map[fromElementID];
            let fromElement = data.element;
            let transitions = data.transitions;

            for (let toElementID of transitions) {
                let toElement = map[toElementID].element;
                
                // Line
                env.stroke(255,255,255);
                env.strokeWeight(8);
                env.line(fromElement.x, fromElement.y, toElement.x, toElement.y);
                env.strokeWeight(1);
                env.stroke(0,0,0);
                
                // Arrow
                let midpoint = {
                    x: (fromElement.x + toElement.x) / 2,
                    y: (fromElement.y + toElement.y) / 2,
                }

                let ang = env.atan2(fromElement.y - toElement.y , fromElement.x - toElement.x) - env.HALF_PI;
                var offset = 10;
                
                env.fill(225, 25, 5);

                env.push()
                env.translate(midpoint.x, midpoint.y); 
                env.rotate(ang); // rotates the arrow point
                env.triangle(-offset * 0.6, offset, offset * 0.5, offset, 0, -offset / 2); // draws the arrow point as a triangle
                env.pop();
            }
        }

        // draw nodes
        for (let nodeElement of this.state.elements) {
            if(!nodeElement) continue; // because of dynamic insertion/deletion
            nodeElement.draw(env);
        }
    }

    // Event Functions
    mousePressed(env) {
        for (let nodeElement of this.state.elements) {
            if(!nodeElement) continue; // because of dynamic insertion/deletion
            nodeElement.mousePressed(env);
        }
    }

    mouseReleased(env) {
        for (let nodeElement of this.state.elements) {
            if(!nodeElement) continue; // because of dynamic insertion/deletion
            nodeElement.mouseReleased(env);
        }
    }
}

Graph.prototype.insert.help   = `Insert an element into the graph. Use <b>"v1|v2|v3|...|vn"</b> to denote that the new element has an edge to 'vx'`;
Graph.prototype.remove.help   = `Remove a (value) from the graph. Value = node id.`;
Graph.prototype.remove.search = `Search.`;

Graph.NodeGraphic = class {
    constructor(value) {
        this.value = value;

        this.x = 100;
        this.y = 100;

        this.radius = 48;
        this.borderThickness = 6;
        this.isDragging = false;

        this.resetColor();
    }

    setBorderColor(color) {
        this.borderColor = color;
    }

    setColor(color) {
        this.innerColor = color;
    }

    setTextColor(color) {
        this.textColor = color;
    }

    resetColor() {
        this.borderColor = [20, 20, 20];
        this.innerColor = [255, 255, 255];
        this.textColor = [40, 40, 40];
    }

    /* Check if mouse is over */
    isMouseOver(env) {
        return env.dist(env.mouseX, env.mouseY, this.x, this.y) <= this.radius/2;
    }

    /* Called when mouse is released */
    mouseReleased(env, mx, my) {
        this.isDragging = false;
        Graph.NodeGraphic.draglock = null;
    }

    /* Called when mouse is pressed! */
    mousePressed(env, mx, my) {
        if (this.isMouseOver(env)) {
            this.isDragging = true;
            Graph.NodeGraphic.draglock = this;
        }
    }

    draw(env) {
        // border
        env.fill(this.borderColor);
        env.ellipse(this.x, this.y, this.radius);

        if (Graph.NodeGraphic.isDragEntity(this)){
            this.x = env.mouseX;
            this.y = env.mouseY;
        }

        // inner
        if (this.isMouseOver(env)) {
            env.fill(200, 20, 50);
        } else {
            env.fill(this.innerColor);
        }
       
        env.ellipse(this.x, this.y, this.radius - this.borderThickness);

        // draw value
        env.textFont(env.NORMAL_FONT);
        env.textSize(26);

        let value = String(this.value);
        let tw = env.textWidth(value);
        let th = env.textSize();

        env.fill(...this.textColor);
        env.text(value, this.x - tw / 2, this.y + th / 2.5);
    }
}

Graph.NodeGraphic.draglock = null;
Graph.NodeGraphic.isDragEntity = (ent) => {
    return ent === Graph.NodeGraphic.draglock && ent.isDragging;
}

module.exports = Graph;