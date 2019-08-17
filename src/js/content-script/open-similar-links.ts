import { BROWSER } from "../lib/browser";
import { MODE, MESSAGETYPE } from "../lib/enums";
import { getSimilarLinks } from "./get-similar-links";
import { THRESHOLD_TAB_CREATE_CONFIRM } from "../lib/constant";
import { getUniqLinks } from "./get-uniq-links";

export function openSimilarLinks(
  targetLink: HTMLAnchorElement,
  mode: MODE
): void {
  const links = getSimilarLinks(targetLink, mode);

  const urls = getUniqLinks(links);

  /*
    Firefox does not support using confirm() from background pages.
    https://developer.mozilla.org/zh-TW/Add-ons/WebExtensions/Chrome_incompatibilities#Additional_incompatibilities
  */
  const linkCount = urls.length;
  if (
    THRESHOLD_TAB_CREATE_CONFIRM <= linkCount &&
    !window.confirm(BROWSER.i18n.getMessage("CONFIRM_OPEN", [linkCount]))
  ) {
    return;
  }

  BROWSER.runtime.sendMessage({
    type: MESSAGETYPE.OPENLINKS,
    urls
  });
}
