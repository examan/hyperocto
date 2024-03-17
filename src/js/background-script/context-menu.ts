import { MESSAGETYPE, MODE } from "../lib/enums";

const MODE_ENTRIES = Object.entries(MODE).filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ([key]: [string, any]): boolean => isNaN(Number(key)),
);

function build(event: chrome.runtime.RuntimeEvent): void {
  event.addListener((): void => {
    for (const [modeName, modeValue] of MODE_ENTRIES) {
      chrome.contextMenus.create({
        contexts: ["link"],
        id: `OPEN_${modeName}`,
        title: chrome.i18n.getMessage(`ACTION_OPEN_${modeName}`),
      });
      if (modeValue === MODE.NORMAL) {
        chrome.contextMenus.create({
          contexts: ["link"],
          id: "SEPARATOR1",
          type: "separator",
        });
      }
    }
    chrome.contextMenus.create({
      contexts: ["audio", "editable", "frame", "image", "page", "video"],
      enabled: false,
      id: "HINT",
      title: chrome.i18n.getMessage("HINT"),
    });
    chrome.contextMenus.create({
      contexts: ["all"],
      id: "SEPARATOR2",
      type: "separator",
    });
    chrome.contextMenus.create({
      contexts: ["all"],
      id: "HELP",
      title: chrome.i18n.getMessage("HELP"),
    });
  });
}

function openLinks(tabId: number, mode: MODE, frameId: number): void {
  void chrome.tabs.sendMessage(
    tabId,
    {
      mode,
      type: MESSAGETYPE.GETLINKS,
    },
    {
      frameId,
    },
  );
}

function showHelp(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void chrome.action.openPopup();
  } catch {
    void chrome.tabs.create({
      url: chrome.runtime.getURL("src/page/manual.html"),
    });
  }
}

function handler(
  { menuItemId, frameId }: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined,
): void {
  const [action, modeString] = (menuItemId as string).split("_");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  switch (action!) {
    case "OPEN": {
      const modeName = modeString as keyof typeof MODE;
      const mode = MODE[modeName];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      openLinks(tab!.id!, mode, frameId!);
      break;
    }
    case "HELP":
      showHelp();
  }
}

export function init(): void {
  for (const event of [chrome.runtime.onStartup, chrome.runtime.onInstalled]) {
    build(event);
  }

  chrome.contextMenus.onClicked.addListener(handler);
}
