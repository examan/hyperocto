import { queryElements as queryLinks } from "./query-elements";
import * as R from "remeda";

function includesDisplay(displays: string[], value: string) {
  return displays.includes(value);
}

function getDisplays(element: HTMLElement) {
  return window.getComputedStyle(element).display.split(" ");
}

function isTableDisplay(element: HTMLElement) {
  const displays = getDisplays(element);

  return [
    "table",
    "table-header-group",
    "table-row-group",
    "table-footer-group",
  ].some(R.partialBind(includesDisplay, displays));
}

function isStructuralContainer(element: HTMLElement): boolean {
  return ["UL", "OL", "DL", "MAP"].includes(element.nodeName);
}

function isCollectionContainer(element: HTMLElement) {
  let nonContents: HTMLElement | null = element;
  while (
    nonContents !== null &&
    includesDisplay(getDisplays(nonContents), "contents")
  ) {
    nonContents = nonContents.parentElement;
  }

  return (
    nonContents !== null &&
    (isTableDisplay(nonContents) || isStructuralContainer(nonContents))
  );
}

export function queryElementsStrict(
  targetLink: HTMLAnchorElement,
  selector: string,
) {
  console.debug("Starting strict query from:", targetLink);

  let element: HTMLElement | null = targetLink;
  while ((element = element.parentElement) !== null) {
    const links = queryLinks(element, selector, targetLink);

    if (element.parentElement === null) {
      console.debug("Strict query ended at root");
      return links;
    }

    if (
      !isCollectionContainer(element) &&
      isCollectionContainer(element.parentElement)
    ) {
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
