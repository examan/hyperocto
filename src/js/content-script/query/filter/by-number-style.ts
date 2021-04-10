import { SIMILAR_NUMBER_STYLE } from "../../../lib/constant";
import { filterAndPassItself } from "./filter-and-pass-itself";

const SIMILAR_NUMBER_STYLE_ENTRIES = Array.from(SIMILAR_NUMBER_STYLE.entries());

function getNumberStyleIdentity(targetLink: HTMLAnchorElement): string {
  const elements = [
    targetLink,
    ...Array.from(targetLink.getElementsByTagName("*"))
  ];

  const styleNumbers = elements.reduce(
    (numbers: number[], element: Element): number[] => {
      const cloneNumbers = [...numbers];
      const styles = window.getComputedStyle(element);
      for (const [styleIndex, styleName] of SIMILAR_NUMBER_STYLE_ENTRIES) {
        const styleValue = styles[styleName];
        const styleNumber = parseInt(styleValue, 10);
        cloneNumbers[styleIndex] = Math.max(
          styleNumber,
          cloneNumbers[styleIndex]
        );
      }
      return cloneNumbers;
    },
    [...Array(SIMILAR_NUMBER_STYLE.length)].fill(0)
  );

  return styleNumbers.join(",");
}

export function filterByNumberStyle(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[]
): HTMLAnchorElement[] {
  const targetLinkNumStyleId = getNumberStyleIdentity(targetLink);
  return filterAndPassItself(
    targetLink,
    links,
    (link: HTMLAnchorElement): boolean =>
      getNumberStyleIdentity(link) === targetLinkNumStyleId
  );
  window;
}
