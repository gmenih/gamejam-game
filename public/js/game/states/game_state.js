Utility.Game.addState('game', {

    preload: function (game) {
        game.load.image('tileset', '/assets/tileset.png');
        game.load.image('spritesheet', '/assets/spritesheet.png');
        game.load.json('level-1', '/assets/maps/level-1.json');
    },

    onready: function (game) {
        this.spritesheet = game.load.images.get('spritesheet');
        this.keyboard = game.keyboard;

        this.camera = new Utility.Vector2(0, 0);
        this.canvas_center = new Utility.Vector2(
            (WIDTH * 0.5) / SCALE,
            (HEIGHT * 0.5) / SCALE
        );

        this.players = [];
        this.controlledPlayer = null;
        this.flagHunter = null;

        this.level = createLevel(
            game.load.images.get('tileset'),
            game.load.data.get('level-1')
        );
    },

    update: function (dt, game) {
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
        var offset = this.controlledPlayer.location.copy().sub(this.canvas_center);
        canvas.context.translate(this.camera.x - offset.x, this.camera.y - offset.y);
        this.camera = offset.copy();
        canvas.context.clearRect(offset.x, offset.y, WIDTH, HEIGHT);

        // Render elements.
        this.level.renderLayer(canvas, this.level.layers.background);
        this.level.renderLayer(canvas, this.level.layers.middleground);
        canvas.drawSprite(this.flag);
        this.players.forEach((player, $i) => {
            canvas.drawSprite(player)
        });
        this.level.renderLayer(canvas, this.level.layers.foreground);
    },

    onplayerconnect: function (ws, data) {
        var master = this;
        master.ws = ws;

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

        master.bindSocket(ws);
    },

    // WS events
    bindSocket: function (ws) {
        var request_count = 0;

        var master = this;

        ws.onmessage = function (msg) {
            try {
                var data = JSON.parse(msg.data);
            } catch (ex) {
                console.error(ex);
                return;
            }

            if (!data.hasOwnProperty('c') || data.d.index < request_count) {
                request_count = Math.max(request_count, data.d.index);
                return 0;
            }

            switch(data.c) {
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
                    master.controlledPlayer.flag = null;
                    master.flagHunter.flag = master.flag;
                    master.flag.location = master.flagHunter.location;
                    break;
                default:
                    console.log(data);
                    break;
            }
        };
    },

    // Helpers
    spawnPlayer1: function (x, y) {
        this.player1 = createPlayer(1);
        this.player1.location = new Utility.Vector2(x, y);
        this.player1.image = this.spritesheet;
        this.players.push(this.player1);
    },

    spawnPlayer2: function (x, y) {
        this.player2 = createPlayer(2);
        this.player2.location = new Utility.Vector2(x, y);
        this.player2.image = this.spritesheet;
        this.players.push(this.player2);
    },

    spawnBobi: function (x, y) {
        this.flag = createFlag();
        this.flag.location = new Utility.Vector2(x - 16, y - 37);
        this.flag.image = this.spritesheet;
        this.flag.anchor = new Utility.Vector2(0, 0);
    },

    spawnRedGoal: function (x, y) {

    },

    spawnBlueGol: function (x, y) {

    },
});