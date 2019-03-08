const util = {};

util.addEvent = function (object, type, callback) {
    if (object == null || typeof (object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on" + type] = callback;
    }
};

util.toArray = function (list) {
    return Array.prototype.slice.call(list || [], 0);
};

// good boy
util.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// yikes
util.busySleep = function (ms) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + ms) {
        /* do nothing */
    }
}

util.d2d3 = function (x1, y1, x2, y2, x3, y3) {
    return Math.abs((y2 - y1) * x3 - (x2 - x1) * y3 + x2 * y1 - y2 * x1) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}

util.swapSubstrings = function (str, ss1, ss2) {
    let exp = new RegExp(`(${ss1}|${ss2})`, "g");
    return str.replace(exp, function ($1) {
        return $1 === ss1 ? ss2 : ss1;
    });
}

util.capitalise = function (str) {
    return str.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
}

/* Perhaps move these draw functions somewhere else! */
util.drawArrow = function (sx, sy, ang, offset, env) {
    env.push() //start new drawing state
    env.translate(sx, sy); //translates to the destination vertex
    env.rotate(ang); //rotates the arrow point
    env.triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); //draws the arrow point as a triangle
    env.pop();
}

util.curveBetween = function (x1, y1, x2, y2, d, h, flip, env) {
    //find two control points off this line
    var original = p5.Vector.sub(p5.createVector(x2, y2), env.createVector(x1, y1));
    var inline   = original.copy().normalize().mult(original.mag() * d);
    var rotated  = inline.copy().rotate(env.radians(90) + flip * env.radians(180)).normalize().mult(original.mag() * h);
    var p1 		 = p5.Vector.add(p5.Vector.add(inline, rotated), env.createVector(x1, y1));

    //line(x1, y1, p1.x, p1.y); //show control line
    rotated.mult(-1);
    var p2 = p5.Vector.add(p5.Vector.add(inline, rotated).mult(-1), env.createVector(x2, y2));

    //line(x2, y2, p2.x, p2.y); //show control line
    env.bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2)
}

util.drawParralelLine = function (x1, y1, x2, y2, n, a, env) {
    let x1b = x1 + n * Math.cos(a);
    let y1b = y1 - n * Math.sin(a);
    let x2b = x2 + n * Math.cos(a);
    let y2b = y2 - n * Math.sin(a);

    env.line(x1b, y1b, x2b, y2b);
}

module.exports = util;