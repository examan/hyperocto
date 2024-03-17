document.addEventListener("DOMContentLoaded", (): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById("version")!.textContent =
    chrome.runtime.getManifest().version;

  document.documentElement.lang = chrome.i18n.getUILanguage();

  document
    .querySelectorAll("[data-message]")
    .forEach((element: Element): void => {
      element.textContent = chrome.i18n.getMessage(
        (element as HTMLElement).dataset["message"]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
    });
});
