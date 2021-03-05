
export class DOMClock {
    clock: HTMLElement
    digits: HTMLElement[]

    constructor() {
        const clock = document.createElement('div')
        clock.id = 'clock'

        const leftNumbers = document.createElement('div')
        leftNumbers.id = 'left-numbers'

        const separator = document.createElement('div')
        separator.id = 'separator'
        separator.className = 'separator'
        separator.innerHTML = '<span>:</span>'

        const rightNumbers = document.createElement('div')
        rightNumbers.id = 'right-numbers'
        
        clock.appendChild(leftNumbers)
        clock.appendChild(separator)
        clock.appendChild(rightNumbers)

        this.digits = [0, 1, 2, 3, 4, 5].map((i) => {
            const tag = document.createElement('span')
            tag.id = `digit${i}`
            tag.className = 'digit'
            return tag
        })

        leftNumbers.appendChild(this.digits[5])
        leftNumbers.appendChild(this.digits[4])
        leftNumbers.appendChild(this.digits[3])
        leftNumbers.appendChild(this.digits[2])

        rightNumbers.appendChild(this.digits[1])
        rightNumbers.appendChild(this.digits[0])

        this.clock = clock
    }

    public setDigit(index: number, value: number): void {
        if (value >= 0) {
            this.digits[index].innerText = value.toString()
        } else {
            this.digits[index].innerText = ''
        }
    }

    public render(): HTMLElement{
        return this.clock
    }
}


export class DOMBar {
    bar: HTMLElement
    innerBar: HTMLElement

    constructor() {
        const bar = document.createElement('div')
        bar.id = 'bar'

        const innerBar = document.createElement('div')
        innerBar.id = 'inner-bar'

        bar.appendChild(innerBar)

        this.bar = bar
        this.innerBar = innerBar
    }

    public setPosition(position: number): void {
        this.innerBar.style.width = `${position}%`
    }

    public render(): HTMLElement {
        return this.bar
    }
}
