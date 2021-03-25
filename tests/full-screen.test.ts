import { handleKeyDownEvents } from '@src/content/index'

describe('Full screen mode', () => {
    test('should request full screen mode when F key pressed', () => {
        const mock = jest.fn()
        document.documentElement.requestFullscreen = mock;
        let event = new KeyboardEvent('keydown', {'key': 'f'})
        handleKeyDownEvents(event)

        expect(mock).toHaveBeenCalled()
    })

    test('should not request full screen mode for repeat events', () => {
        const mock = jest.fn()
        document.documentElement.requestFullscreen = mock;
        let event = new KeyboardEvent('keydown', {'key': 'f', 'repeat': true})
        handleKeyDownEvents(event)

        expect(mock).toHaveBeenCalledTimes(0)
    })
})
