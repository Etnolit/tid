import { processCommandString } from '../src/background/command' 

describe('processCommandString', () => {
    test('is returning default value', () => {
        expect(processCommandString('')).toBe(300)
    })

    // test('is throwing error for invalid input', () => {
    //     expect(processCommandString('asdf')).toThrow();
    // })

    describe('relatve time', () => {

        test('is supporting seconds', () => {
            expect(processCommandString('10s')).toBe(10)
            expect(processCommandString('100s')).toBe(100)
        })
        
        test('is supporting minutes', () => {
            expect(processCommandString('1m')).toBe(60)
            expect(processCommandString('3m')).toBe(180)
            expect(processCommandString('61m')).toBe(3660)
        })
        
        test('is suppporting hours', () => {
            expect(processCommandString('1h')).toBe(3600)
        })
    })
})
