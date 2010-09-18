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
        ,height: 4
        ,triggers: {
            '0:2': 'start:4:1',
        }
        ,objects: {
            '6:2': 'wall',
            '8:2': 'wall',
            '10:2': 'wall',
        }
    }
}
