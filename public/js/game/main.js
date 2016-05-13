// CONST VALUES
const GRAVITY = 0.003;
const WIDTH = 1280;
const HEIGHT = 720;
const SCALE = 2;
var PLAYER_1 = 52;
var PLAYER_2 = 103;
var FLAG = 256;
var GOAL_BLUE = 205;
var GOAL_RED = 154;

(function () {

    "use strict";

    Utility.Game.addState('pause', {
        update: function () {},
        render: function () {},
    });


    // Set up canvas.
    Utility.Game.canvas.set('gameCanvas');
    Utility.Game.canvas.context.scale(SCALE, SCALE);
    Utility.Game.canvas.context['imageSmoothingEnabled'] = false;       /* standard */
    Utility.Game.canvas.context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    Utility.Game.canvas.context['oImageSmoothingEnabled'] = false;      /* Opera */
    Utility.Game.canvas.context['webkitImageSmoothingEnabled'] = false; /* Safari */
    Utility.Game.canvas.context['msImageSmoothingEnabled'] = false;     /* IE */

    // Start the game.
    Utility.Game.setState('connecting');
    Utility.Game.run();

}());