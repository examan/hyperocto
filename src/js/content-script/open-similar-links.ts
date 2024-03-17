import { MESSAGETYPE, type MODE } from "../lib/enums";
import { THRESHOLD_TAB_CREATE_CONFIRM } from "../lib/constant";
import { getSimilarLinks } from "./get-similar-links";
import { getUniqLinks } from "./get-uniq-links";

export function openSimilarLinks(
  targetLink: HTMLAnchorElement,
  mode: MODE,
): void {
  const links = getSimilarLinks(targetLink, mode);

  const urls = getUniqLinks(links);

  const linkCount = urls.length;
  if (
    THRESHOLD_TAB_CREATE_CONFIRM <= linkCount &&
    !window.confirm(
      chrome.i18n.getMessage("CONFIRM_OPEN", [linkCount.toString()]),
    )
  ) {
    return;
  }

  void chrome.runtime.sendMessage({
    type: MESSAGETYPE.OPENLINKS,
    urls,
  });
}
