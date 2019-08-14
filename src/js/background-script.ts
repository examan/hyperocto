import { BROWSER } from "./browser";
import { MODE, MESSAGETYPE } from "./enums";
import { MessageOpenlinks, MESSAGE } from "./type";

for (const event of ["onStartup", "onInstalled"]) {
  BROWSER.runtime[event].addListener((): void => {
    for (const modeName of Object.keys(MODE).filter((k): boolean =>
      isNaN(Number(k))
    )) {
      BROWSER.contextMenus.create({
        id: `OPEN_${modeName}`,
        title: BROWSER.i18n.getMessage(`ACTION_OPEN_${modeName}`),
        contexts: ["link"]
      });

      if (MODE[modeName] === MODE.NORMAL) {
        BROWSER.contextMenus.create({
          id: "SEPARATOR1",
          type: "separator",
          contexts: ["link"]
        });
      }
    }

    BROWSER.contextMenus.create({
      id: "HINT",
      title: BROWSER.i18n.getMessage("HINT"),
      enabled: false,
      contexts: ["audio", "editable", "frame", "image", "page", "video"]
    });

    BROWSER.contextMenus.create({
      id: "SEPARATOR2",
      type: "separator",
      contexts: ["all"]
    });

    BROWSER.contextMenus.create({
      id: "HELP",
      title: BROWSER.i18n.getMessage("HELP"),
      contexts: ["all"]
    });
  });
}

BROWSER.contextMenus.onClicked.addListener((info, tab): void => {
  const menuItemId = info.menuItemId as string;
  const [action, modeString] = menuItemId.split("_");

  switch (action) {
    case "OPEN": {
      const mode = MODE[modeString];
      BROWSER.tabs.sendMessage(
        tab.id,
        {
          type: MESSAGETYPE.GETLINKS,
          mode: mode
        },
        {
          frameId: info.frameId
        }
      );
      break;
    }
    case "HELP":
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (BROWSER.browserAction as any).openPopup();
      } catch {
        window.open(BROWSER.runtime.getURL("page/manual.html"));
      }
  }
});

function messageOpenHandler(
  message: MessageOpenlinks,
  sender: chrome.runtime.MessageSender
): void {
  message.urls.forEach((url, index): void => {
    setTimeout(
      (param: chrome.tabs.CreateProperties): void => BROWSER.tabs.create(param),
      0,
      {
        url: url,
        index: sender.tab.index + index + 1,
        active: false
      }
    );
  });
}

BROWSER.runtime.onMessage.addListener(
  (message: MESSAGE, sender: chrome.runtime.MessageSender): boolean => {
    switch (message.type) {
      case MESSAGETYPE.OPENLINKS:
        messageOpenHandler(message as MessageOpenlinks, sender);
        break;
    }

    return true;
  }
);
