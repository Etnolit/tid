import { browser } from 'webextension-polyfill-ts'

let clock: HTMLElement, digit5: HTMLElement, digit4: HTMLElement, digit3: HTMLElement, digit2: HTMLElement, digit1: HTMLElement, digit0: HTMLElement, bar: HTMLElement
let timerTS = 0
let duration = 0

let timerUpdateClock: number


document.addEventListener('dblclick', () => {
    document.documentElement.requestFullscreen().catch((e) => {
        console.log(e)
    })
})


document.addEventListener('DOMContentLoaded', () => {
    clock = <HTMLElement>document.getElementById('clock')

    digit0 = <HTMLElement>document.querySelector('#digit0')
    digit1 = <HTMLElement>document.querySelector('#digit1')
    digit2 = <HTMLElement>document.querySelector('#digit2')
    digit3 = <HTMLElement>document.querySelector('#digit3')
    digit4 = <HTMLElement>document.querySelector('#digit4')
    digit5 = <HTMLElement>document.querySelector('#digit5')
    
    bar = <HTMLElement>document.getElementById('bar')

    getSetupData()
})


function handleResponse(message: any) {
    timerTS = message.timestamp
    duration = message.duration
    
    updateClock()
    timerUpdateClock = window.setInterval(updateClock, 100)
}

function handleError(reason: any) {
    console.log(`Error: ${reason}`)
}


function getSetupData(): void {
    const sending = browser.runtime.sendMessage({type: 'setup'})
    sending.then(handleResponse, handleError)
}


function updateDigit(digit: HTMLElement, value: number | string): void {
    digit.textContent = value.toString()
}


function updateClock(): void {
    // Calculate time left
    const timeLeft = Math.floor((timerTS - Date.now()) / 1000)

    if (timeLeft < 0) {
        window.clearInterval(timerUpdateClock)

        clock.classList.add('flash')

        // Request notification

    } else {
        // Calculate and update numbers on screen
        const s = timeLeft % 60
        const m = Math.floor(timeLeft / 60)
    
        updateDigit(digit0, s % 10)
        updateDigit(digit1, Math.floor(s / 10))
        updateDigit(digit2, m % 10)
        updateDigit(digit3, Math.floor(m / 10) % 10)
        updateDigit(digit4, m >= 100 ? Math.floor(m / 100) % 10 : '')
        updateDigit(digit5, m >= 1000 ? Math.floor(m / 1000) % 10 : '')

        // Update bar width
        const width:number = timeLeft / (duration / 1000) * 100
        bar.style.width = width + '%'
    }

}


// Time Quotes
// Time is an illusion. Lunchtime doubly so.
// Don't Panic.
// I love deadlines. I love the whooshing noise they make as they go by.
// Nothing travels faster than the speed of light, with the possible exception of bad news, which obeys its own special laws.

export {}