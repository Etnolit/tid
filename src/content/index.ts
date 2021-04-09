import { browser } from 'webextension-polyfill-ts'
import { DOMBar, DOMClock } from './ui'

let clock: DOMClock
let bar: DOMBar
let title: HTMLElement

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
    function titleIsActive(): boolean {
        return title && document.activeElement === title
    }

    if (event.key === 'f' && !event.repeat && !titleIsActive()) {
        toggleFullScreen()
    }

    if (event.key === 't' && !event.repeat && !title) {
        activateTitle(event)
    }

    if (event.key === 'Enter' && !event.shiftKey && title) {
        event.preventDefault()
        title.blur()
        document.getSelection()?.removeAllRanges()
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

function activateTitle(event: KeyboardEvent) {
    event.preventDefault()
    const container = <HTMLElement>document.getElementById('container')

    title = document.createElement('h1')
    title.id = 'title'
    title.setAttribute('contenteditable', 'true')
    title.setAttribute('spellcheck', 'false')
    title.textContent = 'click to edit'

    document.body.classList.add('no-bar')

    container.appendChild(title)

    const selection = document.getSelection()
    const range = document.createRange()
    range.setStart(title.firstChild as Node, 0)
    range.setEnd(title.firstChild as Node, title.textContent.length)

    selection?.removeAllRanges()
    selection?.addRange(range)
}
