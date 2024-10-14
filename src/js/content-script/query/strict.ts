import { queryElements as queryLinks } from "./query-elements";

function isDisplay(element: HTMLElement, displayName: string): boolean {
  return window
    .getComputedStyle(element)
    .display.split(" ")
    .includes(displayName);
}

function isCollection(element: HTMLElement): boolean {
  let nonContents: HTMLElement | null = element;
  for (
    ;
    nonContents !== null && isDisplay(nonContents, "contents");
    nonContents = nonContents.parentElement
  );

  return (
    nonContents !== null &&
    (isDisplay(nonContents, "table") ||
      isDisplay(nonContents, "table-header-group") ||
      isDisplay(nonContents, "table-row-group") ||
      isDisplay(nonContents, "table-footer-group") ||
      ["UL", "OL", "DL", "MAP"].includes(nonContents.nodeName))
  );
}

export function strictQueryElements(
  targetLink: HTMLAnchorElement,
  selector: string,
): HTMLAnchorElement[] {
  console.debug("Starting strict query from:", targetLink);

  let element: HTMLElement | null = targetLink;
  while ((element = element.parentElement) !== null) {
    const links = queryLinks(element, selector, targetLink);

    if (element.parentElement === null) {
      console.debug("Strict query ended at root");
      return links;
    }

    if (!isCollection(element) && isCollection(element.parentElement)) {
      console.debug("Skipped because children are in collection:", element);
      continue;
    }

    if (links.length > 1) {
      console.debug("Query ended with multiple links");
      return links;
    }

    console.debug("Continuing next query");
  }

  // dummy return
  return [];
}
