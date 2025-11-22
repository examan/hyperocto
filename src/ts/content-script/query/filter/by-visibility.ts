import { filterAndPassItself } from "./filter-and-pass-itself";

export function filterByVisibility(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[],
) {
  return filterAndPassItself(targetLink, links, (link) =>
    link.checkVisibility({ opacityProperty: true, visibilityProperty: true }),
  );
}
