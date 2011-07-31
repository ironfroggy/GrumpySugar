var animations = {};
animations.coin = new $.gameQuery.Animation({imageURL: 'coin.png'});
animations.bomb = new $.gameQuery.Animation({imageURL: 'bomb.png'});


/* EntityMixin is a hash of functions used in different entity types. */
var EntityMixin = {
    move: function(x, y) {
        this.element.css({
            top: function(i, v) { return parseInt(v)+y; },
            left: function(i, v) { return parseInt(v)+x; }
        });
    }
};


function Coin(container, x, y) {
    var self = this;
    this.id = 'coin_' + Coin._count;
    Coin._count += 1;

    $('#'+container)
        .addSprite(this.id, {
            animation: animations.coin
           ,width: 25, height: 25});
    
    this.element = $('#' + this.id);
    this.element
        .addClass('coin')
        .data('caught', true);
    
    this.move(x, y);

    this.element.bind('collide', function(e, player) {
        var t = $(this);
        if (!t.data('caught') && player.data('alive')) {
            t.data('caught', true);

            var score = $('#score').text();
            $('#score').text(parseInt(score) + 1);

            self.flip(true, function(){
                self.element.remove();
            });
        }
    });

    this.flip(false, function(){
        self.element.data('caught', false);
    });
}
Coin._count = 0;
$.extend(Coin.prototype, EntityMixin, {
    flip: function(fade, cb){
        var t = this.element;
        var top = t.position().top;
        var left = t.position().left;
        var width = t.width();
        var jump = 30;
        var fliptime = 500;
        var rate = 30;

        var i = 0;
        $.playground().registerCallback(function(){
            var p = (i * rate) / fliptime;
            var s = Math.sin(p*3.14)

            t.css('background-size', (100-(100*s))+'% 100%');
            t.css('left', left + (width/2)*s);
            t.css('top', top - (jump*s));
            if (fade) {
                t.css('opacity', 1.0 - (p/2));
            }

            i++;
            if (p > 1) {
                if (typeof cb === "function") {
                    cb.call(this);
                }
                return true;
            }
        }, rate);
    }
});


function Bomb(container, x, y) {
    var self = this;
    this.id = 'bomb_' + Bomb._count;
    Bomb._count += 1;

    $('#'+container)
        .addSprite(this.id, {
            animation: animations.bomb
           ,width: 25, height: 25});
    
    var element = this.element = $('#' + this.id);
    this.element.addClass('bomb');
    
    this.move(x, y);

    this.element.bind('collide', function(e, player) {
        if (player.data('alive')) {
            player.data('alive', false);
            $(this).animate({opacity: 0.0}, 200);
            player.animate({opacity: 0.2}, 2000, function(){
                setTimeout(function(){
                    $('#objects .sprite').each(function(){
                        $(this).animate({opacity: 0.0},
                            Math.random()*1000,
                            function() {
                                $(this).remove();

                            });
                    });
                    player.animate({opacity: 1.0}, 2000, function(){
                        $('#score').text('0');
                        player.data('alive', true);
                    });
                }, 5000);
            });
        }
    });

    this.element.collision('#objects,.sprite').each(function(){
        $(this).add(element).animate({opacity: 0.0}, 500,
            function() {
                $(this).remove();
                element.remove();
            });
    });
    if (this.element.collision('#actors,#player').length > 0) {
        $(element).flip(true, function() {
            $(element).remove();
        });
    }
}
Bomb._count = 0;
$.extend(Bomb.prototype, EntityMixin);
