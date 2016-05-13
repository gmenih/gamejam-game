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

    Utility.Game.addState('game', {

        preload: function (game) {
            game.load.image('tileset', '/assets/tileset.png');
            game.load.image('spritesheet', '/assets/spritesheet.png');
            game.load.json('level-1', '/assets/maps/level-1.json');
        },

        onready: function (game) {
            var master = this;
            master.controlledPlayer = null;
            master.flagHunter = null;
            master.spawnPlayer1 = function (x, y) {
                master.player1 = createPlayer(1);
                master.player1.location = new Utility.Vector2(x, y);
                master.player1.image = game.load.images.get('spritesheet');
                master.players.push(master.player1);
            }
            master.spawnPlayer2 = function (x, y) {
                master.player2 = createPlayer(2);
                master.player2.location = new Utility.Vector2(x, y);
                master.player2.image = game.load.images.get('spritesheet');
                master.players.push(master.player2);
            }
            master.spawnBobi = function (x, y) {
                master.flag = createFlag();
                master.flag.location = new Utility.Vector2(x - 16, y - 37);
                master.flag.image = game.load.images.get('spritesheet');
                master.flag.anchor = new Utility.Vector2(0, 0);
            }
            master.spawnRedGoal = function (x, y) {

            }
            master.spawnBlueGol = function (x, y) {

            }
            // Connect to server
            var request_count = 0;
            var ws = getWebSocket({
                onmessage: function (msg) {
                    var data;
                    try {
                        data = JSON.parse(msg.data);
                    } catch (ex) {
                        console.error(ex);
                        return;
                    }
                    if (data.hasOwnProperty('c')) {
                        if (data.d.index < request_count) {
                            return 0;
                        }

                        request_count = data.d.index;
                        switch(data.c) {
                            case 'start':
                                master.level.layers.spawn.forEach((row, $y)=> {
                                    row.forEach((tile, $x) => {
                                        if (tile) {
                                            switch(tile.id) {
                                                case PLAYER_1:
                                                    master.spawnPlayer1($x * 16, $y * 16);
                                                break;
                                                case PLAYER_2:
                                                    master.spawnPlayer2($x * 16, $y * 16);
                                                break;
                                                case FLAG:
                                                    master.spawnBobi($x * 16, $y * 16);
                                                break;
                                            }
                                        }
                                    });
                                });
                                if (data.d === 'player1'){
                                    master.controlledPlayer = master.player1;
                                    master.flagHunter = master.player2;
                                }
                                else{
                                    master.controlledPlayer = master.player2;
                                    master.flagHunter = master.player1;
                                }
                                master.controlledPlayer.connected = true;
                                master.flagHunter.image = master.controlledPlayer.image;
                                master.flagHunter.input = {
                                    right: false,
                                    left: false,
                                    jump: false,
                                };
                                master.flagHunter.getInput = function (keyboard) {
                                    return master.flagHunter.input;
                                };
                                master.flagHunter.sendInput = function () {
                                    master.flagHunter.input.jump = false;
                                }
                                break;
                            case 'input':
                                master.flagHunter.location.x = data.d.location.x;
                                master.flagHunter.location.y = data.d.location.y;
                                master.flagHunter.input = data.d.input;
                                break;
                            case 'move':
                                master.flagHunter.location.x = data.d.location.x;
                                master.flagHunter.location.y = data.d.location.y;
                                break;
                            case 'pickup':
                                master.flagHunter.flag = master.flag;
                                master.flag.location = master.flagHunter.location;
                            default:
                                console.log(data);
                                break;
                        }
                    }
                }
            });

            this.ws = ws;

            this.keyboard = game.keyboard;

            this.camera = new Utility.Vector2(0, 0);
            this.canvas_center = new Utility.Vector2(
                (WIDTH * 0.5) / SCALE,
                (HEIGHT * 0.5) / SCALE
            );

            this.players = [];
            // Placeholder level
            this.level = createLevel(
                game.load.images.get('tileset'),
                game.load.data.get('level-1')
            );
        },

        update: function (dt, game) {
            if (this.flag)
                this.flag.animation.update(dt);
            this.players.forEach((player) => {
                player.update(dt, this);
                if (player.getCollisionZone(dt).overlaps(this.flag.getBounds())) {
                    if (player.name === 'player1'){
                        this.flag.animation.play('red-holding');
                    }
                    else{
                        this.flag.animation.play('blue-holding');
                    }
                    if (player.name === this.controlledPlayer.name){
                        this.flag.location = this.controlledPlayer.location;
                        this.controlledPlayer.flag = this.flag;
                        this.ws.send(JSON.stringify({c: 'pickup', d: {index: this.controlledPlayer.request_count}}));
                        this.controlledPlayer.request_count++;
                    }
                    this.flag.size = new Utility.Vector2(32, 32);
                    
                }
            });
        },

        render: function (canvas) {

            // Offset canvas so the player in centered.
            if (this.controlledPlayer){
                var offset = this.controlledPlayer.location.copy().sub(this.canvas_center);
                canvas.context.translate(this.camera.x - offset.x, this.camera.y - offset.y);
                this.camera = offset.copy();
                canvas.context.clearRect(offset.x, offset.y, WIDTH, HEIGHT);
            } else {
                canvas.clear();
            }
            // Render elements.
            this.level.renderLayer(canvas, this.level.layers.background);
            this.level.renderLayer(canvas, this.level.layers.middleground);
            this.players.forEach((player, $i) => {
                canvas.drawSprite(player)
            });
            if (this.flag)
                canvas.drawSprite(this.flag);
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