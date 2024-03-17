import { SIMILAR_NUMBER_STYLE } from "../../../lib/constant";
import { filterAndPassItself } from "./filter-and-pass-itself";

const SIMILAR_NUMBER_STYLE_ENTRIES = Array.from(SIMILAR_NUMBER_STYLE.entries());

function getNumberStyleIdentity(targetLink: HTMLAnchorElement): string {
  const elements = [
    targetLink,
    ...Array.from(targetLink.getElementsByTagName("*")),
  ];

  const styleNumberMetrix = elements.reduce(
    (numberMetrix: number[][], element: Element): number[][] => {
      const styles = window.getComputedStyle(element);
      for (const [styleIndex, styleName] of SIMILAR_NUMBER_STYLE_ENTRIES) {
        const styleValue = styles[styleName];
        const styleNumber = parseInt(styleValue, 10);
        numberMetrix[styleIndex]!.push(styleNumber); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
      return numberMetrix;
    },
    new Array(SIMILAR_NUMBER_STYLE.length).fill(null).map((): number[] => []),
  );

  const styleNumbers = styleNumberMetrix.flatMap(
    (styleNumberArray: number[]): number[] =>
      [Math.max, Math.min].map(
        (mathMethod: (...values: number[]) => number): number =>
          mathMethod(...styleNumberArray),
      ),
  );

  return styleNumbers.join(",");
}

export function filterByNumberStyle(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[],
): HTMLAnchorElement[] {
  const targetLinkNumStyleId = getNumberStyleIdentity(targetLink);
  return filterAndPassItself(
    targetLink,
    links,
    (link: HTMLAnchorElement): boolean =>
      getNumberStyleIdentity(link) === targetLinkNumStyleId,
  );
}
