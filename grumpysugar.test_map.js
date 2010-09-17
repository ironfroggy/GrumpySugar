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
            '0:2': 'start:4:2',
        }
    }
}
