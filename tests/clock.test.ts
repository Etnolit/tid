import { DOMBar, DOMClock } from '../src/content/ui'

const timestamp = 1616758284343


describe('Clock object', () => {
    let clock: DOMClock

    beforeEach(() => {
        document.body.innerHTML = '<div id="container" class="container"></div>'
    
        clock = new DOMClock(timestamp)
        document.getElementById('container')?.appendChild(clock.render())
    })

    test('to have digits with ids `digit0`, `digit1`, ...', () => {
        expect(document.getElementById('digit0')).toBeTruthy()
        expect(document.getElementById('digit1')).toBeTruthy()
        expect(document.getElementById('digit2')).toBeTruthy()
        expect(document.getElementById('digit3')).toBeTruthy()
        expect(document.getElementById('digit4')).toBeTruthy()
        expect(document.getElementById('digit5')).toBeTruthy()
    })

    test('to have digits with className `digit`', () => {
        expect(document.getElementsByClassName('digit')).toHaveLength(6)
    })

    test.each([
        [1234 * 60 * 1000, ['0', '0', '4', '3', '2', '1']],
        [  56 * 60 * 1000, ['0', '0', '6', '5',  '',  '']],
        [       47 * 1000, ['7', '4', '0', '0',  '',  '']]
    ])('should be able to set its digits', (delta: number, digits: Array<string>) => {
        const now = timestamp - delta
        clock.update(now)

        expect(document.getElementById('digit0')?.innerText).toEqual(digits[0])
        expect(document.getElementById('digit1')?.innerText).toEqual(digits[1])
        expect(document.getElementById('digit2')?.innerText).toEqual(digits[2])
        expect(document.getElementById('digit3')?.innerText).toEqual(digits[3])
        expect(document.getElementById('digit4')?.innerText).toEqual(digits[4])
        expect(document.getElementById('digit5')?.innerText).toEqual(digits[5])
    })

})


describe('Bar object', () => {
    let bar: DOMBar

    beforeEach(() => {
        document.body.innerHTML = '<div id="container" class="container"></div>'
    
        bar = new DOMBar(timestamp, 20000)
        document.getElementById('container')?.appendChild(bar.render())
    })

    test('should be able to update position', () => {
        const subject = document.getElementById('inner-bar')

        bar.update(timestamp -10000)

        expect(subject?.style.width).toEqual('50%')
    })
})
