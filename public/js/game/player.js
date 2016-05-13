var createPlayer = function () {
    var player = new Utility.Sprite();
    player = Utility.Sprite.animatable(player);
    player.animation.add('run-right', {
        speed: 165,
        frames: [
            new Utility.Rectangle(0, 32, 32, 32),
            new Utility.Rectangle(32, 32, 32, 32),
            new Utility.Rectangle(64, 32, 32, 32),
            new Utility.Rectangle(96, 32, 32, 32),
            new Utility.Rectangle(128, 32, 32, 32),
            new Utility.Rectangle(160, 32, 32, 32),
        ]
    });
    player.animation.add('run-left', {
        speed: 165,
        frames: [
            new Utility.Rectangle(0, 64, 32, 32),
            new Utility.Rectangle(32, 64, 32, 32),
            new Utility.Rectangle(64, 64, 32, 32),
            new Utility.Rectangle(96, 64, 32, 32),
            new Utility.Rectangle(128, 64, 32, 32),
            new Utility.Rectangle(160, 64, 32, 32),
        ]
    });
    player.animation.add('idle-right', {
        speed: 300,
        frames: [
            new Utility.Rectangle(0, 0, 32, 32),
            new Utility.Rectangle(32, 0, 32, 32),
        ]
    });
    player.animation.add('idle-left', {
        speed: 300,
        frames: [
            new Utility.Rectangle(64, 0, 32, 32),
            new Utility.Rectangle(96, 0, 32, 32),
        ]
    })
    player.animation.play('run-right');
    player.idle_animation = 'idle-right';


    player.size.set(32);

    player.location = new Utility.Vector2();
    player.velocity = new Utility.Vector2();
    player.speed = 0.15;
    player.jump_speed = -0.9;
    player.deacceleration = 0.8;
    player.on_ground = false;
    player.last_send_elapsed = 0;
    player.request_count = 0;

    player.getInput = function (keyboard) {
        return {
            right: keyboard.isDown(Utility.Keys.D),
            left: keyboard.isDown(Utility.Keys.A),
            jump: (player.on_ground && keyboard.pressed(Utility.Keys.W)),
        };
    };

    player.getBounds = function () {
        return new Utility.Rectangle(
            player.location.x,
            player.location.y,
            player.size.x,
            player.size.y
        );
    };

    player.getCollisionZone = function (dt) {
        return player.getBounds().merge(new Utility.Rectangle(
            player.location.x + (player.velocity.x * dt),
            player.location.y + (player.velocity.y * dt),
            player.size.x,
            player.size.y
        ));
    };

    player.sendInput = function (input, game, dt) {
        if (player.connected) {
            if (JSON.stringify(player.pass_input) !== JSON.stringify(input)) {
                game.ws.send(JSON.stringify({
                    c: 'input',
                    d: {
                        location: player.location,
                        input: input,
                        index: player.request_count,
                    }
                }));
                player.request_count++;
            } else if (player.last_send_elapsed > 100) {
                player.last_send_elapsed = 0;
                game.ws.send(JSON.stringify({
                    c: 'move',
                    d: {
                        location: player.location,
                        direction: 1,
                        index: player.request_count,
                    }
                }));

                player.request_count++;
            }

            player.last_send_elapsed += dt;
        }

        player.pass_input = input;
    };

    player.update = function (dt, game) {

        // Apply gravity.
        player.velocity.y += dt * GRAVITY;

        var input = player.getInput(game.keyboard);

        // Move left and right.
        if (input.right) {
            player.velocity.x = player.speed;
            player.animation.play('run-right');
            player.idle_animation = 'idle-right';
        } else if (input.left) {
            player.velocity.x = -player.speed;
            player.animation.play('run-left');
            player.idle_animation = 'idle-left';
        } else {
            player.velocity.x = player.velocity.x * player.deacceleration;
            player.animation.play(player.idle_animation);
        }

        // Jump.
        if (input.jump) {
            player.velocity.y = player.jump_speed;
        }

        player.sendInput(input, game, dt);

        // Resolve collision.
        var tiles = game.level.layers.collision;
        player.on_ground = false;
        tiles.forEach(function (row, y) {
            row.forEach(function (tile, x) {
                var zone = player.getCollisionZone(dt);

                if (tile !== null && zone.overlaps(tile)) {
                    let bounds = player.getBounds();
                    let distance = new Utility.Vector2(
                        (bounds.x - tile.origin.x) / (bounds.w + tile.w),
                        (bounds.y - tile.origin.y) / (bounds.h + tile.h)
                    );

                    if (Math.abs(distance.x) < Math.abs(distance.y)) {
                        if (distance.y < 0) {
                            player.location.y = tile.y - bounds.h;
                            player.velocity.y = 0;
                            player.on_ground = true;
                        } else if (tiles[y + 1][x] === null) {
                            player.location.y = tile.bottom;
                            player.velocity.y = 0;
                        }
                    } else {
                        if (distance.x < 0) {
                            player.location.x = tile.x - bounds.w;
                            player.velocity.x = 0;
                        } else if (tiles[y][x + 1] === null) {
                            player.location.x = tile.right;
                            player.velocity.x = 0;
                        }
                    }
                }
            });
        });

        // Apply velocity.
        player.location.x += player.velocity.x * dt;
        player.location.y += player.velocity.y * dt;

        // Update animation.
        player.animation.update(dt);
    };

    return player;
};