import { BROWSER } from "./browser";
import { MODE, MESSAGETYPE } from "./enums";
import { MessageGetlinks, MESSAGE } from "./type";
import { getSimilarLinks } from "./get-similar-links";

const SUPPORT_AUXCLICK_EVENT = Object.prototype.hasOwnProperty.call(
  Document.prototype,
  "onauxclick"
);
const MIDDLE_CLICK_EVENT_NAME = SUPPORT_AUXCLICK_EVENT ? "auxclick" : "click";
const THRESHOLD_TAB_CREATE_CONFIRM = 16;

function uniq(urls: string[]): string[] {
  return Array.from(new Set(urls));
}

function openSimilarLinks(targetLink: HTMLAnchorElement, mode: MODE): void {
  const links = getSimilarLinks(targetLink, mode);

  const urls = links.map((link): string => link.href);
  const uriqUrls = uniq(urls);

  /*
    Firefox does not support using confirm() from background pages.
    https://developer.mozilla.org/zh-TW/Add-ons/WebExtensions/Chrome_incompatibilities#Additional_incompatibilities
  */
  const linkCount = uriqUrls.length;
  if (
    THRESHOLD_TAB_CREATE_CONFIRM <= linkCount &&
    !window.confirm(BROWSER.i18n.getMessage("CONFIRM_OPEN", [linkCount]))
  ) {
    return;
  }

  BROWSER.runtime.sendMessage({
    type: MESSAGETYPE.OPENLINKS,
    urls: uriqUrls
  });
}

function messageGetHandler(message: MessageGetlinks): void {
  openSimilarLinks(document.activeElement as HTMLAnchorElement, message.mode);
}

BROWSER.runtime.onMessage.addListener((message: MESSAGE): boolean => {
  switch (message.type) {
    case MESSAGETYPE.GETLINKS:
      messageGetHandler(message as MessageGetlinks);
  }

  return true;
});

function getMode(event: MouseEvent): MODE {
  if (event.ctrlKey) {
    return MODE.STRICT;
  } else if (event.shiftKey) {
    return MODE.SLOPPY;
  } else {
    return MODE.NORMAL;
  }
}

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
