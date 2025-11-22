import type { MessageOpenlinks, MODE } from "../lib/type";
import * as R from "remeda";
import { THRESHOLD_TAB_CREATE_CONFIRM } from "../lib/constant";
import { getSimilarLinks } from "./get-similar-links";

export function openSimilarLinks(targetLink: HTMLAnchorElement, mode: MODE) {
  const links = getSimilarLinks(targetLink, mode);

  const urls = links.map(R.prop("href"));

  const linkCount = urls.length;
  if (
    THRESHOLD_TAB_CREATE_CONFIRM <= linkCount &&
    !window.confirm(chrome.i18n.getMessage("CONFIRM_OPEN", [`${linkCount}`]))
  ) {
    return;
  }

  void chrome.runtime.sendMessage<MessageOpenlinks>({
    type: "OPEN-LINKS",
    urls,
  });
}
