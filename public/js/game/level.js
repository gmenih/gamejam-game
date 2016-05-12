
// Place holder level.
var createLevel = function (image, data) {
    const tileWidth = 32;
    const tileHeight = 32;
    const tilesetWidth = 512 / tileWidth;
    
    function getTileObj(t, levelX, levelY) {
        if (t === 0)
            return null;
        var tile = new Utility.Rectangle(levelX * tileWidth, levelY * tileHeight, tileWidth, tileHeight);
        tile.src_rect = new Utility.Rectangle(
            Math.round((t - 1) % tilesetWidth) * tileWidth,
            Math.round((t - 1) / tilesetWidth) * tileHeight,
            tileWidth,
            tileHeight
            );
        return tile;
    }
    
    var layer = function (w, h) {
        this.height = h;
        this.width = w;
        this.tiles = [];
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


    for (var i in data.layers) {//each layer
        var currentLayer = data.layers[i];
        var tmpLayerObj = new layer(currentLayer.width, currentLayer.height);
        var x = 0, y = 0;
        var tmpArr = [];
        for (var j in currentLayer.data) {//each tile
            var tileNum = currentLayer.data[j];    
            var tile = getTileObj(tileNum, x, y);
            tmpArr.push(tile);
            x++;
            if (x >= tmpLayerObj.width) {
                tmpLayerObj.tiles.push(tmpArr);
                tmpArr = [];
                y++;
                x = 0;
            }
        }

        level.layers[currentLayer.name] = tmpLayerObj.tiles;
    }

    // TMP
    /*level.layers.collision = tiles.map(function (row, y) {
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
    });*/

    return level;
};