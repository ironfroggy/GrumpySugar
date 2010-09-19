var TICK_LENGTH = 200;

$GS = {
     GAME_HEIGHT: 400
    ,GAME_WIDTH: 600

    ,player: null
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
    ,setupScene: function(name, target_x, target_y) {
        var room_details = TEST_MAP[name];
        var room = new $GS.Room(room_details);

        if ($GS.player === null) {
            $GS.player = new $GS.Sprite({
                 animation: new $.gameQuery.Animation({imageURL: "hero.png"})
                ,name: 'test_sprite'
                ,group: 'actor'
                ,x: target_x, y: target_y
                ,room: room
            });
        } else {
            $GS.player.attach(room, target_x, target_y);
        }
    }
});

(function(){
    // Here we want to allow registration of different kinds of "things"
    // Each "thing" appears on a tile defined by the objects property of the room
    // description. The first part of the object string is the type and these are
    // registered here. Currently planned types are 'wall', 'decor', and 'item'
    // Each thing is registered so that it can setup an instance of this kind of
    // thing when the room is created. For example, the 'wall' type will modify
    // the wall map so the player can't run into it. The 'decor' type will grab
    // a sprite code from the object string and create the correct animation.
    // The 'item' type will attach an event handler so it knows when the user
    // gets to it, at which point it will remove the item from the room and add it
    // to the users inventory. Standard thing types are defined in grumpysugar.things.js

    var thing_types = {};

    $GS.registerThingType = function(type_code, handler) {
        thing_types[type_code] = handler; 
    };
    
    // This is called in context of the sprite created, after the pre-initialization
    // Sprites are given the following data attributes:
    //
    // room:    The room the sprite is created in
    // x:
    // y:
    $GS.setupThing = function(type_code, obj_string) {
        (thing_types[type_code].setup || function(){}).call(this, obj_string);
    };
    $GS.getThingImageURL = function(type_code, obj_string) {
        return thing_types[type_code].imageURL.call(this, obj_string);
    };

})();

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
    this._objects = details.objects || {};
    this._walls = {};

    this._add_walls();

    $GS.trigger("newroom", [this]);
};
(function(){

    $.extend($GS.Room.prototype, {
        addSprite: function(options) {
            var options = $.extend({}, options, {
                room: this
            });
            return new $GS.Sprite(options);
        } 
        ,checkForWall: function(x, y) {
            return !!this._walls[x+':'+y];
        }
        ,setWall: function(x, y, wall) {
            this._walls[x+':'+y] = wall;
        }
        ,_load_tileset: function(name) {
            var tileset = this.tileset = {};
            $.each("door floor t tl l bl b br r tr".split(' '), function(i, piece) {
                tileset[piece] = new $.gameQuery.Animation({imageURL: "cottage/"+piece+".0.png"}); 
            });
        }
        ,_add_walls: function() {
            // Add walls using the room's tileset
            var wall = $.playground().find('#gs-wall')
                objects = $.playground().find('#gs-thing')
                ,tileset = this.tileset
                ,triggers = this._triggers
                ,walls = this._walls;
                ;
            function add_wall_tile(piece, i, x, y) {
                var animation = tileset[(triggers[x+':'+y]) ? 'door' : piece];
                wall.addSprite('gs-wall-'+piece+i, {animation: animation, width: 32, height: 32});
                wall.find('#gs-wall-'+piece+i).css({top: y*32, left: x*32});
                walls[x+':'+y] = true;
            }
            add_wall_tile('tl', 0, 0, 0);
            add_wall_tile('tr', 0, this.width, 0);
            add_wall_tile('bl', 0, 0, this.height);
            add_wall_tile('br', 0, this.width, this.height);
            for (var i=0; i<this.width-1; i++) {
                add_wall_tile('t', i, i+1, 0);
                add_wall_tile('b', i, i+1, this.height);
            }
            for (var i=0; i<this.height-1; i++) {
                add_wall_tile('l', i, 0, i+1);
                add_wall_tile('r', i, this.width, i+1);
            }

            var i = this.width*this.height;
            var things = $.playground().find('#gs-thing');
            for (coord in this._objects) {
                var x = coord.split(':')[0];
                var y = coord.split(':')[1];
                var type = this._objects[coord].split(',')[0];
                var tile = this._objects[coord].split(',')[1];
                var obj_string = this._objects[coord].slice(type.length + 1, this._objects[coord].length);

                i++;

                things.addSprite('gs-thing-'+i, {
                    animation: new $.gameQuery.Animation({imageURL: $GS.getThingImageURL(type, obj_string)})
                    ,width: 32, height: 32});
                var thing = things.find('#gs-thing-'+i).css({top: y*32, left: x*32});
                thing
                    .data('room', this)
                    .data('x', x)
                    .data('y', y)
                    .data('thing_type', type)
                    ;
                $GS.setupThing.call(thing, type, obj_string);

            }
            for (coord in this._triggers) {
                walls[coord] = false;
            }
        }
    });

})();


var room;
$(document).ready(function(){
    var playground = $('#playground').playground({
        height: $GS.GAME_HEIGHT, width: $GS.GAME_WIDTH
    });


    var default_floor_tile = new $.gameQuery.Animation({imageURL: "default_tile.0.png"});

    var tileset = {};
    $.each('t tr r br b bl l tl'.split(' '), function(i, side) {
        tileset[side] = new $.gameQuery.Animation({imageURL: "stock_cottage/"+side+".0.png"});
    });

    $GS.setupScene('start', 1, 1);

    (function(){
        var click_callback = null;

        $.playground().click(function(e){
            if (typeof click_callback === "function") {
                click_callback(e);
                click_callback = null;
            } else {
                var tile_x = parseInt(e.offsetX / 32);
                var tile_y = parseInt(e.offsetY / 32);
                $GS.player.walkTo(tile_x, tile_y);
            }
        });

        $GS.onNextClick = function(callback) {
            click_callback = callback;
        };
    })();

    setInterval(function(){
        $.playground().trigger('tick');
    }, TICK_LENGTH);

    $.playground().startGame().css('position', 'relative');
});
