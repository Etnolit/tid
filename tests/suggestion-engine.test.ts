import { SuggestionEngine } from '@src/background/suggestion'
import { browser } from 'webextension-polyfill-ts'

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

describe('SuggestionEngine', () => {
    test('should return suggestions when no data stored', async () => {
        const getFunction = browser.storage.local.get
        const mock = jest.fn(() => Promise.resolve({ history: [] }))
        browser.storage.local.get = mock

        const subject = await new SuggestionEngine()

        expect(subject.suggest('')).toHaveLength(4)

        browser.storage.local.get = getFunction
    })

    test('should return suggestions when matching stored data', async () => {
        const getFunction = browser.storage.local.get
        const mock = jest.fn(() => Promise.resolve({ history: [{ lastUse: 1617114210382, count: 2, command: '10m' }] }))
        browser.storage.local.get = mock

        const subject = await new SuggestionEngine()

        expect(subject.suggest('1')).toContainEqual(
            expect.objectContaining({
                content: '10m',
                description: expect.any(String),
            }),
        )

        browser.storage.local.get = getFunction
    })

    test('should sort entries by most recent if same number of uses', async () => {
        const getFunction = browser.storage.local.get
        const getMock = jest.fn(() => Promise.resolve({ history: [] }))
        browser.storage.local.get = getMock

        const setFunction = browser.storage.local.set
        const setMock = jest.fn(() => Promise.resolve())
        browser.storage.local.set = setMock

        const subject = await new SuggestionEngine()

        subject.update('20m')
        await wait(1) // Wait 1ms
        subject.update('12:00')

        expect(getMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                history: [
                    {
                        lastUse: expect.any(Number),
                        count: 1,
                        command: '12:00',
                    },
                    {
                        lastUse: expect.any(Number),
                        count: 1,
                        command: '20m',
                    },
                ],
            }),
        )

        browser.storage.local.get = getFunction
        browser.storage.local.set = setFunction
    })

    test('should update and save correctly', async () => {
        const getFunction = browser.storage.local.get
        const getMock = jest.fn(() => Promise.resolve({ history: [] }))
        browser.storage.local.get = getMock

        const setFunction = browser.storage.local.set
        const setMock = jest.fn(() => Promise.resolve())
        browser.storage.local.set = setMock

        const subject = await new SuggestionEngine()

        subject.update('20m')
        subject.update('12:00')
        subject.update('20m')

        expect(getMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenCalled()
        expect(setMock).toHaveBeenLastCalledWith(
            expect.objectContaining({
                history: [
                    {
                        lastUse: expect.any(Number),
                        count: 2,
                        command: '20m',
                    },
                    {
                        lastUse: expect.any(Number),
                        count: 1,
                        command: '12:00',
                    },
                ],
            }),
        )

        browser.storage.local.get = getFunction
        browser.storage.local.set = setFunction
    })
})
