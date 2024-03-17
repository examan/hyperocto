import type { MESSAGE, MessageGetlinks } from "../lib/type";
import { MESSAGETYPE } from "../lib/enums";
import { openSimilarLinks } from "./open-similar-links";

function getHandler({ mode }: MessageGetlinks): void {
  openSimilarLinks(document.activeElement as HTMLAnchorElement, mode);
}

export function init(): void {
  chrome.runtime.onMessage.addListener((message: MESSAGE) => {
    if (message.type === MESSAGETYPE.GETLINKS) {
      getHandler(message);
    }
  });
}
