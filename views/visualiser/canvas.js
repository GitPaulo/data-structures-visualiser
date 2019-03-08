var visualisationCanvas = new p5((env) => {
    // Member vars
    env.noLoop = false;

    env.preload = function () {
        // is loaded before setup() and draw() are called
        env.CAPS_FONT   = env.loadFont('../../assets/fonts/BebasNeue-Bold.otf');
        env.NORMAL_FONT = env.loadFont('../../assets/fonts/Montserrat-Light.otf');
    }

    env.setup = function (w=visualisationCanvasElement.offsetWidth,  h=visualisationCanvasElement.offsetHeight) {
        let c = env.createCanvas(w, h);
        env.stroke(0,0,0)
    }

    env.noItemScreen = function () {
        let msg = "Animation Canvas";
        env.background(40,40,40);
        env.textFont(env.CAPS_FONT);
        env.textSize(80);

        let tw = env.textWidth(msg);
        let th = env.textSize();
        
        env.fill(255, 255, 255);
        env.text(msg, env.width/2 - tw/2, env.height/2 + th/2);

        let msg2 = "No Data Structure Selected";
        env.textFont(env.NORMAL_FONT);
        env.textSize(30);

        let tw2 = env.textWidth(msg2);
        let th2 = env.textSize();
        
        env.fill(255, 255, 255);
        env.text(msg2, env.width/2 - tw2/2, env.height/1.5 + th2/2);
    }

	env.draw = function () {
        if (env.noLoop)
            return;
        
        if (activeItem === null) {
            env.noItemScreen();
            return;
        } 

        // clear and draw!
        env.background(40,40,40);
        activeItem.draw(env);
    }
    

}, canvasID); // attach it to div id: `titleCanvas` on index.html

// reload it on screen resize
let canvasResize = () => {
    let w = visualisationCanvasElement.offsetWidth;
    let h = visualisationCanvasElement.offsetHeight;

    visualisationCanvas.setup(w, h);
    console.log("TEST")
}

util.addEvent(window, "resize", canvasResize);
