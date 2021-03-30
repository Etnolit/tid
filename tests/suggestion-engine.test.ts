import { SuggestionEngine } from '@src/background/suggestion'
import { browser } from 'webextension-polyfill-ts'

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

describe('SuggestionEngine', () => {
    test('should return suggestions when no data stored', async () => {
        const getFunction = browser.storage.local.get
        const mock = jest.fn(() => Promise.resolve([]))
        browser.storage.local.get = mock

        const subject = await new SuggestionEngine()

        expect(subject.suggest('')).toHaveLength(4)

        browser.storage.local.get = getFunction
    })

    test('should return suggestions when matching stored data', async () => {
        const getFunction = browser.storage.local.get
        const mock = jest.fn(() => Promise.resolve([
            {lastUse: 123456, count: 2, command: '20m'}
        ]))
        browser.storage.local.get = mock

        const subject = await new SuggestionEngine()

        expect(subject.suggest('2')).toContainEqual({content: '20m', description: '20m'})

        browser.storage.local.get = getFunction
    })

    test('should sort entries by most recent if same number of uses', async () => {
        const getFunction = browser.storage.local.get
        const getMock = jest.fn(() => Promise.resolve([]))
        browser.storage.local.get = getMock

        const setFunction = browser.storage.local.set
        const setMock = jest.fn((keys) => Promise.resolve())
        browser.storage.local.set = setMock

        const subject = await new SuggestionEngine()

        subject.update('20m')
        await sleep(1)
        subject.update('12:00')

        expect(getMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenLastCalledWith(
            expect.objectContaining({history: [
                {
                    lastUse: expect.any(Number),
                    count: 1,
                    command: '12:00'    
                },
                {
                    lastUse: expect.any(Number),
                    count: 1,
                    command: '20m'    
                }
            ]})
        )

        browser.storage.local.get = getFunction
        browser.storage.local.set = setFunction
    })

    test('should update and save correctly', async () => {
        const getFunction = browser.storage.local.get
        const getMock = jest.fn(() => Promise.resolve([]))
        browser.storage.local.get = getMock

        const setFunction = browser.storage.local.set
        const setMock = jest.fn((keys) => Promise.resolve())
        browser.storage.local.set = setMock

        const subject = await new SuggestionEngine()

        subject.update('20m')
        subject.update('12:00')
        subject.update('20m')

        expect(getMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenLastCalledWith(
            expect.objectContaining({history: [
                {
                    lastUse: expect.any(Number),
                    count: 2,
                    command: '20m'    
                },
                {
                    lastUse: expect.any(Number),
                    count: 1,
                    command: '12:00'
                }
            ]})
        )

        browser.storage.local.get = getFunction
        browser.storage.local.set = setFunction
    })
})