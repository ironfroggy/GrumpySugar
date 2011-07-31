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

            room._triggers[x+':'+y] = function(sprite) {
                var obj_params = obj_string.split(':');
                var room_id = obj_params[0]
                    ,x = obj_params[1]
                    ,y = obj_params[2]
                    ;

                $GS.setupScene(room_id, x, y);
                return true;
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

            room._triggers[x+':'+y] = function(sprite) {
                sprite.addItem('treasure');
                self.remove();
            };
        }
    });

    $GS.registerThingType('decor', {
        imageURL: function(obj_string) {
            var parts = obj_string.split(':')
                ,decor_type = parts[0]
                ,src = parts[1]
                ,offset = parts[2]
                ,remain = obj_string.slice(decor_type.length+1, obj_string.length)
                ;

            if (decor_type == 'src') {
                return src;
            }
        }
        ,setup: function(obj_string) {
            var parts = obj_string.split(':')
                ,decor_type = parts[0]
                ,src = parts[1]
                ,offset_x = parts[2]
                ,offset_y = parts[3]
                ,remain = obj_string.slice(decor_type.length+1, obj_string.length)
                ;

            if (offset_x) {
                offset_y = parseInt(offset_y||0);
                offset_x = parseInt(offset_x||0);

                console.debug($(this).position().top, offset_y);
                $(this).css({
                    top: (offset_y > 0 ? "+=" : "-=") + Math.abs(offset_y),
                    left: (offset_x > 0 ? "+=" : "-=") + Math.abs(offset_x)
                });
                console.debug($(this).position().top);
            }
        }
    });

})();
