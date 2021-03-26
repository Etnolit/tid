import { browser } from 'webextension-polyfill-ts'
export class DOMClock {
    private clock: HTMLElement
    private digits: HTMLElement[]

    private timer: number
    private end: number
    
    constructor(timestamp: number) {
        this.end = timestamp
        
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
        this.timer = window.setInterval(() => this.update(), 100)

        this.update()
    }

    public update(now?: number): void {
        if (!now) now = Date.now()
        const timeLeft = Math.floor((this.end - now) / 1000)
    
        if (timeLeft < 0) {
            this.flash()
    
            // Request notification
            const sending = browser.runtime.sendMessage({type: 'notify'})
    
//            const handleResponse = (message?: any) => console.log(message)
            const handleError = (reason: any) => console.log(reason)
    
            sending.catch(handleError)

            window.clearInterval(this.timer)
        } else {
            // Calculate and update numbers on screen
            const s = timeLeft % 60
            const m = Math.floor(timeLeft / 60)
        
    
            this.setDigit(0, s % 10)
            this.setDigit(1, Math.floor(s / 10))
            this.setDigit(2, m % 10)
            this.setDigit(3, Math.floor(m / 10) % 10)
            this.setDigit(4, m >= 100 ? Math.floor(m / 100) % 10 : -1)
            this.setDigit(5, m >= 1000 ? Math.floor(m / 1000) % 10 : -1)
        }
    
    }

    private setDigit(index: number, value: number): void {
        if (value >= 0) {
            this.digits[index].innerText = value.toString()
        } else {
            this.digits[index].innerText = ''
        }
    }

    public render(): HTMLElement {
        return this.clock
    }

    private flash(): void {
        this.clock.classList.add('flash')
    }
}


export class DOMBar {
    private bar: HTMLElement
    private innerBar: HTMLElement

    private timer: number
    private end: number
    private duration: number

    constructor(timestamp: number, duration: number) {
        this.end = timestamp
        this.duration = duration

        const bar = document.createElement('div')
        bar.id = 'bar'

        const innerBar = document.createElement('div')
        innerBar.id = 'inner-bar'

        bar.appendChild(innerBar)

        this.bar = bar
        this.innerBar = innerBar

        this.timer = window.setInterval(() => this.update(Date.now()), 100)
    }

    public update(now: number): void {
        const timeLeft = Math.floor((this.end - now) / 1000)

        this.setPosition(timeLeft / (this.duration / 1000) * 100)
    }

    private setPosition(position: number): void {
        this.innerBar.style.width = `${position}%`
    }

    public render(): HTMLElement {
        return this.bar
    }
}
