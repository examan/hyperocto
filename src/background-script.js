"use strict";

const CONTEXTMENU = {};
const CONTEXTMENUIDLIST = [
    "OPEN_ALL"
];

for(let menuItemId of CONTEXTMENUIDLIST) {
    CONTEXTMENU[menuItemId] = menuItemId;

    chrome.contextMenus.create({
    	id: menuItemId,
    	title: chrome.i18n.getMessage("CONTEXTMENU_" + menuItemId),
    	contexts: ["link"]
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    let tabIndex = tab.index;

	switch (info.menuItemId) {
	case CONTEXTMENU.OPEN_ALL:
		chrome.tabs.sendMessage(
			tab.id,
			{
				"name": MESSAGE.CONTEXTMENU_OPEN_ALL_CLICKED
			},
			{
				frameId: info.frameId
			},
			(urls) => {
                if(!urls) {
                    return;
                }

				urls.forEach((url, index) => {
					setTimeout((param) => {
						chrome.tabs.create(param);
					},
					0,
					{
						"url": url,
						"index": tabIndex + index + 1,
						"active": false
					});
				});
			}
		);
		break;
	}
});
