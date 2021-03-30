import { browser, Omnibox } from 'webextension-polyfill-ts'

interface Entry {
    lastUse: number
    count: number
    command: string
}

const HISTORY_MAX_LENGTH = 20

const DEFAULT_SUGGESTIONS = [
        {'content': '20m', 'description': '20 minutes'},
        {'content': '30s', 'description': '30 seconds'},
        {'content': '12:00', 'description': 'noon'},
        {'content': '20%', 'description': 'next even 20 minutes'}
    ]

export class SuggestionEngine {
    data: Array<Entry> = []

    constructor() {
        this.load().then((data) => this.data = data)
    }
    
    public suggest(command: string): Omnibox.SuggestResult[] {
        const search = command.replace(/\s+/g, ' ').trimStart()  // Remove some whitespace

        const index = this.data.findIndex((entry) => entry.command.startsWith(search))
        if (index >= 0) {
            return [{content: this.data[index].command, description: this.data[index].command}]
        }

        return DEFAULT_SUGGESTIONS
    }
    
    public update(command: string): void {
        command = command.replace(/\s+/g, ' ').trim()

        const index = this.data.findIndex((entry) => entry.command === command)

        if (index < 0) {
            this.data.push({lastUse: Date.now(), count: 1, command: command})
        } else {
            this.data[index].lastUse = Date.now()
            this.data[index].count++
        }

        this.save().then()
    }
    
    public load(): Promise<any> {
        return browser.storage.local.get('history')
    }

    public save(): Promise<void> {
        // Sort and truncate
        function sortFunc(a: Entry, b: Entry) {
            if (a.count === b.count)
                return -1 * (a.lastUse - b.lastUse)
            return -1 * (a.count - b.count)
        }
        this.data.sort(sortFunc)

        return browser.storage.local.set({'history': this.data.slice(0, HISTORY_MAX_LENGTH)})
    }
}