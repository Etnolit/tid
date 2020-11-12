//import {processCommandString} from '../background' 

describe('processCommandString', () => {
    test('is returning default value', () => {
        expect(processCommandString('')).toBe(300)
    })
})
