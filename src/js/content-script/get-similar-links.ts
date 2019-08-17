import { MODE } from "../lib/enums";
import { getSimpleSelector } from "./selector/simple";
import { getFullSelector } from "./selector/full";
import { queryElementsFromDocument } from "./query/from-document";
import { strictQueryElements } from "./query/strict";

function getHandler(
  mode: MODE
): {
  getSelector: (targetLink: HTMLAnchorElement) => string;
  query: (
    targetLink: HTMLAnchorElement,
    selector: string
  ) => HTMLAnchorElement[];
} {
  return {
    [MODE.NORMAL]: {
      getSelector: getFullSelector,
      query: queryElementsFromDocument
    },
    [MODE.STRICT]: {
      getSelector: getFullSelector,
      query: strictQueryElements
    },
    [MODE.SLOPPY]: {
      getSelector: getSimpleSelector,
      query: queryElementsFromDocument
    }
  }[mode];
}

export function getSimilarLinks(
  targetLink: HTMLAnchorElement,
  mode: MODE
): HTMLAnchorElement[] {
  const handler = getHandler(mode);
  const selector = handler.getSelector(targetLink);
  return handler.query(targetLink, selector);
}
