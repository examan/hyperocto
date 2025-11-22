import type { MODE } from "../lib/type";
import { openSimilarLinks } from "./open-similar-links";
import * as R from "remeda";

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
        R.anyPass(event, [
          R.isNot(R.hasSubObject({ button: 1 })),
          R.hasSubObject({ altKey: false }),
          R.hasSubObject({ shiftKey: true, ctrlKey: true }),
        ])
      ) {
        return;
      }
      const link = (event.target as Element).closest("a");
      if (link === null) {
        return;
      }
      const mode = getMode(event);
      event.preventDefault();
      openSimilarLinks(link, mode);
    },
    true,
  );
}
