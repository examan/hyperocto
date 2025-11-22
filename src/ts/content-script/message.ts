import type { MessageGetlinks } from "../lib/type";
import { openSimilarLinks } from "./open-similar-links";

export function init() {
  chrome.runtime.onMessage.addListener(({ type, mode }: MessageGetlinks) => {
    if (type !== "GET-LINKS") {
      return;
    }

    openSimilarLinks(document.activeElement as HTMLAnchorElement, mode);
  });
}
