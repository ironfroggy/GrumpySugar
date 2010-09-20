TEST_MAP = {
    'start': {
        width: 5
        ,height: 5
        ,objects: {
            '5:1': 'door,second:1:2'
            ,'3:0': 'decor,src:painting.png'
        }
    }
    ,'second': {
        width: 15
        ,height: 5
        ,objects: {
            '0:2': 'door,start:4:1',
            '6:2': 'wall,r',
            '6:3': 'wall',
            '7:2': 'wall,r',
            '7:3': 'wall',
            '8:2': 'wall,r',
            '8:3': 'door,basement:1:1',
            '9:2': 'wall,r',
            '9:3': 'wall',
            '3:0': 'decor,src:painting.png',
            '7:0': 'decor,src:painting.png',
            '11:0': 'decor,src:painting.png',
            '1:0': 'decor,src:candlestand.png:0:10',
            '14:0': 'decor,src:candlestand.png:0:10',
            '1:4': 'decor,src:candlestand.png',
            '14:4': 'decor,src:candlestand.png',
            '7:4': 'decor,src:candlestand.png:0:-20',
            '9:4': 'decor,src:candlestand.png:0:-20',
        }
    }
    ,'basement': {
        width: 6
        ,height: 6
        ,objects: {
            '1:0': 'door,second:8:4'
            ,'3:4': 'treasure'
            ,'2:2': 'wall,r'
            ,'3:2': 'wall,r'
            ,'4:2': 'wall,r'
            ,'3:3': 'wall'
            ,'2:3': 'wall,r'
            ,'4:3': 'wall,r'
            ,'2:4': 'wall'
            ,'4:4': 'wall'
            ,'2:5': 'decor,src:candlestand.png:0:-20'
            ,'4:5': 'decor,src:candlestand.png:0:-20'
        }
    }
}
