import { BROWSER } from "../lib/browser";
import { MESSAGETYPE } from "../lib/enums";
import { MessageOpenlinks, MESSAGE } from "../lib/type";

function openHandler(
  message: MessageOpenlinks,
  sender: chrome.runtime.MessageSender
): void {
  message.urls.forEach((url: string, index: number): void => {
    setTimeout(
      (param: chrome.tabs.CreateProperties): void => BROWSER.tabs.create(param),
      0,
      {
        url,
        index: sender.tab!.index + index + 1, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        active: false
      }
    );
  });
}

export function init(): void {
  BROWSER.runtime.onMessage.addListener(
    (message: MESSAGE, sender: chrome.runtime.MessageSender): boolean => {
      switch (message.type) {
        case MESSAGETYPE.OPENLINKS:
          openHandler(message, sender);
          break;
      }
      return true;
    }
  );
}
