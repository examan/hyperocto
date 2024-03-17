import { queryElements } from "./query-elements";

export function queryElementsFromDocument(
  targetLink: HTMLAnchorElement,
  selector: string,
): HTMLAnchorElement[] {
  return queryElements(document, selector, targetLink);
}
