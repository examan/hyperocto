/* global MESSAGETYPE, GETMODELIST, GETMODE, enumerationBuilder */

'use strict'

const CONTEXTMENUIDLIST = []
for (let GETMODE of GETMODELIST) {
  CONTEXTMENUIDLIST.push(`OPEN_${GETMODE}`)
}
const CONTEXTMENU = enumerationBuilder(CONTEXTMENUIDLIST)

for (let menuItemId of CONTEXTMENUIDLIST) {
  browser.contextMenus.create({
    id: menuItemId,
    title: browser.i18n.getMessage(`CONTEXTMENU_${menuItemId}`),
    contexts: ['link']
  })
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case CONTEXTMENU.OPEN_FOLLOWING:
    case CONTEXTMENU.OPEN_ALL:
      let mode = (menuItemId => {
        switch (menuItemId) {
          case CONTEXTMENU.OPEN_FOLLOWING:
            return GETMODE.FOLLOWING
          case CONTEXTMENU.OPEN_ALL:
            return GETMODE.ALL
        }
      })(info.menuItemId)

      browser.tabs.sendMessage(
        tab.id,
        {
          'type': MESSAGETYPE.GETLINKS,
          'mode': mode
        },
        {
          frameId: info.frameId
        }
      )
      break
  }
})

function messageOpenHandler (message, sender, sendResponse) {
  message.urls.forEach((url, index) => {
    setTimeout(
      param => browser.tabs.create(param),
      0,
      {
        'url': url,
        'index': sender.tab.index + index + 1,
        'active': false
      }
    )
  })
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGETYPE.OPENLINKS:
      messageOpenHandler.call(this, message, sender, sendResponse)
      break
  }
})
