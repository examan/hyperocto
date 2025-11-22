import { queryElements } from "./query-elements";

export function queryElementsFromDocument(
  targetLink: HTMLAnchorElement,
  selector: string,
) {
  return queryElements(document, selector, targetLink);
}
