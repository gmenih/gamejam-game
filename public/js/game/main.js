// CONST VALUES
const GRAVITY = 0.003;
const WIDTH = 1280;
const HEIGHT = 720;
const SCALE = 2;

(function () {

    "use strict";

    Utility.Game.addState('pause', {
        update: function () {},
        render: function () {},
    });

    Utility.Game.addState('game', {

        preload: function (game) {
            game.load.image('tileset', 'assets/tileset.png');
            game.load.image('spritesheet', 'assets/spritesheet.png');
        },

        onready: function (game) {
            this.keyboard = game.keyboard;
            this.player = createPlayer();
            this.player.image = game.load.images.get('spritesheet');

            this.camera = new Utility.Vector2(0, 0);
            this.canvas_center = new Utility.Vector2(
                (WIDTH * 0.5) / SCALE,
                (HEIGHT * 0.5) / SCALE
            );

            // Placeholder level
            this.level = createLevel(game.load.images.get('tileset'), [
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0],

                [ 0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],
                [33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35],
                [49, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51],
            ]);
        },

        update: function (dt, game) {
            this.player.update(dt, this);
        },

        render: function (canvas) {

            // Offset canvas so the player in centered.
            var offset = this.player.location.copy().sub(this.canvas_center);
            canvas.context.translate(this.camera.x - offset.x, this.camera.y - offset.y);
            this.camera = offset.copy();

            // Render elements.
            canvas.context.clearRect(offset.x, offset.y, WIDTH, HEIGHT);
            this.level.renderLayer(canvas, this.level.layers.collision);
            canvas.drawSprite(this.player);
        },
    });

    // Set up canvas.
    Utility.Game.canvas.create(WIDTH, HEIGHT, 'game-canvas');
    Utility.Game.canvas.context.scale(SCALE, SCALE);
    Utility.Game.canvas.context['imageSmoothingEnabled'] = false;       /* standard */
    Utility.Game.canvas.context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    Utility.Game.canvas.context['oImageSmoothingEnabled'] = false;      /* Opera */
    Utility.Game.canvas.context['webkitImageSmoothingEnabled'] = false; /* Safari */
    Utility.Game.canvas.context['msImageSmoothingEnabled'] = false;     /* IE */

    // Start the game.
    Utility.Game.setState('game');
    Utility.Game.run();

}());