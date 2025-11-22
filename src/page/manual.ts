document.addEventListener("DOMContentLoaded", (): void => {
  document.getElementById("version")!.textContent =
    chrome.runtime.getManifest().version;

  document.documentElement.lang = chrome.i18n.getUILanguage();

  document
    .querySelectorAll("[data-message]")
    .forEach((element: Element): void => {
      element.textContent = chrome.i18n.getMessage(
        (element as HTMLElement).dataset["message"]!,
      );
    });
});
