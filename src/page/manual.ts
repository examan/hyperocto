import { BROWSER } from "../js/browser";

document.addEventListener("DOMContentLoaded", (): void => {
  document.getElementById(
    "version"
  ).textContent = BROWSER.runtime.getManifest().version;

  document.documentElement.lang = BROWSER.i18n.getUILanguage();

  document
    .querySelectorAll("[data-message]")
    .forEach((element: HTMLElement): void => {
      element.textContent = BROWSER.i18n.getMessage(element.dataset.message);
    });
});
