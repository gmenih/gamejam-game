
// Place holder level.
var createLevel = function (image, tiles) {

    const tile_width = 32;
    const tile_height = 32;
    const tileset_width = 512 / tile_width;

    /**
     * get tile object.
     *
     * @author Blaž Pečnik <blaz@easistent.com>
     *
     * @param  {Utility.Rectangle} draw_rect [Where the tile is drawn on the screen]
     * @param  {Utility.Rectangle} src_rect  [Which part of the image to draw]
     *
     * @return {Utility.Rectangle}
     */
    var getTile = function (draw_rect, src_rect) {
        draw_rect.src_rect = src_rect;
        return draw_rect;
    };

    var level = {
        layers: {
            background: [],
            middleground: [],
            foreground: [],
            collision: [],
        },

        renderLayer: function (canvas, layer) {
            layer.forEach(function (row, y) {
                row.forEach(function (tile, x) {
                    if (tile !== null) {
                        canvas.drawImage(image, tile, tile.src_rect);
                    }
                });
            });
        },
    };

    // TMP
    level.layers.collision = tiles.map(function (row, y) {
        return row.map(function (id, x) {
            if (id === 0) {
                return null;
            }

            return getTile(

                // Draw rect
                new Utility.Rectangle(tile_width * x, tile_height * y, tile_width, tile_height),

                // Src rect
                new Utility.Rectangle(
                    Math.round((id - 1) % tileset_width) * tile_width,
                    Math.round((id - 1) / tileset_width) * tile_height,
                    tile_width,
                    tile_height
                )
            );
        });
    });

    return level;
};