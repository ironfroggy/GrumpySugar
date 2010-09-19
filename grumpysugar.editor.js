(function(){

    var current_selection_x, current_selection_y;

    $GS.onClick_reportTriggerInfo = function(e) {
        var x = parseInt(e.offsetX / 32);   
        var y = parseInt(e.offsetY / 32);   

        var trigger = room._triggers[x+':'+y] || '(no triggers)';
        var wall = room.checkForWall(x, y) ? 'wall' : 'floor'; 

        console.log(x, y, wall, trigger);
    };

    $GS.onClick_selectTile = function(e){
        current_selection_x = parseInt(e.offsetX / 32);   
        current_selection_y = parseInt(e.offsetY / 32);   
    };

    $GS.onClick_moveTriggerTo = function(e){
        var x = parseInt(e.offsetX / 32);   
        var y = parseInt(e.offsetY / 32);   

        var from_coords = current_selection_x+':'+current_selection_y;
        var to_coords = x+':'+y;

        room._triggers[to_coords] = room._triggers[from_coords];
        delete room._triggers[from_coords];
    };

})();
