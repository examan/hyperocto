/* global MESSAGETYPE, OPENMODELIST, OPENMODE, enumerationBuilder */

'use strict'

const CONTEXTMENUIDLIST = []
for (let openmode of OPENMODELIST) {
  CONTEXTMENUIDLIST.push(`OPEN_${openmode}`)
}
const CONTEXTMENU = enumerationBuilder(CONTEXTMENUIDLIST)

for (let menuItemId of CONTEXTMENUIDLIST) {
  chrome.contextMenus.create({
    id: menuItemId,
    title: chrome.i18n.getMessage(`CONTEXTMENU_${menuItemId}`),
    contexts: ['link']
  })
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case CONTEXTMENU.OPEN_FOLLOWING:
    case CONTEXTMENU.OPEN_ALL:
      let mode = (menuItemId => {
        switch (menuItemId) {
          case CONTEXTMENU.OPEN_FOLLOWING:
            return OPENMODE.FOLLOWING
          case CONTEXTMENU.OPEN_ALL:
            return OPENMODE.ALL
        }
      })(info.menuItemId)

      chrome.tabs.sendMessage(
        tab.id,
        {
          'type': MESSAGETYPE.OPEN,
          'mode': mode,
          'fromTabIndex': tab.index
        },
        {
          frameId: info.frameId
        },
        message => {
          if (!message) {
            return
          }

          message.urls.forEach((url, index) => {
            setTimeout(
              param => chrome.tabs.create(param),
              0,
              {
                'url': url,
                'index': message.fromTabIndex + index + 1,
                'active': false
              }
            )
          })
        }
      )
      break
  }
})
