import { processCommandString, Lexer, Tokenizer } from './command'


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
    createTimerPage(300)
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
    
    const timerDuration = processCommandString(command)
    
    createTimerPage(timerDuration)
    
//    disposition = "newForegroundTab"
  })

}

function createTimerPage(time: number) {
  function onCreated(tab: Tab): void {
    console.log(`Created tab ${tab.id}`)
    console.log(`time ${time}`)
    if (tab.id) {
      allTimers.push({tabId: tab.id, timestamp: Math.ceil(+new Date() / 1000) + time, duration: time})
    }
  }
  
  
  function onError(error: Error): void {
    console.log(`Error: ${error}`)
  }
  
  console.log('Creating page')
  
  const newTab = browser.tabs.create({
    url: "/page.html"
  })
  
  newTab.then(onCreated, onError)
}


initExtension()