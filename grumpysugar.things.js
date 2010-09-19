(function(){

    // Wall is a simple thing

    $GS.registerThingType('wall', {
        setup: function(obj_string) {
            var room = this.data('room')
                ,x = this.data('x')
                ,y = this.data('y')
                ;
            room.setWall(x, y, true);
        }
        ,imageURL: function(obj_string) {
            var imageURL = "cottage/" + (obj_string || 't') + '.0.png';
            return imageURL;
        }
    });

    $GS.registerThingType('door', {
        imageURL: function(obj_string) {
            return "cottage/door.0.png";
        }
        ,setup: function(obj_string) {
            var room = this.data('room')
                ,x = this.data('x')
                ,y = this.data('y')
                ,self = this
                ;

            room._triggers[x+':'+y] = function() {
                var obj_params = obj_string.split(':');
                var room_id = obj_params[0]
                    ,x = obj_params[1]
                    ,y = obj_params[2]
                    ;

                $GS.setupScene(room_id, x, y);
            }
        }
    });

    $GS.registerThingType('treasure', {
        imageURL: function(obj_string) {
            return "thing.png";
        }
        ,setup: function(obj_string) {
            var room = this.data('room')
                ,x = this.data('x')
                ,y = this.data('y')
                ,self = this
                ;

            room._triggers[x+':'+y] = function() {
                self.remove();
            };
        }
    });

})();
