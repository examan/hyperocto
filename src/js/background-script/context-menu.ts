import { BROWSER } from "../lib/browser";
import { MODE, MESSAGETYPE } from "../lib/enums";

const MODE_ENTRIES = Object.entries(MODE).filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ([key]: [string, any]): boolean => isNaN(Number(key))
);

function build(event: chrome.runtime.RuntimeEvent): void {
  event.addListener((): void => {
    for (const [modeName, modeValue] of MODE_ENTRIES) {
      BROWSER.contextMenus.create({
        id: `OPEN_${modeName}`,
        title: BROWSER.i18n.getMessage(`ACTION_OPEN_${modeName}`),
        contexts: ["link"]
      });
      if (modeValue === MODE.NORMAL) {
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

function openLinks(tabId: number, mode: MODE, frameId: number): void {
  BROWSER.tabs.sendMessage(
    tabId,
    {
      type: MESSAGETYPE.GETLINKS,
      mode
    },
    {
      frameId
    }
  );
}

function showHelp(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BROWSER.browserAction as any).openPopup();
  } catch {
    BROWSER.tabs.create({
      url: BROWSER.runtime.getURL("page/manual.html")
    });
  }
}

function handler(
  { menuItemId, frameId }: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
): void {
  const [action, modeString] = (menuItemId as string).split("_");
  switch (action) {
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
  for (const event of [
    BROWSER.runtime.onStartup,
    BROWSER.runtime.onInstalled
  ]) {
    build(event);
  }

  BROWSER.contextMenus.onClicked.addListener(handler);
}
