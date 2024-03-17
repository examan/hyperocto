import type { MESSAGE, MessageOpenlinks } from "../lib/type";
import { MESSAGETYPE } from "../lib/enums";

function openHandler(
  message: MessageOpenlinks,
  sender: chrome.runtime.MessageSender,
): void {
  message.urls.forEach((url: string, index: number): void => {
    setTimeout(
      (param: chrome.tabs.CreateProperties): void => {
        void chrome.tabs.create(param);
      },
      0,
      {
        active: false,
        index: sender.tab!.index + index + 1, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        url,
      },
    );
  });
}

export function init(): void {
  chrome.runtime.onMessage.addListener(
    (message: MESSAGE, sender: chrome.runtime.MessageSender) => {
      if (message.type === MESSAGETYPE.OPENLINKS) {
        openHandler(message, sender);
      }
    },
  );
}
