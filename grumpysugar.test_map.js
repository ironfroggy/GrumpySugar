TEST_MAP = {
    'start': {
        width: 5
        ,height: 5
        ,triggers: {
            '5:1': 'second:1:2'
        }
    }
    ,'second': {
        width: 15
        ,height: 5
        ,triggers: {
            '0:2': 'start:4:1',
            '8:3': 'basement:1:1'
        }
        ,objects: {
            '6:2': 'wall,r',
            '6:3': 'wall',
            '7:2': 'wall,r',
            '7:3': 'wall',
            '8:2': 'wall,r',
            '8:3': 'wall',
            '9:2': 'wall,r',
            '9:3': 'wall',
        }
    }
    ,'basement': {
        width: 6
        ,height: 6
        ,triggers: {
            '1:0': 'second:8:4'
        }
        ,objects: {
            '3:3': 'thing'
        }
    }
}
