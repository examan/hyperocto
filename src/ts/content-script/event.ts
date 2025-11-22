import type { MODE } from "../lib/type";
import { openSimilarLinks } from "./open-similar-links";

const SUPPORT_AUXCLICK_EVENT = Object.hasOwn(Document.prototype, "onauxclick");

const MIDDLE_CLICK_EVENT_NAME = SUPPORT_AUXCLICK_EVENT ? "auxclick" : "click";

function getMode({ ctrlKey, shiftKey }: MouseEvent): MODE {
  if (ctrlKey) {
    return "STRICT";
  }

  if (shiftKey) {
    return "FLEXIBLE";
  }

  return "NORMAL";
}

export function init(): void {
  document.addEventListener(
    MIDDLE_CLICK_EVENT_NAME,
    (event: MouseEvent): void => {
      if (
        event.button !== 1 ||
        !event.altKey ||
        (event.shiftKey && event.ctrlKey)
      ) {
        return;
      }

      const link = (event.target as Element).closest("a");

      if (link === null) {
        return;
      }

      event.preventDefault();

      const mode = getMode(event);
      openSimilarLinks(link, mode);
    },
    true,
  );
}
