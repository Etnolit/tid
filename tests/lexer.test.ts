import { Lexer, Tokenizer } from '../src/background/parser'
import { TokenError } from '../src/background/errors'

describe('Lexer and Tokenizer', () => {
    test('is handling empty command', () => {
        expect(Lexer('', Tokenizer)).toEqual([])
    })

    test('recognizes single number', () => {
        expect(Lexer('1', Tokenizer)).toEqual([{ value: '1', type: 'number' }])
        expect(Lexer('3', Tokenizer)).toEqual([{ value: '3', type: 'number' }])
        expect(Lexer('37', Tokenizer)).toEqual([{ value: '37', type: 'number' }])
        expect(Lexer('3', Tokenizer)).toEqual([{ value: '3', type: 'number' }])
        expect(Lexer('0', Tokenizer)).toEqual([{ value: '0', type: 'number' }])
    })

    test('recognizes time value', () => {
        expect(Lexer('12:00', Tokenizer)).toEqual([{ value: '12:00', type: 'time' }])
        expect(Lexer('02:35', Tokenizer)).toEqual([{ value: '02:35', type: 'time' }])
    })

    test('recognizes units (h, m and s)', () => {
        expect(Lexer('h', Tokenizer)).toEqual([{ value: 'h', type: 'unit' }])
        expect(Lexer('m', Tokenizer)).toEqual([{ value: 'm', type: 'unit' }])
        expect(Lexer('s', Tokenizer)).toEqual([{ value: 's', type: 'unit' }])
    })

    test('recognizes operators (+, - and %)', () => {
        expect(Lexer('+', Tokenizer)).toEqual([{ value: '+', type: 'operator' }])
        expect(Lexer('-', Tokenizer)).toEqual([{ value: '-', type: 'operator' }])
        expect(Lexer('%', Tokenizer)).toEqual([{ value: '%', type: 'operator' }])
    })

    test('recognizes whitespace', () => {
        expect(Lexer(' ', Tokenizer)).toEqual([{ value: ' ', type: 'whitespace' }])
        expect(Lexer('     ', Tokenizer)).toEqual([{ value: '     ', type: 'whitespace' }])
    })

    test('recognizes extra whitespace', () => {
        expect(Lexer('  1', Tokenizer)).toEqual([
            { value: '  ', type: 'whitespace' },
            { value: '1', type: 'number' },
        ])
        expect(Lexer('1 ', Tokenizer)).toEqual([
            { value: '1', type: 'number' },
            { value: ' ', type: 'whitespace' },
        ])
        expect(Lexer(' 1  ', Tokenizer)).toEqual([
            { value: ' ', type: 'whitespace' },
            { value: '1', type: 'number' },
            { value: '  ', type: 'whitespace' },
        ])
    })

    test('recognizes operator and number', () => {
        expect(Lexer('%20', Tokenizer)).toEqual([
            { value: '%', type: 'operator' },
            { value: '20', type: 'number' },
        ])
    })

    test('recognizes number with unit', () => {
        expect(Lexer('20m', Tokenizer)).toEqual([
            { value: '20', type: 'number' },
            { value: 'm', type: 'unit' },
        ])
        expect(Lexer('1h', Tokenizer)).toEqual([
            { value: '1', type: 'number' },
            { value: 'h', type: 'unit' },
        ])
    })

    test('regonizes multiple tokens', () => {
        expect(Lexer('1+7', Tokenizer)).toEqual([
            { value: '1', type: 'number' },
            { value: '+', type: 'operator' },
            { value: '7', type: 'number' },
        ])
        expect(Lexer('1 + 7', Tokenizer)).toEqual([
            { value: '1', type: 'number' },
            { value: ' ', type: 'whitespace' },
            { value: '+', type: 'operator' },
            { value: ' ', type: 'whitespace' },
            { value: '7', type: 'number' },
        ])
        expect(Lexer('12:25+ 15', Tokenizer)).toEqual([
            { value: '12:25', type: 'time' },
            { value: '+', type: 'operator' },
            { value: ' ', type: 'whitespace' },
            { value: '15', type: 'number' },
        ])
    })

    test('throws error on invalid input', () => {
        expect(() => {
            Lexer(':20', Tokenizer)
        }).toThrow(TokenError)
    })
})
