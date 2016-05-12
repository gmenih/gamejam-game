
// Place holder level.
var createLevel = function (tileset, tiles) {

    var tile_width = 32;
    var tile_height = 32;
    var tileset_width = 512 / 32;

    var tiles = tiles.map(function (row, y) {
        var src_rect = {};

        var getTileRect = function (x, y) {
            return new Utility.Rectangle(tile_width * x, tile_height * y, tile_width, tile_height);
        }

        var getSrcRect = function (id) {
            if (src_rect[id] === undefined) {
                src_rect[id] = new Utility.Rectangle(
                    Math.round((id - 1) % tileset_width) * tile_width,
                    Math.round((id - 1) / tileset_width) * tile_height,
                    tile_width,
                    tile_height
                );
            }

            return src_rect[id];
        };

        return row.map(function (id, x) {
            if (id === 0) {
                return null;
            }

            var tile = getTileRect(x, y);
            tile.src_rect = getSrcRect(id);
            return tile;
        });
    });

    var render = function (canvas) {
        tiles.forEach(function (row, y) {
            row.forEach(function (tile, x) {
                if (tile !== null) {
                    canvas.drawImage(tileset, tile, tile.src_rect);
                    // canvas.drawText(x +', '+ y, tile, 8); debug
                }
            });
        });
    };

    return {
        tiles: tiles,
        render: render,
    }
};