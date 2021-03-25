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

        const body = <HTMLElement>document.getElementById('body')
        const info = document.createElement('div')
        info.id = 'info'
        info.innerText = 'Press F for full screen.'
        body.appendChild(info)

        window.setTimeout(() => info.classList.add('hidden'), 3000)

        document.addEventListener("keydown", handleKeyDownEvents);
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

        clock.flash()

        // Request notification
        const sending = browser.runtime.sendMessage({type: 'notify'})

        const handleResponse = (message?: any) => {
            console.log('Notification request sent.')
        }

        const handleError = (reason: any) => {
            console.log('Error: ${reason}')
        }

        sending.then(handleResponse, handleError)

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

export function handleKeyDownEvents(event: KeyboardEvent): void {
    if (event.key === 'f' && !event.repeat) {
        toggleFullScreen();
      }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }