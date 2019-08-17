import { filterElements } from "./filter/filter";

export function queryElements(
  parent: Element | Document,
  selector: string,
  targetLink: HTMLAnchorElement
): HTMLAnchorElement[] {
  const elements = Array.from<HTMLAnchorElement>(
    parent.querySelectorAll(selector)
  );

  return filterElements(elements, targetLink);
}
