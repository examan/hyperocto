"use strict";

(() => {

function getPathElements(targetElement) {
    var element = targetElement;
    var elements = [targetElement];
    while(element = element.parentElement) {
        elements.unshift(element);
    }
    return elements;
}

function getSimilarPathElements(targetElement) {
  var elements = getPathElements(targetElement);
  var pathSelector = elements.map((element) => {
      return element.tagName;
  }).join(" > ");
  var elementList = document.querySelectorAll(pathSelector);
  return Array.prototype.slice.call(elementList);
}

function getSimilarLinks(targetLink) {
    var similarPathElements = getSimilarPathElements(targetLink);

    var targetLinkStyle = getComputedStyle(targetLink);
    var similarStyleLinks = similarPathElements.filter((link) => {
      if(link.offsetWidth === 0 || link.offsetHeight === 0) {
        return false;
      }

      var linkStyle = getComputedStyle(link);

      return ["display", "font", "lineHeight", "position", "verticalAlign"].every((styleName) => {
        return linkStyle[styleName] === targetLinkStyle[styleName];
      });
    });

    return similarStyleLinks;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    var targetLink = document.activeElement;
    var links = getSimilarLinks(targetLink);
    var urls = links.map((link) => {
        return link.href;
    });
    sendResponse(urls);
});

})();
