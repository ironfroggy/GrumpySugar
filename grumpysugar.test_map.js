TEST_MAP = {
    'start': {
        width: 5
        ,height: 5
        ,objects: {
            '5:1': 'door,second:1:2'
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
        }
    }
    ,'basement': {
        width: 6
        ,height: 6
        ,objects: {
            '3:3': 'treasure',
            '1:0': 'door,second:8:4'
        }
    }
}
