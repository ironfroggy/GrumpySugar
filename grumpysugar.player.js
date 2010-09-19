(function(){

    var sprite_counter = 0;
    function get_sprite_id() {
        var id = sprite_counter;
        sprite_counter++;
        return 'gs-sprite-' + id;
    }

    $GS.Sprite = function Sprite(options) {
        var self = this;
        this.room = options.room;
        this._group = options.group;
        this._animation = options.animation;
        this.x = this.to_x = parseInt(options.x || 1);
        this.y = this.to_y = parseInt(options.y || 1);

        this.attach(this.room, this.x, this.y);
    };

    var directions_to_offset = {
        l: {x: -1}
        ,r: {x: 1}
        ,u: {y: -1}
        ,d: {y: 1}
    };
    $.extend($GS.Sprite.prototype, {
         attach: function(room, x, y) {
            var self = this;

            this.element_id = get_sprite_id();
            $('#gs-' + this._group || 'things')
                .addSprite(this.element_id, {animation: this._animation,
                    width: 32, height: 32});

            this.element = $('#' + this.element_id);

            this.room = room;
            this.x = parseInt(x);
            this.y = parseInt(y);

            this.to_x = this.x;
            this.to_y = this.y;
            this._set_position();
            $.playground().bind('tick', function(){
                self.tick();
            });
         }

        ,step: function(direction) {
            // Move one step in a specified direction: l r u d
            var x, y;
            x = parseInt(directions_to_offset[direction].x || 0);
            y = parseInt(directions_to_offset[direction].y || 0);

            x = Math.min(Math.max(0, this.x+x), this.room.width);
            y = Math.min(Math.max(0, this.y+y), this.room.height);

            
            var moved = false;
            if (!this.room.checkForWall(x, y)) {
                this.x = x;
                this.y = y;
                moved = true;
            }

            this._update_position();

            return moved;
        }
        ,position: function() {
            return {x: this.x, y: this.y};
        }
        ,walkTo: function(x, y) {
            var self = this;
            this._movement_tries = this.room.width + this.room.height;
            this.to_x = x;
            this.to_y = y;
        }
        ,tick: function () {
            var self = this;

            if (!this._moving) {
                if (this._movement_tries <= 1) {
                    return;
                } else {
                    this._movement_tries--;
                }
                
                var x = this.to_x,
                    y = this.to_y;

                // If the player needs to move, move them
                // Otherwise, check this position for triggers ONCE

                if (x > self.x) {
                    if (self.step('r')) {
                        return;
                    }
                }
                if (x < self.x) {
                    if (self.step('l')) {
                        return;
                    }
                }
                if (y > self.y) {
                    if (self.step('d')) {
                        return;
                    }
                }
                if (y < self.y) {
                    if (self.step('u')) {
                        return;
                    }
                }    
            }
        }
        ,_stop: function() {
            this.to_x = this.x;
            this.to_y = this.y;
        }
        ,_set_position: function() {
            this.element.css({
                top: 32 * this.y
                ,left: 32 * this.x
            });
        }
        ,_update_position: function() {
            var self = this;
            this._moving = true;
            this.element.animate({
                 top: 32 * this.y
                ,left: 32 * this.x
            }, TICK_LENGTH, 'linear', function(){
                // Check triggers before making another step
                self._moving = false;
                if (self._triggers_unchecked()) {
                    var stopped = self._check_triggers();
                    if (stopped) {
                        self._stop();
                    }
                }
            });
        }
        ,_triggers_unchecked: function() {
            return (this.x != this._last_trigger_x || this.y != this._last_trigger_y);
        }
        ,_check_triggers: function() {
            var x = this.x, y = this.y;
            var trigger = this.room._triggers[[x,y].join(':')];
            this._last_trigger_x = x;
            this._last_trigger_y = y;
            if (trigger) {
                return trigger(this);
            }
        }
    });

})();
