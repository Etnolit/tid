import { DOMBar, DOMClock } from '../src/content/ui'


describe('Clock object', () => {
    test('to be initialized', () => {
        const subject = new DOMClock()

        expect(subject).toHaveProperty('clock')
        expect(subject).toHaveProperty('digits')
    })

    test('to have 6 digits', () => {
        const subject = new DOMClock()

        expect(subject.digits).toHaveLength(6)
    })

    test('to have digits with ids `digit0`, `digit1`, ...', () => {
        const subject = new DOMClock()

        expect(subject.digits[0].id).toBe('digit0')
        expect(subject.digits[1].id).toBe('digit1')
        expect(subject.digits[2].id).toBe('digit2')
        expect(subject.digits[3].id).toBe('digit3')
        expect(subject.digits[4].id).toBe('digit4')
        expect(subject.digits[5].id).toBe('digit5')
    })

    test('to have digits with className `digit`', () => {
        const clock = new DOMClock()

        expect(clock.digits[0].className).toBe('digit')
        expect(clock.digits[1].className).toBe('digit')
        expect(clock.digits[2].className).toBe('digit')
        expect(clock.digits[3].className).toBe('digit')
        expect(clock.digits[4].className).toBe('digit')
        expect(clock.digits[5].className).toBe('digit')
    })

    test('should be able to set its digits', () => {
        const subject = new DOMClock()

        subject.setDigit(0, 9)
        subject.setDigit(1, 8)
        subject.setDigit(2, 7)
        subject.setDigit(3, 6)
        subject.setDigit(4, 5)
        subject.setDigit(5, 4)

        expect(subject.digits[0].innerText).toEqual('9')
        expect(subject.digits[1].innerText).toEqual('8')
        expect(subject.digits[2].innerText).toEqual('7')
        expect(subject.digits[3].innerText).toEqual('6')
        expect(subject.digits[4].innerText).toEqual('5')
        expect(subject.digits[5].innerText).toEqual('4')
    })

    test('should clear digits for negative values', () => {
        const subject = new DOMClock()

        subject.setDigit(0, -1)
        subject.setDigit(1, -1)
        subject.setDigit(2, -1)
        subject.setDigit(3, -1)
        subject.setDigit(4, -1)
        subject.setDigit(5, -1)

        expect(subject.digits[0].innerText).toEqual('')
        expect(subject.digits[1].innerText).toEqual('')
        expect(subject.digits[2].innerText).toEqual('')
        expect(subject.digits[3].innerText).toEqual('')
        expect(subject.digits[4].innerText).toEqual('')
        expect(subject.digits[5].innerText).toEqual('')
    })
})


describe('Bar object', () => {
    test('to be initialized', () => {
        const subject = new DOMBar()

        expect(subject).toHaveProperty('bar')
    })

    test('should be able to update position', () => {
        const subject = new DOMBar()

        subject.setPosition(64)

        expect(subject.innerBar.style.width).toEqual('64%')
    })
})
