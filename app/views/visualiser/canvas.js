const util = require("../../scripts/utility");

var noLoop = false;

let sketch = function(p){
    let angle1 = 0;
    let angle2 = 0;
    let scalar = 70;

	p.preload = function () {

	}

	p.setup = function () {
        let w = p.windowWidth/2 - 16;
		let h = p.windowHeight/2.65;

		p.createCanvas(w, h);
        p.background(0);
        p.noStroke();
        p.rectMode(3);
	}

	p.draw = function () {
        if (noLoop)
            return;
        
        p.background(100,20,20);
        p.text('Just a random animation test :b', 50, 50);

        let width  = p.width;
        let height = p.height;

        let ang1 = p.radians(angle1);
        let ang2 = p.radians(angle2);

        let x1 = width / 2 + scalar * p.cos(ang1);
        let x2 = width / 2 + scalar * p.cos(ang2);

        let y1 = height / 2 + scalar * p.sin(ang1);
        let y2 = height / 2 + scalar * p.sin(ang2);

        p.fill(255);
        p.rect(width * 0.5, height * 0.5, 140, 140);

        p.fill(0, 102, 153);
        p.ellipse(x1, height * 0.5 - 120, scalar, scalar);
        p.ellipse(x2, height * 0.5 + 120, scalar, scalar);

        p.fill(255, 204, 0);
        p.ellipse(width * 0.5 - 120, y1, scalar, scalar);
        p.ellipse(width * 0.5 + 120, y2, scalar, scalar);

        angle1 += 2;
        angle2 += 3;
	}
}

let visualisationCanvasElement = new p5(sketch, 'visualisation_canvas'); // attach it to div id: `titleCanvas` on index.html

// reload it on screen resize
util.addEvent(window, "resize", function(event) {
	visualisationCanvasElement.setup();// dont use setup? just call resize? // figure out overflow of canvas    
});