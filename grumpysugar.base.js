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
        .addTilemap('gs-background', $GS.default_tile_selector, options.floor_tile, tile_options).end()
        .addGroup('gs-wall', group_options).end()
        .addGroup('gs-thing', group_options).end()
        .addGroup('gs-trigger', group_options).end()
        .addGroup('gs-actor', group_options).end()
        ;
};
$.extend($GS.Room.prototype, {
     addSprite: function(options) {
        $('#gs-' + options.group || 'things')
            .addSprite(options.name, {animation: options.animation,
                width: 32, height: 32});
     }
    ,
});


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

    test_room.addSprite({
         animation: new $.gameQuery.Animation({imageURL: "hero.png"})
        ,name: 'test_sprite'
        ,group: 'actor'
    });

    $.playground().startGame();
});
