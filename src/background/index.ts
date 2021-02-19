import { Parser, Lexer, Tokenizer } from './parser'


type Tab = browser.tabs.Tab

interface Timer {
  tabId: number
  timestamp: number
  duration: number
}

let allTimers: Timer[] = []


function initExtension() {

  browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      console.log(`Received message: ${request}, ${sender}`)
      
      allTimers = allTimers.filter(timer => timer.timestamp > Math.ceil(+new Date() / 1000))

      const currentTimer = allTimers.find(timer => timer.tabId == sender.tab?.id)

      console.log(sender)

      if (request.type === 'setup') {
        console.log('Sending setup data')
        sendResponse(currentTimer)
      }

      if (request.type === 'notify') {
        console.log('Request for notification.')
        // TODO: Move notification code here.
      }
    }
  )


  browser.browserAction.onClicked.addListener(function () {
    createTimerPage(Date.now(), 300000)
  })


  browser.omnibox.setDefaultSuggestion({
    description: `Start a timer.`
  })


  // onInputStarted
  // onInputChanged
  // onInputEntered
  // onInputCancelled


  browser.omnibox.onInputEntered.addListener((command: string, disposition: browser.omnibox.OnInputEnteredDisposition): void => {
    console.log(command)
    
    const now = Date.now()
    const duration = Parser(Lexer(command, Tokenizer), now)
    
    createTimerPage(now, duration)
    
    disposition = "newForegroundTab"
  })

}

function createTimerPage(start: number, duration: number) {
  function onCreated(tab: Tab): void {
    if (tab.id) {
      allTimers.push({tabId: tab.id, timestamp: start + duration, duration: duration})
    }
  }
  
  
  function onError(error: Error): void {
    console.log(`Error: ${error}`)
  }
    
  const newTab = browser.tabs.create({
    url: "/page.html"
  })
  
  newTab.then(onCreated, onError)
}


initExtension()