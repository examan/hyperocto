import { BROWSER } from "../lib/browser";
import { MODE, MESSAGETYPE } from "../lib/enums";

const MODE_ENTRIES = Object.entries(MODE).filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ([key]: [string, any]): boolean => isNaN(Number(key))
) as [string, MODE][];
const createContextMenu = BROWSER.contextMenus.create;

function ActionMenuBuilder(
  actionType: string,
  separatorAfterModes: MODE[]
): void {
  for (const [modeName, modeValue] of MODE_ENTRIES) {
    createContextMenu({
      id: `${actionType}_${modeName}`,
      title: BROWSER.i18n.getMessage(`ACTION_${actionType}_${modeName}`),
      contexts: ["link"]
    });

    if (separatorAfterModes.includes(modeValue)) {
      createContextMenu({
        id: `SEPARATOR_${actionType}`,
        type: "separator",
        contexts: ["link"]
      });
    }
  }
}

function builder(): void {
  ActionMenuBuilder("OPEN", [MODE.NORMAL, MODE.SLOPPY]);
  ActionMenuBuilder("MARK", [MODE.SLOPPY]);
  createContextMenu({
    id: "HINT",
    title: BROWSER.i18n.getMessage("HINT"),
    enabled: false,
    contexts: ["audio", "editable", "frame", "image", "page", "video"]
  });
  createContextMenu({
    id: "SEPARATOR2",
    type: "separator",
    contexts: ["all"]
  });
  createContextMenu({
    id: "HELP",
    title: BROWSER.i18n.getMessage("HELP"),
    contexts: ["all"]
  });
}

function openLinks(tabId: number, frameId: number, mode: MODE): void {
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
  const [actionType, modeString] = (menuItemId as string).split("_");
  switch (actionType) {
    case "OPEN": {
      const modeName = modeString as keyof typeof MODE;
      const mode = MODE[modeName];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      openLinks(tab!.id!, frameId!, mode);
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
    event.addListener(builder);
  }

  BROWSER.contextMenus.onClicked.addListener(handler);
}
