// CONST VALUES
const GRAVITY = 0.003;
const WIDTH = 800;
const HEIGHT = 600;

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

            // Placeholder level
            this.level = createLevel(game.load.images.get('tileset'), [
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],

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
            canvas.clear();
            this.level.render(canvas);
            canvas.drawSprite(this.player);
        },
    });

    Utility.Game.canvas.create(WIDTH, HEIGHT, 'game-canvas');
    Utility.Game.setState('game');
    Utility.Game.run();

}());