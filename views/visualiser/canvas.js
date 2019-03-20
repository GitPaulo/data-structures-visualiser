/* global activeOperation, visualisationCanvasElement, p5, activeItem, canvasID, util */

var visualisationCanvas = new p5((env) => {
    env.preload = function () {
        // is loaded before setup() and draw() are called
        env.TITLE_SIZE    = 80;
        env.SUBTITLE_SIZE = 30;
        env.CAPS_FONT     = env.loadFont('../../assets/fonts/BebasNeue-Bold.otf');
        env.NORMAL_FONT   = env.loadFont('../../assets/fonts/Montserrat-Light.otf');
        env.BACKGROUND    = [40, 40, 40];
        env.TEXT_COLOR    = [255, 255, 255];
        env.TITLE         = "Animation Canvas";
        env.SUBTITLE      = "No Data Structure Selected";
    }

    env.setup = function (w=visualisationCanvasElement.offsetWidth,  
                          h=visualisationCanvasElement.offsetHeight) {
        env.createCanvas(w, h);
        env.stroke(0,0,0)
    }

    env.pausedScreen = function () {
        let msg = "(Paused)";
        env.textFont(env.NORMAL_FONT);
        env.textSize(env.FONT_SIZE/2);

        let tw = env.textWidth(msg);
        let th = env.textSize();

        env.fill([200, 90, 100]);
        env.text(msg, env.width/2 - tw/2, 10 + th/2);
    }

    env.noItemScreen = function () {
        // Title
        env.background(...env.BACKGROUND);
        env.textFont(env.CAPS_FONT);
        env.textSize(env.TITLE_SIZE);

        let tw = env.textWidth(env.TITLE);
        let th = env.textSize();

        env.fill(...env.TEXT_COLOR);
        env.text(env.TITLE, env.width/2 - tw/2, env.height/2 + th/2);

        // Subtitle
        env.textFont(env.NORMAL_FONT);
        env.textSize(env.SUBTITLE_SIZE);

        let tw2 = env.textWidth(env.SUBTITLE);
        let th2 = env.textSize();

        env.text(env.SUBTITLE, env.width/2 - tw2/2, env.height/1.5 + th2/2);
    }

    env.draw = function () {
        if (activeItem === null) {
            env.noItemScreen();
            return;
        }

        // clear 
        env.background(...env.BACKGROUND);

        if (activeOperation.shouldYield)
            env.pausedScreen();

        // draw active item
        activeItem.draw(env);
    }


}, canvasID); // attach it to div id: `titleCanvas` on index.html

// Reload canvas on screen resize
let canvasResize = () => {
    let w = visualisationCanvasElement.offsetWidth;
    let h = visualisationCanvasElement.offsetHeight;

    visualisationCanvas.setup(w, h);
    console.log("Visualisation canvas resized!")
}

util.addEvent(window, "resize", canvasResize);
