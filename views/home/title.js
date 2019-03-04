const util = require('../../structures/modules/utility');
const p5   = require('p5');

/* Particle System */

function Vehicle(p, x, y) {
	this.pos 	  = p.createVector(p.random(p.width), p.random(p.height));
	this.target   = p.createVector(x, y);
	this.vel 	  = p5.Vector.random2D();
	this.acc      = p.createVector();
	this.r 		  = 4;
	this.maxspeed = 7;
	this.maxforce = 1;
	this.p        = p;
}
  
Vehicle.prototype.behaviors = function() {
	var arrive = this.arrive(this.target);
	var mouse  = this.p.createVector(this.p.mouseX, this.p.mouseY);
	var flee   = this.flee(mouse);

	arrive.mult(1);
	flee.mult(5);

	this.applyForce(arrive);
	this.applyForce(flee);
}
  
Vehicle.prototype.applyForce = function(f) {
	this.acc.add(f);
}

Vehicle.prototype.update = function() {
	this.pos.add(this.vel);
	this.vel.add(this.acc);
	this.acc.mult(0);
}

Vehicle.prototype.show = function() {
	this.p.stroke(this.p.map(this.vel.mag(), 0, 10, 255, 0));
	this.p.strokeWeight(this.r);
	this.p.point(this.pos.x, this.pos.y);
}

Vehicle.prototype.arrive = function(target) {
	var desired = p5.Vector.sub(target, this.pos);
	var d 		= desired.mag();
	var speed 	= this.maxspeed;
	
	if (d < 100) {
		speed = this.p.map(d, 0, 100, 0, this.maxspeed);
	}
	
	desired.setMag(speed);
	
	var steer = p5.Vector.sub(desired, this.vel);
	steer.limit(this.maxforce);
	
	return steer;
}

Vehicle.prototype.flee = function(target) {
	var desired = p5.Vector.sub(target, this.pos);
	var d 		= desired.mag();
	
	if (d < 50) {
		desired.setMag(this.maxspeed);
		desired.mult(-1);
		
		var steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxforce);
		
		return steer;
	} else {
		return this.p.createVector(0, 0);
	}
}

/* P5 SKETCH */

let sketch = function(p) {
	const TITLE_TEXT = "Algorithm Visualiser" 
	
	let font;
	let vehicles;

	p.preload = function () {
		font = p.loadFont('../../assets/Meteora.ttf');
	}

	p.setup = function () {
		let w = p.windowWidth;
		let h = p.windowHeight/3;

		p.createCanvas(w, h);
		
		const FONT_SIZE = w/12;
		let points = font.textToPoints(TITLE_TEXT, w/2 - FONT_SIZE*TITLE_TEXT.length/3.5, h/1.4, FONT_SIZE, {
			sampleFactor: 0.15
		});

		vehicles = [];

		for (let i = 0; i < points.length; i++) {
			let pt = points[i];
			let vehicle = new Vehicle(p, pt.x, pt.y);
			vehicles.push(vehicle);
		}
	}

	p.draw = function () {
		p.background(40);
		for (let i = 0; i < vehicles.length; i++) {
			let v = vehicles[i];
			v.behaviors();
			v.update();
			v.show();
		}
	}
}

let titleCanvasElement = new p5(sketch, 'title_canvas'); // attach it to div id: `titleCanvas` on index.html

// reload it on screen resize
util.addEvent(window, 'resize', function(event) {
	titleCanvasElement.setup();
});
