"use strict";

chrome.contextMenus.create({
    id: "open",
    title: chrome.i18n.getMessage("open_all"),

    contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
    case "open":
        var urls = message || [];

        if(!confirm(chrome.i18n.getMessage("confirm_open", urls.length))) {
            return;
        }

        chrome.tabs.sendMessage(
            tab.id,
            {
                "name": "context-menu-open-clicked"
            },
            {
                frameId: info.frameId
            },
            (message) => {
                urls.forEach((url, index) => {
                    setTimeout((param) => {
                        chrome.tabs.create(param);
                    },
                    0,
                    {
                        "url": url,
                        "index": tab.index + index + 1,
                        "active": false,
                        "openerTabId": tab.id
                    });
                });
            }
        );
        break;
    }
});
