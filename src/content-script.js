"use strict";

function getPathElements(targetElement) {
	let element = targetElement;
	let elements = [targetElement];
	while (element = element.parentElement) {
		elements.unshift(element);
	}
	return elements;
}

function getSimilarPathElements(targetElement) {
	let elements = getPathElements(targetElement);
	let pathSelector = elements.map((element) => {
		return element.tagName;
	}).join(" > ");
	let elementList = document.querySelectorAll(pathSelector);
	return Array.prototype.slice.call(elementList);
}

function getSimilarLinks(targetLink) {
	let similarPathElements = getSimilarPathElements(targetLink);

	let targetLinkStyle = getComputedStyle(targetLink);
	let similarStyleLinks = similarPathElements.filter((link) => {
		if (link.offsetWidth === 0 || link.offsetHeight === 0) {
			return false;
		}

		let linkStyle = getComputedStyle(link);

		return ["display", "font", "lineHeight", "position", "verticalAlign"].every((styleName) => {
			return linkStyle[styleName] === targetLinkStyle[styleName];
		});
	});

	return similarStyleLinks;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	const THRESHOLD_TAB_CREATE_CONFIRM = 16;

	switch(message.name) {
    case MESSAGE.CONTEXTMENU_OPEN_ALL_CLICKED:
		break;
    default:
		return;
    }

	let targetLink = document.activeElement;
	let links = getSimilarLinks(targetLink);

    switch(message.name) {
    case MESSAGE.CONTEXTMENU_OPEN_ALL_CLICKED:
        var filteredLink = links;
        break;
    }

	// Confirm dialog is not avaiable in background script in Firefox.
    let linkCount = filteredLink.length;
	if (THRESHOLD_TAB_CREATE_CONFIRM <= linkCount && !confirm(chrome.i18n.getMessage("CONFIRM_OPEN", [linkCount]))) {
		return sendResponse();
	}

    let urls = filteredLink.map((link) => {
		return link.href;
	});
	sendResponse(urls);
});
