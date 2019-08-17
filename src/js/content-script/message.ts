import { BROWSER } from "../lib/browser";
import { MESSAGETYPE } from "../lib/enums";
import { MessageGetlinks, MESSAGE } from "../lib/type";
import { openSimilarLinks } from "./open-similar-links";

function getHandler({ mode }: MessageGetlinks): void {
  openSimilarLinks(document.activeElement as HTMLAnchorElement, mode);
}

export function init(): void {
  BROWSER.runtime.onMessage.addListener((message: MESSAGE): boolean => {
    switch (message.type) {
      case MESSAGETYPE.GETLINKS:
        getHandler(message);
    }
    return true;
  });
}
