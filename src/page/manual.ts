import { BROWSER } from "../js/lib/browser";

document.addEventListener("DOMContentLoaded", (): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById(
    "version"
  )!.textContent = BROWSER.runtime.getManifest().version;

  document.documentElement.lang = BROWSER.i18n.getUILanguage();

  document
    .querySelectorAll("[data-message]")
    .forEach((element: Element): void => {
      element.textContent = BROWSER.i18n.getMessage(
        (element as HTMLElement).dataset.message! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
    });
});
