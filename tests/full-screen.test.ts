import { handleKeyDownEvents } from '@src/content/index'

describe('Full screen mode', () => {
    test('should request full screen mode when F key pressed', () => {
        const mock = jest.fn()
        document.documentElement.requestFullscreen = mock
        const event = new KeyboardEvent('keydown', { key: 'f' })
        handleKeyDownEvents(event)

        expect(mock).toHaveBeenCalled()
    })

    test('should request to exit full screen mode when F key pressed a second time', () => {
        const mock = jest.fn()
        document.exitFullscreen = mock()
        const event = new KeyboardEvent('keydown', { key: 'f' })
        handleKeyDownEvents(event)
        handleKeyDownEvents(event)

        expect(mock).toHaveBeenCalled()
    })

    test('should not request full screen mode for repeat events', () => {
        const mock = jest.fn()
        document.documentElement.requestFullscreen = mock
        const event = new KeyboardEvent('keydown', { key: 'f', repeat: true })
        handleKeyDownEvents(event)

        expect(mock).toHaveBeenCalledTimes(0)
    })

    test('should not request full screen mode for keys other then F', () => {
        const mock = jest.fn()
        document.documentElement.requestFullscreen = mock

        handleKeyDownEvents(new KeyboardEvent('keydown', { key: 'p' }))
        handleKeyDownEvents(new KeyboardEvent('keydown', { key: 'q' }))
        handleKeyDownEvents(new KeyboardEvent('keydown', { key: 'r' }))

        expect(mock).toHaveBeenCalledTimes(0)
    })
})
