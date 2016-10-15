"use strict";

chrome.contextMenus.create({
    id: "open",
    title: chrome.i18n.getMessage("open_all"),

    contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
    case "open":
        chrome.tabs.sendMessage(
            tab.id,
            {
                "name": "context-menu-open-clicked"
            },
            {
                frameId: info.frameId
            },
            (message) => {
                // Firefox doesn't support default parameters in arrow function
                var urls = message || [];

                urls.forEach((url, index) => {
                    setTimeout((param) => {
                        chrome.tabs.create(param);
                    },
                    0,
                    {
                        "url": url,
                        "index": tab.index + index + 1,
                        "active": false
                    });
                });
            }
        );
        break;
    }
});
