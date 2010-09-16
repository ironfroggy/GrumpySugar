TEST_MAP = {
    'start': {
        width: 5
        ,height: 5
        ,triggers: {
            '4:0': 'second:1:2'
        }
    }
    ,'second': {
        width: 15
        ,height: 4
        ,triggers: {
            '0:0': 'start:3:0',
            '0:1': 'start:3:1',
            '0:2': 'start:3:2',
            '0:3': 'start:3:3',
        }
    }
}
