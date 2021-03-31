import { ParseError } from '@src/background/errors'
import { Parser } from '../src/background/parser'

const NOW = 1613651325374 // 2021-02-18T12:28:45.374Z  <-- UTC!

describe('Parser', () => {
    test('evaluates single integer', () => {
        const tokens = [{ value: '13', type: 'number' }]

        expect(Parser(tokens)).toEqual(13)
    })

    test('evaluates addition of integers', () => {
        const tokens = [
            { value: '21', type: 'number' },
            { value: '+', type: 'operator' },
            { value: '12', type: 'number' },
        ]

        expect(Parser(tokens)).toEqual(33)
    })

    test('evaluates subtraction of integers', () => {
        const tokens = [
            { value: '21', type: 'number' },
            { value: '-', type: 'operator' },
            { value: '12', type: 'number' },
        ]

        expect(Parser(tokens)).toEqual(9)
    })

    test('evaluate addition with units present', () => {
        const tokens = [
            { value: '5', type: 'number' },
            { value: 'm', type: 'unit' },
            { value: '+', type: 'operator' },
            { value: '30', type: 'number' },
            { value: 's', type: 'unit' },
        ]

        expect(Parser(tokens)).toEqual(330000)
    })

    test('evaluates constant time before midnight', () => {
        const tokens = [{ value: '14:30', type: 'time' }]
        const offset = new Date().getTimezoneOffset()
        const erv = 2 * 3600000 + (1 + offset) * 60000 + 14 * 1000 + 626 // 2h, 1m, 14s, 626ms

        expect(Parser(tokens, NOW)).toBe(erv)
    })

    test('evaluates constant time after midnight', () => {
        const tokens = [{ value: '10:30', type: 'time' }]
        const offset = new Date().getTimezoneOffset()
        const erv = 22 * 3600000 + (1 + offset) * 60000 + 14 * 1000 + 626 // 22h, 1m, 14s, 626ms

        expect(Parser(tokens, NOW)).toBe(erv)
    })

    test('evaluates units', () => {
        expect(
            Parser([
                { value: '3', type: 'number' },
                { value: 'h', type: 'unit' },
            ]),
        ).toBe(3 * 3600000)
        expect(
            Parser([
                { value: '26', type: 'number' },
                { value: 'm', type: 'unit' },
            ]),
        ).toBe(26 * 60000)
        expect(
            Parser([
                { value: '13', type: 'number' },
                { value: 's', type: 'unit' },
            ]),
        ).toBe(13 * 1000)
    })

    test('evaluates % operator', () => {
        const tokens = [
            { value: '%', type: 'operator' },
            { value: '20', type: 'number' },
            { value: 'm', type: 'unit' },
        ]
        const erv = 11 * 60000 + 14 * 1000 + 626 // 11m, 14s, 626ms

        expect(Parser(tokens, NOW)).toBe(erv)
    })

    test('evaluate subtraction with units present', () => {
        const tokens = [
            { value: '5', type: 'number' },
            { value: 'm', type: 'unit' },
            { value: '-', type: 'operator' },
            { value: '30', type: 'number' },
            { value: 's', type: 'unit' },
        ]

        expect(Parser(tokens)).toEqual(270000)
    })

    test('evaluate constant time with addition', () => {
        const tokens = [
            { value: '14:30', type: 'time' },
            { value: '+', type: 'operator' },
            { value: '30', type: 'number' },
            { value: 'm', type: 'unit' },
        ]
        const offset = new Date().getTimezoneOffset()
        const erv = 2 * 3600000 + (1 + offset + 30) * 60000 + 14 * 1000 + 626 // 2h, 31m, 14s, 626ms

        expect(Parser(tokens, NOW)).toBe(erv)
    })

    test('evaluate constant time with addition', () => {
        const tokens = [
            { value: '14:30', type: 'time' },
            { value: '-', type: 'operator' },
            { value: '30', type: 'number' },
            { value: 'm', type: 'unit' },
        ]
        const offset = new Date().getTimezoneOffset()
        const erv = 2 * 3600000 + (1 + offset - 30) * 60000 + 14 * 1000 + 626 // 1h, 31m, 14s, 626ms

        expect(Parser(tokens, NOW)).toBe(erv)
    })

    test('throws error on illegal token combination', () => {
        const tokens = [
            { value: '21', type: 'number' },
            { value: '12', type: 'number' },
        ]

        expect(() => {
            Parser(tokens)
        }).toThrow(ParseError)
    })

    test('throws error with multiple absolute time references', () => {
        const tokens = [
            { value: '10:30', type: 'time' },
            { value: '+', type: 'operator' },
            { value: '12:00', type: 'time' },
        ]

        expect(() => {
            Parser(tokens)
        }).toThrow(ParseError)
    })
})
