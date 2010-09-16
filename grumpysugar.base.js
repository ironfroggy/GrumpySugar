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


$GS.Room = function Room(options) {
    var p = $.playground();

    // Remove any existing room
    $('#playground #gs-room').remove();

    // Create the new room
    var group_options = {width: $GS.GAME_WIDTH, height: $GS.GAME_HEIGHT};
    var tile_options = {height: 32, width: 32, sizex: options.width_tiles, sizey: options.height_tiles};

    p.addGroup('gs-room')
        .addTilemap('gs-background', $GS.default_tile_selector, options.floor_tile, tile_options)
            .click(function(e) {
                console.log(e);
            })
            .end()
        .addGroup('gs-wall', group_options).end()
        .addGroup('gs-thing', group_options).end()
        .addGroup('gs-trigger', group_options).end()
        .addGroup('gs-actor', group_options).end()
        ;
    p.click(function(e){
        var tile_x = parseInt(e.offsetX / 32);
        var tile_y = parseInt(e.offsetY / 32);
        sprite.walkTo(tile_x, tile_y);
    });

    this.width = options.width_tiles;
    this.height = options.height_tiles;
    this._triggers = options.triggers || {};

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
    });

    $GS.Sprite = function Sprite(options) {
        this.room = options.room;
        this.element_id = get_sprite_id();
        $('#gs-' + options.group || 'things')
            .addSprite(this.element_id, {animation: options.animation,
                width: 32, height: 32});
        this.element = $('#' + this.element_id);
        this.x = options.x || 0;
        this.y = options.y || 0;
        this._update_position();
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
            x = directions_to_offset[direction].x || 0;
            y = directions_to_offset[direction].y || 0;

            this.x = Math.max(0, this.x+x);
            this.y = Math.max(0, this.y+y);

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
            this.element.clearQueue();
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
            console.log("checking for trigger at ", x, y);
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

    function setupScene(name) {
        var room_details = TEST_MAP[name];
        var room = new $GS.Room({
             floor_tile: default_floor_tile
            ,width_tiles: room_details.width
            ,height_tiles: room_details.height
            ,triggers: room_details.triggers
        });

        return room;
    }
    var room = setupScene('start');
    sprite = room.addSprite({
         animation: new $.gameQuery.Animation({imageURL: "hero.png"})
        ,name: 'test_sprite'
        ,group: 'actor'
    });

    $.playground().startGame();

    window.setupScene = setupScene;
});
