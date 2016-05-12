// CONST VALUES
const GRAVITY = 0.003;
const WIDTH = 1280;
const HEIGHT = 720;
const SCALE = 3;

(function () {

    "use strict";

    Utility.Game.addState('pause', {
        update: function () {},
        render: function () {},
    });

    Utility.Game.addState('game', {

        preload: function (game) {
            game.load.image('tileset', '/assets/tileset.png');
            game.load.image('spritesheet', '/assets/spritesheet.png');
            game.load.json('level-1', '/assets/maps/level-1.json');
        },

        onready: function (game) {

            var master = this;

            // Connect to server
            var ws = getWebSocket({
                onmessage: function (msg) {
                    var data;
                    try {
                        data = JSON.parse(msg.data);
                    } catch (ex) {
                        console.log(msg.data);
                        console.error(ex);
                        return;
                    }
                    if (data.hasOwnProperty('c')) {
                        switch(data.c) {
                            case 'start':
                                master.player.connected = true;
                                master.enemy_player = createPlayer();
                                master.enemy_player.image = game.load.images.get('spritesheet');
                                master.enemy_player.input = {
                                    right: false,
                                    left: false,
                                    jump: false,
                                };
                                master.enemy_player.getInput = function (keyboard) {
                                    return master.enemy_player.input;
                                };
                                master.players.push(master.enemy_player);
                                break;
                            case 'move':
                                master.enemy_player.location.x = data.location.x;
                                master.enemy_player.location.y = data.location.y;
                                break;
                            default:
                                console.log(data);
                                break;
                        }
                    }
                }
            });

            this.ws = ws;

            this.keyboard = game.keyboard;
            this.player = createPlayer();
            this.player.location.x = 100;
            this.player.image = game.load.images.get('spritesheet');

            this.camera = new Utility.Vector2(0, 0);
            this.canvas_center = new Utility.Vector2(
                (WIDTH * 0.5) / SCALE,
                (HEIGHT * 0.5) / SCALE
            );

            this.players = [];
            this.players.push(this.player);

            // Placeholder level
            this.level = createLevel(
                game.load.images.get('tileset'),
                game.load.data.get('level-1')
            );
        },

        update: function (dt, game) {
            this.players.forEach(player => player.update(dt, this));
        },

        render: function (canvas) {

            // Offset canvas so the player in centered.
            var offset = this.player.location.copy().sub(this.canvas_center);
            canvas.context.translate(this.camera.x - offset.x, this.camera.y - offset.y);
            this.camera = offset.copy();

            // Render elements.
            canvas.context.clearRect(offset.x, offset.y, WIDTH, HEIGHT);
            this.level.renderLayer(canvas, this.level.layers.background);
            this.level.renderLayer(canvas, this.level.layers.middleground);
            this.players.forEach(player => canvas.drawSprite(this.player));
            this.level.renderLayer(canvas, this.level.layers.foreground);
            this.level.renderLayer(canvas, this.level.layers.foreground);
        },
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
    Utility.Game.setState('game');
    Utility.Game.run();

}());