import { filterByVisibility } from "./by-visibility";
import { filterByNumberStyle } from "./by-number-style";
import { filterByStringStyle } from "./by-string-style";
import { getUniqLinks } from "./get-uniq-links";

export function filterLinks(
  links: HTMLAnchorElement[],
  targetLink: HTMLAnchorElement,
) {
  if (links.length <= 1) {
    return links;
  }

  let filteredLinks = filterByStringStyle(targetLink, links);
  console.debug("Filtered by string style:", filteredLinks);
  filteredLinks = filterByNumberStyle(targetLink, filteredLinks);
  console.debug("Filtered by number style:", filteredLinks);
  filteredLinks = filterByVisibility(targetLink, filteredLinks);
  console.debug("Filtered by visibility:", filteredLinks);
  filteredLinks = getUniqLinks(filteredLinks);
  console.debug("Unique links:", filteredLinks);
  return filteredLinks;
}
