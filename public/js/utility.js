/*jshint esversion: 6 */
var Utility = {};
Utility.Collection = (function () {

    "use strict";

    class Collection {

        constructor (items) {
            this._items = items || {};
            this._count = Object.keys(this._items).length;
        }

        /**
         * Has item with thsi key
         *
         * @param  string  key
         *
         * @return {Boolean}
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        has (key) {
            return this._items[key] !== undefined;
        }

        /**
         * Has item.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {mixed}  item
         *
         * @return {Boolean}
         */
        hasItem (item) {
            var ii = 0;
            for (ii in this._items) {
                if (this._items[ii] === item) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Add item
         *
         * @param  mixed
         *
         * @return boolen
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        add (item) {
            return this.put(this._count, item);
        }

        /**
         * Add item with a specific key
         *
         * @param  string key
         * @param  mixed  item
         *
         * @return boolean
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        put (key, item) {
            this._count += this.has(key) ? 0 : 1;
            this._items[key] = item;
            return true;
        }

        /**
         * Get object with all key items
         *
         * @return Object
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        all () {
            var items = {};
            this.each(function (value, key) {
                items[key] = value;
            });

            return items;
        }

        /**
         * Get item
         *
         * @param  string key
         *
         * @return mixed
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        get (key) {
            return this._items[key];
        }

        /**
         * Get first item of collection
         *
         * @return mixed
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        first () {
            return this.values().get(0);
        }

        /**
         * Get item item of collection
         *
         * @return mixed
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        last () {
            var values = this.values();
            return values.get(values.count() - 1);
        }

        /**
         * Tries to get value,
         * if value doesn't exist, store and return the callback return value.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {mixed}    key
         * @param  {Function} callback
         *
         * @return {mixed}
         */
        findOrGet (key, callback) {
            if (!this.has(key)) {
                this.put(key, callback());
            }

            return this.get(key);
        }

        /**
         * Count items
         *
         * @return int
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        count () {
            return this._count;
        }

        /**
         * Is empty
         *
         * @return boolean
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        isEmpty () {
            return this._count === 0;
        }

        /**
         * Remove items
         *
         * @param  string key
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        remove (key) {
            if (this.has(key)) {
                delete this._items[key];
                this._count -= 1;
            }
        }

        /**
         * Loop trugh collection
         *
         * @param  Function callback
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        each (callback) {
            var key;
            for (key in this._items) {
                if (callback(this._items[key], key) === false) {
                    return 0;
                }
            }
        }

        /**
         * Map array
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Function} callback
         *
         * @return {Collection}
         */
        map (callback) {
            return this.reduce(new Collection(), function (collection, item, key) {
                collection.put(key, callback(item, key));
                return collection;
            });
        }

        /**
         * Filter
         *
         * @return Collection
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        filter (callback) {
            var collection = new Collection();

            this.each(function (item, key) {
                if (callback(item, key)) {
                    collection.put(key, item);
                }
            });

            return collection;
        }

        /**
         * Reduce
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Function} callback
         *
         * @return {mixed}
         */
        reduce (sum, callback) {
            this.each(function (item, key) {
                sum = callback(sum, item, key);
            });

            return sum;
        }

        /**
         * Get item keys
         *
         * @return array
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        keys () {
            var collection = new Collection();
            this.each(function (item, key) {
                collection.add(key);
            });

            return collection;
        }

        /**
         * Get collection ov values
         *
         * @return Collection
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        values () {
            var collection = new Collection();
            this.each(function (item) {
                collection.add(item);
            });

            return collection;
        }

        /**
         * Copy collection
         *
         * @return Collection
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        copy () {
            return new Collection(this.all());
        }

        /**
         * Empty the collection
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @return {undefined}
         */
        empty () {
            this._items = {};
            this._count = 0;
        }

        /**
         * Convert to array.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @return {array}
         */
        toArray () {
            var array = [];
            this.each(function (value) {
                array.push(value);
            });
            return array;
        }

        /**
         * Array.sort.
         * Will destory keys.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Function} callback
         *
         * @return {Collection}
         */
        sort (callback) {
            return new Collection(this.toArray().sort(callback));
        }

        /**
         * Group items
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Function} callback
         *
         * @return {Collection}
         */
        groupBy (callback) {
            var groups = new Collection();

            this.each(function (item) {
                var key = callback(item);
                var group = groups.findOrGet(key, function () {
                    return new Collection();
                });
                group.add(item);
            });

            return groups;
        }

    }

    return Collection;
}());
Utility.Rectangle = (function () {

    "use strict";

    class Rectangle {

        constructor (x, y, w, h) {
            this.x = x || 0;
            this.y = y || 0;
            this.w = w || 0;
            this.h = h || 0;
        }

        /**
         * Get Vector2 of rectangles origin.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @return {Utility.Vector2}
         */
        get origin () {
            return new Utility.Vector2(
                this.x + (this.w / 2),
                this.y + (this.h / 2)
            );
        }

        /**
         * Rectangle bottom.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @return {float}
         */
        get bottom () {
            return this.y + this.h;
        }

        /**
         * Rectangle right.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @return {float}
         */
        get right () {
            return this.x + this.w;
        }

        /**
         * If overlaps with other rectangle.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Rectangle} rect
         *
         * @return {boolean}
         */
        overlaps (rect) {
            return (
                !(this.right <= rect.x || rect.right <= this.x) &&
                !(this.bottom <= rect.y || rect.bottom <= this.y)
            );
        }

        merge (rect) {
            var min_x = this.x < rect.x ? this.x : rect.x;
            var min_y = this.y < rect.y ? this.y : rect.y;
            var max_r = this.right > rect.right ? this.right : rect.right;
            var max_b = this.bottom > rect.bottom ? this.bottom : rect.bottom;
            return new Rectangle(
                min_x,
                min_y,
                max_r - min_x,
                max_b - min_y
            );
        }
    }

    return Rectangle;
}());
Utility.Vector2 = (function () {

    "use strict";

    var toVector2 = function (vector) {
        if (typeof vector === 'object') {
            return vector;
        }
        return new Vector2(vector);
    };

    class Vector2 {

        constructor (x, y) {
            this.set(x, y);
        }

        set (x, y) {
            this.x = x || 0;
            this.y = y === undefined ?  x || 0 : y;
        }

        add (vector) {
            vector = toVector2(vector);
            return new Vector2(
                this.x + vector.x,
                this.y + vector.y
            );
        }

        sub (vector) {
            vector = toVector2(vector);
            return new Vector2(
                this.x - vector.x,
                this.y - vector.y
            );
        }

        multiply (vector) {
            vector = toVector2(vector);
            return new Vector2(
                this.x * vector.x,
                this.y * vector.y
            );
        }

        divide (vector) {
            vector = toVector2(vector);
            return new Vector2(
                this.x / vector.x,
                this.y / vector.y
            );
        }

        distance (vector) {
            var x = this.x - vector.x;
            var y = this.y - vector.y;
            return Math.sqrt((x * x) + (y * y));
        }

        move (rotation, distance) {
            distance = distance !== undefined ? distance : 1;
            return new Vector2(Math.sin(rotation), Math.cos(rotation))
                .multiply(distance)
                .add(this);
        }

        copy () {
            return new Vector2(this.x, this.y);
        }
    }

    return Vector2;
}());
Utility.Keyboard = (function () {

    "use strict";

    var pressed = {};

    var getPressedKeys = function () {
        var keys = {};
        var code = 0;
        for (code in pressed) {
            keys[code] = true;
        }

        return keys;
    };

    class Keyboard {

        constructor (keys) {
            this.pass_state = null;
            this.curr_state = null;
        }

        update () {
            this.pass_state = this.curr_state;
            this.curr_state = new Utility.KeyState(getPressedKeys());
            return this;
        }

        pressed (key) {
            return this.curr_state.isDown(key) && this.pass_state.isUp(key);
        }

        released (key) {
            return this.curr_state.isUp(key) && this.pass_state.isDown(key);
        }

        isDown (key) {
            return this.curr_state.isDown(key);
        }

        isUp (key) {
            return this.curr_state.isUp(key);
        }
    }

    Keyboard.start = function () {
        document.addEventListener('keydown', function (event) {
            pressed[event.keyCode] = true;
        }, false);

        document.addEventListener('keyup', function (event) {
            delete pressed[event.keyCode];
        }, false);
    };

    return Keyboard;
}());
Utility.Keys = (function () {

    "use strict";

    return {
        BACKSPACE: 8,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        INSERT: 45,
        DELETE: 46,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90
    };
}());
Utility.KeyState = (function () {

    "use strict";

    class KeyState {

        constructor (keys) {
            this.keys = keys;
        }

        isDown (key) {
            return this.keys[key] === true;
        }

        isUp (key) {
            return !this.isDown(key);
        }
    }

    return KeyState;
}());
Utility.Canvas = (function () {

    "use strict";

    class Canvas {

        constructor () {
            this.canvas = null;
            this.context = null;
        }

        /**
         * Set canvas.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {string} canvas_id
         *
         * @return {Canvas}
         */
        set (canvas_id) {
            this.canvas = document.getElementById(canvas_id);
            this.context = this.canvas.getContext('2d');
            return this;
        }

        /**
         * Create canvas and insert it to the DOM.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {int}    width
         * @param  {int}    height
         * @param  {string} id
         */
        create (width, height, id) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', id || 'canvas');
            canvas.width = width;
            canvas.height = height;
            document.body.appendChild(canvas);
            this.set(id || 'canvas');
        }

        /**
         * Clear cavnas.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @return {Canvas}
         */
        clear () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return this;
        }

        /**
         * Draw sprite.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Utility.Sprite} sprite
         *
         * @return {Canvas}
         */
        drawSprite (sprite) {
            var draw_rect = sprite.getDrawRect();
            if (sprite.rotation !== 0) {
                this.context.save();
                this.context.translate(sprite.location.x, sprite.location.y);
                this.context.rotate(sprite.rotation);
                this.context.translate(-sprite.location.x, -sprite.location.y);
                this.drawImage(sprite.image, draw_rect, sprite.src_rect);
                this.context.restore();
            } else {
                this.drawImage(sprite.image, draw_rect, sprite.src_rect);
            }
            return this;
        }

        /**
         * Draw image.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Image}     image
         * @param  {Rectangle} draw_rect
         * @param  {Rectangle} src_rect
         *
         * @return {Canvas}
         */
        drawImage (image, draw_rect, src_rect) {
            this.context.drawImage(
                image,
                src_rect.x,
                src_rect.y,
                src_rect.w,
                src_rect.h,
                draw_rect.x,
                draw_rect.y,
                draw_rect.w,
                draw_rect.h
            );
            return this;
        }

        /**
         * Draw rect.
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {Rectangle} rect
         * @param  {string}    color
         *
         * @return {Canvas}
         */
        drawRect (rect, color) {
            this.context.fillStyle = color || 'white';
            this.context.fillRect(rect.x, rect.y, rect.w, rect.h);
            return this;
        }

        drawText (text, location, size, font, color) {
            this.context.font = (size || 30) + 'px ' + (font || 'Arial');
            this.context.fillStyle = color || 'black';
            this.context.fillText(text, location.x, location.y);
        }
    }

    return Canvas;
}());
(function () {

    "use strict";

    var Vector2 = Utility.Vector2;
    var Rectangle = Utility.Rectangle;

    class Sprite {

        constructor () {
            this.src_rect = new Rectangle();
            this.location = new Vector2(0);
            this.anchor = new Vector2(0);
            this.scale = new Vector2(1);
            this.size = new Vector2(0);
            this.rotation = 0;
            this.image = null;
        }

        get width () {
            return this.size.x * this.scale.x;
        }

        get height () {
            return this.size.y * this.scale.y;
        }

        getDrawRect () {
            var width = this.width;
            var height = this.height;
            return new Rectangle(
                Math.round(this.location.x - (width * this.anchor.x)),
                Math.round(this.location.y - (height * this.anchor.y)),
                width,
                height
            );
        }
    }

    Sprite.animatable = function (sprite) {
        var list = {};
        var active = null;

        sprite.animation = {
            add: function (name, {frames, speed = 120}) {
                list[name] = {
                    current_frame: 0,
                    elapsed_time: 0,
                    frames: frames,
                    speed: speed,
                    name: name,
                };
            },

            play: function (name) {
                if (active === null || active.name !== name) {
                    active = list[name];
                    active.current_frame = 0;
                    active.elapsed_time = 0;
                    sprite.src_rect = active.frames[0];
                }
            },

            update: function (dt) {
                active.elapsed_time += dt;
                if (active.elapsed_time > active.speed) {
                    active.elapsed_time = 0;
                    active.current_frame = (active.current_frame + 1) % active.frames.length;
                    sprite.src_rect = active.frames[active.current_frame];
                }
            },
        };

        return sprite;
    };

    Utility.Sprite = Sprite;
}());
Utility.Load = (function () {

    "use strict";

    class Load {
        constructor () {
            this.images = new Utility.Collection();
            this.data = new Utility.Collection();
        }

        image (name, src) {
            this.images.put(name, src);
            return this;
        }

        json (name, src) {
            this.data.put(name, src);
        }

        onDone (callback) {
            var load = this;
            var count = 0;
            var asset_count = load.images.count() + load.data.count();

            if (load.images.isEmpty() && load.data.isEmpty()) {
                callback();
            } else {

                // Load json data.
                load.data.each(function (src, name) {
                    var xobj = new XMLHttpRequest();
                    xobj.overrideMimeType("application/json");
                    xobj.open('GET', src, true);
                    xobj.onreadystatechange = function () {
                        if (xobj.readyState == 4 && xobj.status == 200) {
                            count++;
                            load.data.put(name, JSON.parse(xobj.responseText));
                            if (count === asset_count) {
                                callback();
                            }
                        }
                    };
                    xobj.send(null);
                });

                // Load images.
                load.images.each(function (src, name) {
                    var img = new Image();
                    img.src = src;
                    img.onload = function () {
                        count++;
                        load.images.put(name, img);
                        if (count === asset_count) {
                            callback();
                        }
                    };
                });
            }

            return load;
        }
    }

    return Load;
}());
Utility.Game = (function () {

    "use strict";

    return {

        /**
         * Current active state.
         *
         * @type {Object}
         */
        state: null,

        /**
         * Game states
         *
         * @type {Utility.Collection}
         */
        states: new Utility.Collection(),

        /**
         * Canvas object
         *
         * @type {Utility.Canvas}
         */
        canvas: new Utility.Canvas(),

        /**
         * Load object
         *
         * @type {Utility.Load}
         */
        load: new Utility.Load(),

        /**
         * Keyboard object.
         *
         * @type {Utility.Keyboard}
         */
        keyboard: new Utility.Keyboard(),

        /**
         * Add state
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {int}    state_id
         * @param  {object} state
         */
        addState: function (state_id, state) {
            this.states.put(state_id, state);
            return this;
        },

        /**
         * Set active state
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         *
         * @param  {int} state_id
         */
        setState: function (state_id) {
            this.state = this.states.get(state_id);
            return this;
        },

        /**
         * Run the game
         *
         * @author Blaž Pečnik <blaz@easistent.com>
         */
        run: function (state) {
            var game = this;

            if (state !== undefined && game.states.isEmpty()) {
                game.state = state;
                game.states.add(state);
            }

            if (game.state === null) {
                console.error('Set the inital game state. Use Utility.Game.setState() before calling Utility.Game.run().');
                return 0;
            }

            // Input event listeners...
            Utility.Keyboard.start();

            // Preload assets...
            game.states.each(function (state) {
                if (state.preload) {
                    state.preload(game);
                }
            });

            // Initialize states and run the game...
            game.load.onDone(function () {

                game.states.each(function (state) {
                    if (state.onready) {
                        state.onready(game);
                    }
                });

                var prev_time = 0;
                var delta_time = 0;

                var tick = function (elapsed_time) {
                    delta_time = elapsed_time - prev_time;
                    game.keyboard.update();
                    game.state.update(delta_time, game);
                    game.state.render(game.canvas);
                    prev_time = elapsed_time;

                    requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
            });
        },
    };
}());