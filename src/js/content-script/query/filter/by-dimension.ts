import { filterAndPassItself } from "./filter-and-pass-itself";

export function filterByDimension(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[]
): HTMLAnchorElement[] {
  return filterAndPassItself(
    targetLink,
    links,
    (link: HTMLAnchorElement): boolean => Boolean(link.getClientRects().length)
  );
}
