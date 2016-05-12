var createPlayer = function () {
    var player = new Utility.Sprite();

    player.size.set(32);
    player.src_rect = new Utility.Rectangle(0, 0, 32, 32);

    player.location = new Utility.Vector2();
    player.velocity = new Utility.Vector2();
    player.speed = 0.3;
    player.jump_speed = -0.9;
    player.on_ground = false;

    player.getBounds = function () {
        return new Utility.Rectangle(
            this.location.x,
            this.location.y,
            this.size.x,
            this.size.y
        );
    };

    player.getCollisionZone = function (dt) {
        return this.getBounds().merge(new Utility.Rectangle(
            this.location.x + (this.velocity.x * dt),
            this.location.y + (this.velocity.y * dt),
            this.size.x,
            this.size.y
        ));
    };

    player.update = function (dt, game) {

        // Apply gravity.
        this.velocity.y += dt * GRAVITY;

        // Move left and right.
        if (game.keyboard.isDown(Utility.Keys.D)) {
            this.velocity.x = this.speed;
        } else if (game.keyboard.isDown(Utility.Keys.A)) {
            this.velocity.x = -this.speed;
        } else {
            this.velocity.x = 0;
        }

        // Jump.
        if (this.on_ground && game.keyboard.isDown(Utility.Keys.W)) {
            this.velocity.y = this.jump_speed;
        }

        // Resolve collision.
        this.on_ground = false;
        game.level.tiles.forEach(function (row, y) {
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
                        } else if (game.level.tiles[y + 1][x] === null) {
                            player.location.y = tile.bottom;
                            player.velocity.y = 0;
                        }
                    } else {
                        if (distance.x < 0) {
                            player.location.x = tile.x - bounds.w;
                            player.velocity.x = 0;
                        } else if (game.level.tiles[y][x + 1] === null) {
                            player.location.x = tile.right;
                            player.velocity.x = 0;
                        }
                    }
                }
            });
        });

        // Apply velocity.
        this.location.x += this.velocity.x * dt;
        this.location.y += this.velocity.y * dt;
    };

    return player;
};