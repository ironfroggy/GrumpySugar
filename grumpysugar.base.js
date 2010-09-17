$GS = {
     GAME_HEIGHT: 400
    ,GAME_WIDTH: 600
};

$.extend($GS, {
     default_tile_selector: function() {
        return ;
    }
    ,bind: function() {
        var q = $($GS);
        q.bind.apply(q, arguments);
    }
    ,trigger: function() {
        var q = $($GS);
        q.trigger.apply(q, arguments);
    }
});


$GS.Room = function Room(details) {
    var p = $.playground();

    // Remove any existing room
    $('#playground #gs-room').remove();

    // Create the new room
    var group_options = {width: $GS.GAME_WIDTH, height: $GS.GAME_HEIGHT};
    var tile_options = {height: 32, width: 32, sizex: details.width - 1, sizey: details.height - 1};

    this._load_tileset(details.tileset);

    p.addGroup('gs-room')
        .addTilemap('gs-background', $GS.default_tile_selector, this.tileset.floor, tile_options)
            .css({top: 32, left: 32})
            .end()
        .addGroup('gs-wall', group_options).end()
        .addGroup('gs-thing', group_options).end()
        .addGroup('gs-trigger', group_options).end()
        .addGroup('gs-actor', group_options).end()
        ;

    this.width = details.width;
    this.height = details.height;
    this._triggers = details.triggers || {};

    this._add_walls();

    $GS.trigger("newroom", [this]);
};
(function(){
    var sprite_counter = 0;
    function get_sprite_id() {
        var id = sprite_counter;
        sprite_counter++;
        return 'gs-sprite-' + id;
    }

    $.extend($GS.Room.prototype, {
        addSprite: function(options) {
            var options = $.extend({}, options, {
                room: this
            });
            return new Sprite(options);
        } 
        ,checkForWall: function(x, y) {
            return !!(x==0 || y==0 || x==this.width || y==this.height);
        }
        ,_load_tileset: function(name) {
            var tileset = this.tileset = {};
            $.each("floor t tl l bl b br r tr".split(' '), function(i, piece) {
                tileset[piece] = new $.gameQuery.Animation({imageURL: "cottage/"+piece+".0.png"}); 
            });
        }
        ,_add_walls: function() {
            // Add walls using the room's tileset
            var wall = $.playground().find('#gs-wall')
                ,tileset = this.tileset
                ;
            function add_wall_tile(piece, i, x, y) {
                wall.addSprite('gs-wall-'+piece+i, {animation: tileset[piece], width: 32, height: 32});
                wall.find('#gs-wall-'+piece+i).css({top: y*32, left: x*32});
            }
            add_wall_tile('tl', 0, 0, 0);
            add_wall_tile('tr', 0, this.width, 0);
            add_wall_tile('bl', 0, 0, this.height);
            add_wall_tile('br', 0, this.width, this.height);
            for (var i=0; i<this.width; i++) {
                add_wall_tile('t', i, i+1, 0);
                add_wall_tile('b', i, i+1, this.height);
            }
            for (var i=0; i<this.height; i++) {
                add_wall_tile('l', i, 0, i+1);
                add_wall_tile('r', i, this.width, i+1);
            }
        }
    });

    $GS.Sprite = function Sprite(options) {
        this.room = options.room;
        this.element_id = get_sprite_id();
        $('#gs-' + options.group || 'things')
            .addSprite(this.element_id, {animation: options.animation,
                width: 32, height: 32});
        this.element = $('#' + this.element_id);
        this.x = parseInt(options.x || 1);
        this.y = parseInt(options.y || 1);
        this._set_position();
    };

    var directions_to_offset = {
        l: {x: -1}
        ,r: {x: 1}
        ,u: {y: -1}
        ,d: {y: 1}
    };
    $.extend($GS.Sprite.prototype, {
         step: function(direction, done) {
            // Move one step in a specified direction: l r u d
            this._stop();
            var x, y;
            x = parseInt(directions_to_offset[direction].x || 0);
            y = parseInt(directions_to_offset[direction].y || 0);

            x = Math.min(Math.max(0, this.x+x), this.room.width - 1);
            y = Math.min(Math.max(0, this.y+y), this.room.height - 1);

            if (!this.room.checkForWall(x, y)) {
                this.x = x;
                this.y = y;
            }

            this._update_position(done);
        }
        ,position: function() {
            return {x: this.x, y: this.y};
        }
        ,walkTo: function(x, y) {
            var self = this;
            var tries = this.room.width + this.room.height;

            function oneStep() {
                self._stop();
                self._walking = true;
                if (tries <= 1) {
                    self._walking = false;
                    return;
                } else {
                    tries--;
                }

                if (x > self.x) {
                    self.step('r', oneStep);
                } else if (x < self.x) {
                    self.step('l', oneStep);
                } else if (y > self.y) {
                    self.step('d', oneStep);
                } else if (y < self.y) {
                    self.step('u', oneStep);
                }

                self._walking = false;
            }
            this._afterStep(oneStep);
        }
        ,_afterStep: function(cb) {
            if (cb) {
                if (this._walking) {
                    this._after_walking = cb;
                } else {
                    cb.call(this)
                }
            } else {
                if (typeof this._after_walking === "function") {
                    cb = this._after_walking;
                    this._after_walking = null;
                    cb.call(this);
                }
            }
        }
        ,_stop: function() {
            this._after_walking = null;
            this.element.clearQueue();
        }
        ,_set_position: function() {
            this.element.css({
                top: 32 * this.y
                ,left: 32 * this.x
            });
        }
        ,_update_position: function(done) {
            var self = this;
            this._afterStep(done);
            this.element.animate({
                 top: 32 * this.y
                ,left: 32 * this.x
            }, 500, 'linear', function(){
                // Check triggers before making another step
                var stopped = self._check_triggers();
                if (!stopped) {
                    self._afterStep();
                }
            });
        }
        ,_check_triggers: function() {
            var x = this.x, y = this.y;
            var trigger = this.room._triggers[[x,y].join(':')];
            if (trigger) {
                trigger = trigger.split(':');
                var  room_id = trigger[0]
                    ,target_x = trigger[1]
                    ,target_y = trigger[2]
                    ;

                    var room = setupScene(room_id);
                    sprite = room.addSprite({
                         animation: new $.gameQuery.Animation({imageURL: "hero.png"})
                        ,name: 'test_sprite'
                        ,group: 'actor'
                        ,x: target_x, y: target_y
                    });
            }
        }
    });

})();

$.each("Room Sprite".split(' '), function(i, name) {
    if (typeof window[name] === "undefined") {
        window[name] = $GS[name];
    }
});


var sprite;
$(document).ready(function(){
    var playground = $('#playground').playground({
        height: $GS.GAME_HEIGHT, width: $GS.GAME_WIDTH
    });


    var default_floor_tile = new $.gameQuery.Animation({imageURL: "default_tile.0.png"});

    var tileset = {};
    $.each('t tr r br b bl l tl'.split(' '), function(i, side) {
        tileset[side] = new $.gameQuery.Animation({imageURL: "stock_cottage/"+side+".0.png"});
    });

    function setupScene(name) {
        var room_details = TEST_MAP[name];
        var room = new $GS.Room(room_details);

        return room;
    }
    var room = setupScene('start');
    sprite = room.addSprite({
         animation: new $.gameQuery.Animation({imageURL: "hero.png"})
        ,name: 'test_sprite'
        ,group: 'actor'
    });

    $.playground().click(function(e){
        var tile_x = parseInt(e.offsetX / 32);
        var tile_y = parseInt(e.offsetY / 32);
        sprite.walkTo(tile_x, tile_y);
    });

    $.playground().startGame();

    window.setupScene = setupScene;
});
