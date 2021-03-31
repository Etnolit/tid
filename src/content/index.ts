import { browser } from 'webextension-polyfill-ts'
import { DOMBar, DOMClock } from './ui'

let clock: DOMClock
let bar: DOMBar

let end = 0
let duration = 0

// let timerUpdateClock: number

document.addEventListener('DOMContentLoaded', setup)

export function setup(): Promise<void> {
    const info = document.createElement('div')
    info.id = 'info'
    info.innerText = 'Press F for full screen.'
    document.body.appendChild(info)

    // Hide text about full screen mode after 3 seconds.
    window.setTimeout(() => info.classList.add('hidden'), 3000)

    document.addEventListener('keydown', handleKeyDownEvents)

    return getSetupData().then(() => {
        clock = new DOMClock(end)
        bar = new DOMBar(end, duration)

        const container = <HTMLElement>document.getElementById('container')
        container.appendChild(clock.render())
        container.appendChild(bar.render())
    })
}

export function getSetupData(): Promise<void> {
    const sending = browser.runtime.sendMessage({ type: 'setup' })

    const handleResponse = (message: any) => {
        end = message.timestamp
        duration = message.duration
    }

    const handleError = (reason: any) => {
        console.log(`Error: ${reason}`)
    }

    return sending.then(handleResponse) //, handleError) //.catch((error) => console.log(error))
}

export function handleKeyDownEvents(event: KeyboardEvent): void {
    if (event.key === 'f' && !event.repeat) {
        toggleFullScreen()
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
}
