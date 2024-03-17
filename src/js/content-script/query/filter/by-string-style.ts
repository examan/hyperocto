import { SIMILAR_STRING_STYLE } from "../../../lib/constant";
import { filterAndPassItself } from "./filter-and-pass-itself";

export function filterByStringStyle(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[],
): HTMLAnchorElement[] {
  const targetLinkStyle = window.getComputedStyle(targetLink);
  return filterAndPassItself(
    targetLink,
    links,
    (link: HTMLAnchorElement): boolean => {
      const linkStyle = window.getComputedStyle(link);
      return SIMILAR_STRING_STYLE.every(
        (styleName: keyof CSSStyleDeclaration): boolean =>
          linkStyle[styleName] === targetLinkStyle[styleName],
      );
    },
  );
}
