import { MODE } from "../lib/type";
import { getFullSelector } from "./selector/full";
import { getSimpleSelector } from "./selector/simple";
import { queryElementsFromDocument } from "./query/from-document";
import { queryElementsStrict } from "./query/strict";

function getHandler(mode: MODE) {
  return {
    NORMAL: {
      getSelector: getFullSelector,
      query: queryElementsFromDocument,
    },
    STRICT: {
      getSelector: getFullSelector,
      query: queryElementsStrict,
    },
    FLEXIBLE: {
      getSelector: getSimpleSelector,
      query: queryElementsFromDocument,
    },
  }[mode];
}

export function getSimilarLinks(targetLink: HTMLAnchorElement, mode: MODE) {
  console.debug(`Executing in mode`, mode);
  const handler = getHandler(mode);
  const selector = handler.getSelector(targetLink);
  console.debug(`Generated selector:`, selector);
  const links = handler.query(targetLink, selector);
  console.debug(`Found similar links:`, links);
  return links;
}
