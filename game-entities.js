

var animations = {};
animations.coin = new $.gameQuery.Animation({imageURL: 'coin.png'});
animations.bomb = new $.gameQuery.Animation({imageURL: 'bomb.png'});

function Coin(container, x, y) {
    this.id = 'coin_' + Coin._count;
    Coin._count += 1;

    $('#'+container)
        .addSprite(this.id, {
            animation: animations.coin
           ,width: 25, height: 25});
    
    this.element = $('#' + this.id);
    
    this.move(x, y);

    this.element.bind('collide', function(e, player) {
        var t = $(this);
        if (!t.data('caught') && player.data('alive')) {
            t.data('caught', true);

            var score = $('#score').text();
            $('#score').text(parseInt(score) + 1);
            t.animate({opacity: 0.0}, 500, function(){
                t.remove();
            });
        }
    });
}
Coin._count = 0;


Coin.prototype.move = function Coin_move(x, y) {
    this.element.css({
        top: function(i, v) { return parseInt(v)+y; },
        left: function(i, v) { return parseInt(v)+x; }
    });
};



function Bomb(container, x, y) {
    this.id = 'bomb_' + Bomb._count;
    Bomb._count += 1;

    $('#'+container)
        .addSprite(this.id, {
            animation: animations.bomb
           ,width: 25, height: 25});
    
    this.element = $('#' + this.id);
    
    this.move(x, y);

    this.element.bind('collide', function(e, player) {
        if (player.data('alive')) {
            player.data('alive', false);
            $(this).animate({opacity: 0.0}, 200);
            player.animate({opacity: 0.2}, 2000, function(){
                setTimeout(function(){
                    $('#objects .sprite').remove();
                    player.animate({opacity: 1.0}, 2000, function(){
                        $('#score').text('0');
                        player.data('alive', true);
                    });
                }, 5000);
            });
        }
    });
}
Bomb._count = 0;
Bomb.prototype.move = Coin.prototype.move;
