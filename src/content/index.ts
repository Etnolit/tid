import { browser } from 'webextension-polyfill-ts'
import { DOMBar, DOMClock } from './ui'

setup()

const clock = new DOMClock()
const bar = new DOMBar()

let timerTS = 0
let duration = 0

let timerUpdateClock: number


export function setup(): void {
    document.addEventListener('DOMContentLoaded', () => {
        const container = <HTMLElement>document.getElementById('container')
        container.appendChild(clock.render())
        container.appendChild(bar.render())
    
        getSetupData()

        timerUpdateClock = window.setInterval(updateClock, 100)
    }) 
}


export function getSetupData(): void {
    const sending = browser.runtime.sendMessage({type: 'setup'})
    
    const handleResponse = (message: any) => {
        console.log(message)
        timerTS = message.timestamp
        duration = message.duration

        updateClock()
    } 
    
    const handleError = (reason: any) => {
        console.log(`Error: ${reason}`)
    }

    sending.then(handleResponse, handleError) //.catch((error) => console.log(error))
}


export function updateClock(): void {
    // Calculate time left
    const timeLeft = Math.floor((timerTS - Date.now()) / 1000)

    if (timeLeft < 0) {
        window.clearInterval(timerUpdateClock)

        // clock.classList.add('flash')

        // Request notification

    } else {
        // Calculate and update numbers on screen
        const s = timeLeft % 60
        const m = Math.floor(timeLeft / 60)
    

        clock.setDigit(0, s % 10)
        clock.setDigit(1, Math.floor(s / 10))
        clock.setDigit(2, m % 10)
        clock.setDigit(3, Math.floor(m / 10) % 10)
        clock.setDigit(4, m >= 100 ? Math.floor(m / 100) % 10 : -1)
        clock.setDigit(5, m >= 1000 ? Math.floor(m / 1000) % 10 : -1)

        bar.setPosition(timeLeft / (duration / 1000) * 100)
    }

}
// Time Quotes
// Time is an illusion. Lunchtime doubly so.
// Don't Panic.
// I love deadlines. I love the whooshing noise they make as they go by.
// Nothing travels faster than the speed of light, with the possible exception of bad news, which obeys its own special laws.