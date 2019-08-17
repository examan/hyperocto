import { filterByDimension } from "./by-dimension";
import { filterByStringStyle } from "./by-string-style";
import { filterByNumberStyle } from "./by-number-style";

export function filterElements(
  links: HTMLAnchorElement[],
  targetLink: HTMLAnchorElement
): HTMLAnchorElement[] {
  if (links.length <= 1) {
    return links;
  }

  let filterdLinks = filterByStringStyle(targetLink, links);
  filterdLinks = filterByNumberStyle(targetLink, filterdLinks);
  return filterByDimension(targetLink, filterdLinks);
}
