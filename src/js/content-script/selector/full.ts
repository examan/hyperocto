import { URI_SCHEME_FILTER_SELECTOR } from "./uri-scheme-filter";

function getPathElements(targetElement: HTMLAnchorElement): HTMLElement[] {
  let element: HTMLElement = targetElement;
  const elements = [element];
  while ((element = element.parentElement as HTMLElement)) {
    elements.unshift(element);
  }
  return elements;
}

export function getFullSelector(targetLink: HTMLAnchorElement): string {
  const elements = getPathElements(targetLink);
  const pathSelector = elements
    .map(({ tagName }: HTMLElement): string => tagName)
    .join(" > ");
  return `${pathSelector}${URI_SCHEME_FILTER_SELECTOR}`;
}
