import { SIMILAR_NUMBER_STYLE } from "../../../lib/constant";
import { filterAndPassItself } from "./filter-and-pass-itself";

type MATH_METHOD_TYPE = "min" | "max";

function getNumberStyleIdentity(targetLink: HTMLAnchorElement): string {
  const elements = [
    targetLink,
    ...Array.from(targetLink.getElementsByTagName("*"))
  ];
  const stylesMap = elements.reduce(
    (map: Map<string, number>, element: Element): Map<string, number> => {
      const elementStyles = window.getComputedStyle(element);
      for (const styleName of SIMILAR_NUMBER_STYLE) {
        const elementStyle = elementStyles[styleName];
        for (const mathMethodName of ["min", "max"] as MATH_METHOD_TYPE[]) {
          const mathMethod = Math[mathMethodName];
          const initialValue = mathMethodName === "max" ? 0 : Infinity;
          const mapKey = mathMethodName + styleName;
          const previousValue = map.has(mapKey)
            ? map.get(mapKey)! // eslint-disable-line @typescript-eslint/no-non-null-assertion
            : initialValue;
          const newValue = mathMethod(
            parseInt(elementStyle, 10),
            previousValue
          );
          map.set(mapKey, newValue);
        }
      }
      return map;
    },
    new Map<string, number>()
  );
  return Array.from(stylesMap.values()).join(",");
}

export function filterByNumberStyle(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[]
): HTMLAnchorElement[] {
  const targetLinkNumStyleId = getNumberStyleIdentity(targetLink);
  return filterAndPassItself(
    targetLink,
    links,
    (link: HTMLAnchorElement): boolean =>
      getNumberStyleIdentity(link) === targetLinkNumStyleId
  );
  window;
}
