import { browser, Omnibox } from 'webextension-polyfill-ts'
import { Parser, Lexer, Tokenizer } from './parser'
import { SuggestionEngine } from './suggestion'

type Tab = browser.tabs.Tab

type Timer = {
    tabId: number
    timestamp: number
    duration: number
}

let allTimers: Timer[] = []
let suggestionEngine: SuggestionEngine

export function initExtension(): void {
    browser.runtime.onMessage.addListener(handleMessage)

    browser.browserAction.onClicked.addListener(function () {
        createTimerPage(Date.now(), 300000)
    })

    browser.omnibox.setDefaultSuggestion({
        description: `Start a timer.`,
    })

    browser.omnibox.onInputStarted.addListener((): void => {
        if (!suggestionEngine) suggestionEngine = new SuggestionEngine()
    })

    browser.omnibox.onInputChanged.addListener((command: string, suggest: (r: Omnibox.SuggestResult[]) => void) => {
        suggest(suggestionEngine.suggest(command))
    })

    browser.omnibox.onInputEntered.addListener(
        (command: string, disposition: browser.omnibox.OnInputEnteredDisposition): void => {
            suggestionEngine.update(command)

            const now = Date.now()
            const duration = Parser(Lexer(command, Tokenizer), now)

            // TODO: Make sure to do something different depending on dispositon.
            if (disposition === 'currentTab') {
                createTimerPage(now, duration)
            }
            if (disposition === 'newForegroundTab') {
                createTimerPage(now, duration)
            }
            if (disposition === 'newBackgroundTab') {
                createTimerPage(now, duration)
            }
        },
    )
}

export function createTimerPage(start: number, duration: number): void {
    function onCreated(tab: Tab): void {
        if (tab.id) {
            allTimers.push({ tabId: tab.id, timestamp: start + duration, duration: duration })
        }
    }

    function onError(error: Error): void {
        console.log(`Error: ${error}`)
    }

    const newTab = browser.tabs.create({
        url: '/page.html',
    })

    newTab.then(onCreated, onError)
}

export function handleMessage(
    request: MessageEvent,
    sender: browser.runtime.MessageSender,
): Promise<Timer | undefined> {
    allTimers = allTimers.filter((timer) => timer.timestamp > Math.ceil(+new Date() / 1000))

    const currentTimer = allTimers.find((timer) => timer.tabId == sender.tab?.id)

    if (request.type === 'setup') {
        console.log('Sending setup data')

        return Promise.resolve(currentTimer)
    }

    if (request.type === 'notify') {
        console.log('Request for notification received.')

        const sending = browser.notifications.create('', {
            type: 'basic',
            title: "Time's up!",
            message: '',
            iconUrl: 'assets/icons/alarm-48.png',
        })

        const handleResponse = (message?: any) => {
            console.log(message)
        }

        const handleError = (reason: any) => {
            console.log(reason)
        }

        sending.then(handleResponse, handleError)
    }

    return Promise.reject()
}

initExtension()
