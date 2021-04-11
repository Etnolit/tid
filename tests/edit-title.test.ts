import { handleKeyDownEvents, setup } from '@src/content/index'
import { Browser, browser } from 'webextension-polyfill-ts'

const BODY_HTML = '<div id="container" class="container"></div>'
const sendMessageFunction = browser.runtime.sendMessage

beforeEach(async () => {
    const sendMessageMock = jest.fn(() => Promise.resolve({ message: { end: 1616758284343, duration: 20000 } }))
    browser.runtime.sendMessage = sendMessageMock
    document.body.innerHTML = BODY_HTML

    await setup()
})

afterEach(() => {
    browser.runtime.sendMessage = sendMessageFunction
})

describe('Title editor', () => {
    test('should add title when T key pressed', async () => {
        const event = new KeyboardEvent('keydown', { key: 't' })
        handleKeyDownEvents(event)

        const subject = document.getElementById('title')

        expect(subject).toBeTruthy()
        expect(subject?.textContent).toBe('click to edit')
    })

    test('should hide the count down bar when active', async () => {
        const event = new KeyboardEvent('keydown', { key: 't' })
        handleKeyDownEvents(event)

        const subject = document.body

        expect(subject?.classList).toContain('no-bar')
    })

    test('should unfocus title when pressing Enter', async () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' })
        handleKeyDownEvents(event)

        const subject = document.getElementById('title')

        expect(subject?.focus).toBeFalsy()
    })
})
