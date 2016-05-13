var PLAYER_1 = 52;
var PLAYER_2 = 103;
var FLAG = 256;
// Place holder level.
var createLevel = function (image, data) {
    const tileWidth = 10; //data.tileheight;
    const tileHeight = 10; //data.tilewidth;
    const tilesetWidth = Math.floor(512 / tileWidth);

    function getTileObj(id, levelX, levelY) {
        if (id === 0)
            return null;
        var tile = new Utility.Rectangle(levelX * 16, levelY * 16, 16, 16);
        tile.id = id;
        tile.src_rect = new Utility.Rectangle(
            Math.round((id - 1) % tilesetWidth) * tileWidth,
            Math.round((id - 1) / tilesetWidth) * tileHeight,
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

    return level;
};