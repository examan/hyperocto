import { getUniqLinks } from "../get-uniq-links";
import { queryElements } from "./query-elements";

function isDisplay(element: HTMLElement, displayName: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return window
    .getComputedStyle(element)
    .display.split(" ")
    .includes(displayName);
}

function isTableRow(element: HTMLElement): boolean {
  return isDisplay(element, "table-row");
}

function isTable(element: HTMLElement): boolean {
  return isDisplay(element, "table");
}

export function strictQueryElements(
  targetLink: HTMLAnchorElement,
  selector: string,
): HTMLAnchorElement[] {
  let element: HTMLElement | null = targetLink;
  let findTable = false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  while ((element = element.parentElement) !== null) {
    const elements = queryElements(element, selector, targetLink);
    if (element.parentElement === null) {
      return elements;
    } else if (findTable) {
      if (isTable(element)) {
        return elements;
      }
      continue;
    } else if (getUniqLinks(elements).length > 1) {
      if (isTableRow(element)) {
        findTable = true;
        continue;
      }
      return elements;
    }
  }

  // dummy return
  return [];
}
