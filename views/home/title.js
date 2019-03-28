const util = require('../../structures/modules/utility');
const p5 = require('p5');

/* Particle System */
function Vehicle(env, x, y) {
    this.pos = env.createVector(env.random(env.width), env.random(env.height));
    this.target = env.createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = env.createVector();
    this.r = 4;
    this.maxspeed = 7;
    this.maxforce = 1;
    this.env = env;
}

Vehicle.prototype.behaviors = function () {
    var arrive = this.arrive(this.target);
    var mouse = this.env.createVector(this.env.mouseX, this.env.mouseY);
    var flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
}

Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
}

Vehicle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
}

Vehicle.prototype.show = function () {
    this.env.stroke(this.env.map(this.vel.mag(), 0, 10, 255, 0));
    this.env.strokeWeight(this.r);
    this.env.point(this.pos.x, this.pos.y);
}

Vehicle.prototype.arrive = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;

    if (d < 100) {
        speed = this.env.map(d, 0, 100, 0, this.maxspeed);
    }

    desired.setMag(speed);

    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);

    return steer;
}

Vehicle.prototype.flee = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();

    if (d < 50) {
        desired.setMag(this.maxspeed);
        desired.mult(-1);

        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);

        return steer;
    } else {
        return this.env.createVector(0, 0);
    }
}

/* P5 SKETCH */

let sketch = function (env) {
    const TITLE_TEXT = "Data Structures Visualiser"

    let font;
    let vehicles;

    env.preload = function () {
        font = env.loadFont('../../assets/fonts/Bebas-Regular.ttf');
    }

    env.setup = function () {
        let w = env.windowWidth;
        let h = env.windowHeight / 3;

        env.createCanvas(w, h);

        const FONT_SIZE = w / 11;
        const TEXT_WIDTH = env.textWidth(TITLE_TEXT);

        let points = font.textToPoints(TITLE_TEXT, w / 25, h / 1.25, FONT_SIZE, {
            sampleFactor: 0.13
        });

        vehicles = [];

        for (let i = 0; i < points.length; i++) {
            let pt = points[i];
            let vehicle = new Vehicle(env, pt.x, pt.y);
            vehicles.push(vehicle);
        }
    }

    env.draw = function () {
        env.background(40);
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
util.addEvent(window, 'resize', function (event) {
    titleCanvasElement.setup();
});