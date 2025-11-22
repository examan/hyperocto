import * as R from "remeda";
import { URI_SCHEME_FILTER_SELECTOR } from "./uri-scheme-filter";

function getPathElements(targetElement: HTMLAnchorElement) {
  let element: HTMLElement | null = targetElement;
  const elements = [element];
  while ((element = element.parentElement) !== null) {
    elements.unshift(element);
  }
  return elements;
}

export function getFullSelector(targetLink: HTMLAnchorElement) {
  const elements = getPathElements(targetLink);
  const pathSelector = R.pipe(
    elements,
    R.map(R.prop("tagName")),
    R.join(" > "),
  );
  return `${pathSelector}${URI_SCHEME_FILTER_SELECTOR}` as const;
}
