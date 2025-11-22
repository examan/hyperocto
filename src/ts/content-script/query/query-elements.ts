import { filterLinks } from "./filter/filter";

export function queryElements(
  parent: Document | Element,
  selector: string,
  targetLink: HTMLAnchorElement,
) {
  console.debug("Querying elements from:", parent);
  const links = Array.from(
    parent.querySelectorAll<HTMLAnchorElement>(selector),
  );
  return filterLinks(links, targetLink);
}
