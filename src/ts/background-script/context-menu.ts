import { MessageGetlinks, type MODE } from "../lib/type";
import { MODE_VALUES } from "../lib/constant";
import * as R from "remeda";
import type { WritableDeep, ArrayElement } from "type-fest";

const MENU_ITEMS = R.pipe(
  [
    ...R.flatMap(MODE_VALUES, (mode) => {
      const item = {
        contexts: ["link"],
        id: `OPEN_${mode}`,
        title: `ACTION_OPEN_${mode}`,
      } as const;

      if (mode !== "NORMAL") {
        return item;
      }

      return [
        item,
        { contexts: ["link"], id: "SEPARATOR1", type: "separator" } as const,
      ];
    }),
    {
      contexts: ["audio", "editable", "frame", "image", "page", "video"],
      enabled: false,
      id: "HINT",
      title: "HINT",
    },
    { contexts: ["all"], id: "SEPARATOR2", type: "separator" },
    { contexts: ["all"], id: "HELP", title: "HELP" },
  ] as const,
  R.map(R.evolve({ title: chrome.i18n.getMessage })),
);

type MenuItem = ArrayElement<typeof MENU_ITEMS>;

function build(event: chrome.events.Event<() => void>) {
  event.addListener(() => {
    for (const item of MENU_ITEMS) {
      chrome.contextMenus.create(item as WritableDeep<MenuItem>);
    }
  });
}

function openLinks(tabId: number, mode: MODE, frameId: number) {
  void chrome.tabs.sendMessage<MessageGetlinks>(
    tabId,
    { mode, type: "GET-LINKS" },
    { frameId },
  );
}

function showHelp() {
  try {
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
) {
  const [action, modeString] = R.split(menuItemId as MenuItem["id"], "_");
  switch (action) {
    case "OPEN": {
      openLinks(tab!.id!, modeString, frameId!);
      break;
    }
    case "HELP":
      showHelp();
  }
}

export function init() {
  for (const event of [chrome.runtime.onStartup, chrome.runtime.onInstalled]) {
    build(event);
  }

  chrome.contextMenus.onClicked.addListener(handler);
}
