import { browser, Omnibox } from 'webextension-polyfill-ts'

interface Entry {
    lastUse: number
    count: number
    command: string
}

type SuggestResult = Omnibox.SuggestResult

const HISTORY_MAX_LENGTH = 20

const DEFAULT_SUGGESTIONS = [
    { content: '20m', description: '20 minutes' },
    { content: '30s', description: '30 seconds' },
    { content: '12:00', description: 'noon' },
    { content: '%20m', description: 'next even 20 minutes' },
]

export class SuggestionEngine {
    data: Array<Entry> = []

    constructor() {
        this.load().then((data) => {
            if (Object.prototype.hasOwnProperty.call(data, 'history')) {
                this.data = data.history
            } else {
                this.data = []
            }
        })
    }

    private convert(entry: Entry): SuggestResult {
        return { content: entry.command, description: entry.command }
    }

    public suggest(command: string): SuggestResult[] {
        const suggestions: Array<SuggestResult> = []

        // Add most recent command to suggestions.
        if (this.data.length > 0) {
            const mostRecent = this.data.reduce((a, b) => (a.lastUse > b.lastUse ? a : b))
            suggestions.push(this.convert(mostRecent))
        }

        // Add most used matches to suggestions.
        const search = command.replace(/\s+/g, ' ').trimStart() // Remove some whitespace
        const matches = this.data.filter((entry) => entry.command.startsWith(search))
        if (matches.length > 0) {
            suggestions.push(...matches.map(this.convert))
        }

        // Add the defaults.
        suggestions.push(...DEFAULT_SUGGESTIONS)

        return suggestions.slice(0, 6)
    }

    public update(command: string): void {
        command = command.replace(/\s+/g, ' ').trim()

        const index = this.data.findIndex((entry) => entry.command === command)

        if (index < 0) {
            this.data.push({ lastUse: Date.now(), count: 1, command: command })
        } else {
            this.data[index].lastUse = Date.now()
            this.data[index].count++
        }

        this.save().then()
    }

    public load(): Promise<{ [s: string]: Entry[] }> {
        return browser.storage.local.get('history')
    }

    public save(): Promise<void> {
        // Sort and truncate
        function sortFunc(a: Entry, b: Entry) {
            if (a.count === b.count) return -1 * (a.lastUse - b.lastUse)
            return -1 * (a.count - b.count)
        }
        this.data.sort(sortFunc)

        return browser.storage.local.set({ history: this.data.slice(0, HISTORY_MAX_LENGTH) })
    }
}
