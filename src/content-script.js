/* global MESSAGETYPE, GETMODE */

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

  if (mode === GETMODE.FOLLOWING) {
    links.splice(0, links.indexOf(targetLink))
  }

  let targetLinkStyle = window.getComputedStyle(targetLink)

  // filter similar style element
  links = links.filter(link => {
    let linkStyle = window.getComputedStyle(link)

    return similarStyleNames.every(styleName => linkStyle[styleName] === targetLinkStyle[styleName])
  })

  // filter out zero-dimensioned element
  links = links.filter(link => {
    if (link.offsetWidth || link.offsetHeight || link.getClientRects().length) {
      return true
    }

    let descendents = link.getElementsByTagName('*')

    return Array.prototype.some.call(descendents, element => element.offsetWidth || element.offsetHeight || element.getClientRects().length)
  })

  return links
}

function openSimilarLinks (targetLink, mode) {
  const THRESHOLD_TAB_CREATE_CONFIRM = 16

  let links = getSimilarLinks(targetLink, mode)

  // Confirm dialog is not avaiable in background script in Firefox.
  let linkCount = links.length
  if (THRESHOLD_TAB_CREATE_CONFIRM <= linkCount &&
    !window.confirm(chrome.i18n.getMessage('CONFIRM_OPEN', [linkCount]))) {
    return
  }

  let urls = links.map(link => link.href)

  chrome.runtime.sendMessage({
    'type': MESSAGETYPE.OPENLINKS,
    'urls': urls
  })
}

function GetMessageHandler (message, sender, sendResponse) {
  openSimilarLinks(document.activeElement, message.mode)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGETYPE.GETLINKS:
      GetMessageHandler.call(this, message, sender, sendResponse)
  }
})

document.addEventListener('click', event => {
  if (!event.target ||
    !event.altKey || event.ctrlKey || event.shiftKey ||
    event.button !== 1) {
    return
  }

  let link = (() => {
    for (let element = event.target; element; element = element.parentElement) {
      if (element.nodeName === 'A') {
        return element
      }
    }
  })()

  if (!link) {
    return
  }

  event.preventDefault()

  openSimilarLinks(link, GETMODE.ALL)
}, true)
