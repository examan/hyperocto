import { SIMILAR_NUMBER_STYLE } from "../../../lib/constant";
import { filterAndPassItself } from "./filter-and-pass-itself";
import * as R from "remeda";

function getNumberStyleIdentity(targetLink: HTMLAnchorElement) {
  const styles = R.map(
    [targetLink, ...Array.from(targetLink.getElementsByTagName("*"))],
    (element) => window.getComputedStyle(element),
  );

  return R.pipe(
    SIMILAR_NUMBER_STYLE,
    R.flatMap((name) => {
      const values = R.pipe(
        styles,
        R.map(R.prop(name)),
        R.map(Number.parseFloat),
      );
      return [Math.max(...values), Math.min(...values)];
    }),
    R.join(","),
  );
}

export function filterByNumberStyle(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[],
) {
  const targetLinkNumStyleId = getNumberStyleIdentity(targetLink);
  return filterAndPassItself(
    targetLink,
    links,
    (link) => getNumberStyleIdentity(link) === targetLinkNumStyleId,
  );
}
