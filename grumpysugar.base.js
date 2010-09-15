$GS = {
     GAME_HEIGHT: 400
    ,GAME_WIDTH: 600
};

$.extend($GS, {
     default_tile_selector: function() {
        return ;
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
        this.x = 0;
        this.y = 0;
    };

    var directions_to_offset = {
        l: {x: -1}
        ,r: {x: 1}
        ,u: {y: -1}
        ,d: {y: 1}
    };
    $.extend($GS.Sprite.prototype, {
         step: function(direction, done) {
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
            var tries = 10;
            function oneStep() {
                if (tries < 0) {
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
            }
            oneStep();
        }
        ,_stop: function() {
            this.element.clearQueue();
        }
        ,_update_position: function(done) {
            this.element.animate({
                 top: 32 * this.y
                ,left: 32 * this.x
            }, 500, 'linear', (done||function(){}));
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

    var test_room = new $GS.Room({
         floor_tile: default_floor_tile
        ,width_tiles: 10
        ,height_tiles: 10
    });

    sprite = test_room.addSprite({
         animation: new $.gameQuery.Animation({imageURL: "hero.png"})
        ,name: 'test_sprite'
        ,group: 'actor'
    });

    $.playground().startGame();
});
