import { filterLinks } from "./filter/filter";

export function queryElements(
  parent: Document | Element,
  selector: string,
  targetLink: HTMLAnchorElement,
): HTMLAnchorElement[] {
  console.debug("Querying elements from:", parent);
  const links = Array.from<HTMLAnchorElement>(
    parent.querySelectorAll(selector),
  );
  return filterLinks(links, targetLink);
}
