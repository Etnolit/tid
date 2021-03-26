import { setup } from '@src/content/index'
import { browser } from 'webextension-polyfill-ts'


describe('Setup', () => {
    test('should add correct elements', async () => {
        const sendMessageMock = jest.fn(() => Promise.resolve({message: {end: 1616758284343, duration: 20000}}))
        browser.runtime.sendMessage = sendMessageMock

        document.body.innerHTML = '<div id="container" class="container"></div>'

        await setup()

        expect(document.body.children[0].id).toEqual('container')
        expect(document.body.children[0].children[0].id).toEqual('clock')
        expect(document.body.children[0].children[1].id).toEqual('bar')
        expect(document.body.children[1].id).toEqual('info')
    })
})
