import { MODE } from "./enums";

const URI_SCHEME_FILTER_SELECTOR = ["about", "chrome", "opera", "javascript"]
  .map((uriScheme): string => `:not([href^='${uriScheme}:'])`)
  .join("");

function getPathElements(targetElement: HTMLAnchorElement): HTMLElement[] {
  let element: HTMLElement = targetElement;
  const elements = [element];
  while ((element = element.parentElement)) {
    elements.unshift(element);
  }
  return elements;
}

function hasClientRects(element: HTMLElement): boolean {
  return Boolean(element.getClientRects().length);
}

function getFullSelector(targetLink: HTMLAnchorElement): string {
  const elements = getPathElements(targetLink);
  const pathSelector = elements
    .map((element): string => element.tagName)
    .join(" > ");
  return `${pathSelector}${URI_SCHEME_FILTER_SELECTOR}`;
}

function getSimpleSelector(): string {
  return `a${URI_SCHEME_FILTER_SELECTOR}`;
}

function getNumberStyleIdentity(targetLink: HTMLAnchorElement): string {
  const elements = [
    targetLink,
    ...Array.from(targetLink.getElementsByTagName("*"))
  ];

  const stylesMap = elements.reduce((map, element: Element): Map<
    string,
    number
  > => {
    for (const mathMethodName of ["min", "max"]) {
      for (const style of ["fontSize", "lineHeight"]) {
        const name = mathMethodName + style;
        const initialValue = mathMethodName === "max" ? 0 : Infinity;
        const previousValue = map.get(name) || initialValue;
        const mathMethod = Math[mathMethodName];
        const elementStyle = window.getComputedStyle(element)[style];
        const newValue = mathMethod(parseInt(elementStyle, 10), previousValue);
        map.set(name, newValue);
      }
    }
    return map;
  }, new Map<string, number>());

  return Array.from(stylesMap.values()).join(",");
}

function filterElements(
  links: HTMLAnchorElement[],
  targetLink: HTMLAnchorElement
): HTMLAnchorElement[] {
  if (links.length <= 1) {
    return links;
  }

  const isTargetLink = (link: HTMLAnchorElement): boolean =>
    link === targetLink;

  const targetLinkStyle = window.getComputedStyle(targetLink);
  const targetLinkNumStyleId = getNumberStyleIdentity(targetLink);

  return links
    .filter((link): boolean => {
      if (isTargetLink(link)) {
        return true;
      }

      // filter similar string style element
      const linkStyle = window.getComputedStyle(link);
      return ["fontFamily", "display"].every(
        (styleName): boolean =>
          linkStyle[styleName] === targetLinkStyle[styleName]
      );
    })
    .filter((link): boolean => {
      if (isTargetLink(link)) {
        return true;
      }

      // filter similar number style element
      return getNumberStyleIdentity(link) === targetLinkNumStyleId;
    })
    .filter((link): boolean => {
      if (isTargetLink(link)) {
        return true;
      }

      // filter out zero-dimensioned element
      if (hasClientRects(link)) {
        return true;
      }
      const descendents = Array.from(
        link.getElementsByTagName("*")
      ) as HTMLElement[];
      return descendents.some(hasClientRects);
    });
}

function queryElements(
  parent: Element | Document,
  selector: string,
  targetLink: HTMLAnchorElement
): HTMLAnchorElement[] {
  const elements = Array.from(
    parent.querySelectorAll(selector)
  ) as HTMLAnchorElement[];
  return filterElements(elements, targetLink);
}

function queryElementsFromDocument(
  targetLink: HTMLAnchorElement,
  selector: string
): HTMLAnchorElement[] {
  return queryElements(document, selector, targetLink);
}

function isDisplay(element: HTMLElement, displayName: string): boolean {
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

function strictQuertElements(
  targetLink: HTMLAnchorElement,
  selector: string
): HTMLAnchorElement[] {
  let element: HTMLElement = targetLink;
  let findTable = false;

  while ((element = element.parentElement)) {
    const elements = queryElements(element, selector, targetLink);

    if (!element.parentElement) {
      return elements;
    } else if (findTable) {
      if (isTable(element)) {
        return elements;
      } else {
        continue;
      }
    } else if (elements.length > 1) {
      if (isTableRow(element)) {
        findTable = true;
        continue;
      }
      return elements;
    }
  }
}

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
      query: strictQuertElements
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
