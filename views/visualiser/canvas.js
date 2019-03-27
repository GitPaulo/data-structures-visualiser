/* global activeOperation, visualisationCanvasElement, p5, activeItem, canvasID, util */

var visualisationCanvas = new p5((env) => {
    env.preload = function () {
        // is loaded before setup() and draw() are called
        env.SCALE_MLT     = 1;
        env.TITLE_SIZE    = 80;
        env.SUBTITLE_SIZE = 30;
        env.CAPS_FONT     = env.loadFont('../../assets/fonts/BebasNeue-Bold.otf');
        env.NORMAL_FONT   = env.loadFont('../../assets/fonts/Montserrat-Light.otf');
        env.BACKGROUND    = [40, 40, 40];
        env.TEXT_COLOR    = [255, 255, 255];
        env.TITLE         = "Animation Canvas";
        env.SUBTITLE      = "No Data Structure Selected";
        env.PAUSE_TITLE   = `PAUSED [OFFSET: 0]`;
    }

    env.setup = function (w=visualisationCanvasElement.offsetWidth,  
                          h=visualisationCanvasElement.offsetHeight) {
        env.createCanvas(w, h);
        env.stroke(0,0,0)
    }

    env.pausedScreen = function () {
        env.textFont(env.CAPS_FONT);
        env.textSize(30);

        let tw = env.textWidth(env.PAUSE_TITLE);
        let th = env.textSize();

        env.fill(0, 0, 0);
        env.rect(32, 32, tw + 58, 41);
        env.fill(65, 40, 40);
        env.rect(32+2, 32+2, tw+58-2, 40-2);

        env.fill(255, 255, 255);
        let sign = activeOperation.offset == 0 ? "+" : "";
        env.text(`PAUSED [OFFSET: ${sign}${activeOperation.offset}]`, 70, 63);

        env.fill(255, 50, 90);
        env.ellipse(50, 53, 20);
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
        env.scale(env.SCALE_MLT);

        if (activeItem === null) {
            env.noItemScreen();
            return;
        }

        // clear 
        env.background(...env.BACKGROUND);

        // draw active item
        activeItem.draw(env);

        if (activeOperation.isPaused)
            env.pausedScreen();
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
