/* global MESSAGETYPE, OPENMODE */

'use strict'

function getPathElements (targetElement) {
  let element = targetElement
  let elements = [targetElement]
  while ((element = element.parentElement)) {
    elements.unshift(element)
  }
  return elements
}

function getSimilarPathElements (targetElement) {
  const uriSchemeFilterSelector = 'about chrome opera javascript'
    .split(' ')
    .map((uriScheme) => `:not([href^='${uriScheme}:'])`)
    .join('')

  let elements = getPathElements(targetElement)
  let pathSelector = elements
    .map(element => element.tagName)
    .join(' > ')
  let elementSelector = `${pathSelector}${uriSchemeFilterSelector}`
  let elementList = document.querySelectorAll(elementSelector)

  return Array.prototype.slice.call(elementList)
}

function getSimilarLinks (targetLink, mode) {
  const similarStyleNames = 'display font lineHeight position verticalAlign'.split(' ')

  let links = getSimilarPathElements(targetLink)

  if (mode === OPENMODE.FOLLOWING) {
    links.splice(0, links.indexOf(targetLink))
  }

  let targetLinkStyle = window.getComputedStyle(targetLink)

  // filter similar style element
  links = links.filter(link => {
    let linkStyle = window.getComputedStyle(link)

    return similarStyleNames.every(styleName => linkStyle[styleName] === targetLinkStyle[styleName])
  })

  // filter zero-dimensioned element
  links = links.filter(link => {
    let element = link

    while (element) {
      if (element.offsetWidth !== 0 && element.offsetHeight !== 0 && element.getClientRects().length !== 0) {
        return true
      }

      if (element.firstChild) {
        element = element.firstChild
      } else if (element === link) {
        // no child
        return false
      } else if (element.nextSibling) {
        element = element.nextSibling
      } else if (element.parentNode !== link) {
        element = element.parentNode
      } else {
        // no dimensioned child
        return false
      }
    }

    // edge case ?
    return false
  })

  return links
}

function contextMenuOpenMessageListener (message, sender, sendResponse) {
  const THRESHOLD_TAB_CREATE_CONFIRM = 16

  let targetLink = document.activeElement
  let links = getSimilarLinks(targetLink, message.mode)

  // Confirm dialog is not avaiable in background script in Firefox.
  let linkCount = links.length
  if (THRESHOLD_TAB_CREATE_CONFIRM <= linkCount && !window.confirm(chrome.i18n.getMessage('CONFIRM_OPEN', [linkCount]))) {
    return
  }

  let urls = links.map(link => link.href)
  sendResponse({
    'fromTabIndex': message.fromTabIndex,
    'urls': urls
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGETYPE.OPEN:
      return contextMenuOpenMessageListener.call(this, message, sender, sendResponse)
    default:
      return
  }
})
