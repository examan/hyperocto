import type { MessageOpenlinks } from "../lib/type";

export function init(): void {
  chrome.runtime.onMessage.addListener(
    (
      { type, urls }: MessageOpenlinks,
      sender: chrome.runtime.MessageSender,
    ) => {
      if (type !== "OPEN-LINKS") {
        return;
      }

      urls.forEach((url: string, index: number): void => {
        setTimeout(
          (param: chrome.tabs.CreateProperties): void => {
            void chrome.tabs.create(param);
          },
          0,
          { active: false, index: sender.tab!.index + index + 1, url },
        );
      });
    },
  );
}
