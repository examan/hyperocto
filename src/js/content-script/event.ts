import { MODE } from "../lib/enums";
import { openSimilarLinks } from "./open-similar-links";

const SUPPORT_AUXCLICK_EVENT = Object.prototype.hasOwnProperty.call(
  Document.prototype,
  "onauxclick"
);

const MIDDLE_CLICK_EVENT_NAME = SUPPORT_AUXCLICK_EVENT ? "auxclick" : "click";

function getMode({ ctrlKey, shiftKey }: MouseEvent): MODE {
  if (ctrlKey) {
    return MODE.STRICT;
  } else if (shiftKey) {
    return MODE.SLOPPY;
  } else {
    return MODE.NORMAL;
  }
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
      if (!link) {
        return;
      }
      const mode = getMode(event);
      event.preventDefault();
      openSimilarLinks(link, mode);
    },
    true
  );
}
