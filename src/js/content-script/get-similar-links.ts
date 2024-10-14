import { MODE } from "../lib/enums";
import { getFullSelector } from "./selector/full";
import { getSimpleSelector } from "./selector/simple";
import { queryElementsFromDocument } from "./query/from-document";
import { strictQueryElements } from "./query/strict";

function getHandler(mode: MODE): {
  getSelector: (targetLink: HTMLAnchorElement) => string;
  query: (
    targetLink: HTMLAnchorElement,
    selector: string,
  ) => HTMLAnchorElement[];
} {
  return {
    [MODE.NORMAL]: {
      getSelector: getFullSelector,
      query: queryElementsFromDocument,
    },
    [MODE.STRICT]: {
      getSelector: getFullSelector,
      query: strictQueryElements,
    },
    [MODE.SLOPPY]: {
      getSelector: getSimpleSelector,
      query: queryElementsFromDocument,
    },
  }[mode];
}

export function getSimilarLinks(
  targetLink: HTMLAnchorElement,
  mode: MODE,
): HTMLAnchorElement[] {
  console.debug(`Executing in mode`, MODE[mode]);
  const handler = getHandler(mode);
  const selector = handler.getSelector(targetLink);
  console.debug(`Generated selector:`, selector);
  const links = handler.query(targetLink, selector);
  console.debug(`Found similar links:`, links);
  return links;
}
