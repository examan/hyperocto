import * as R from "remeda";

export function filterAndPassItself(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[],
  callbackfn: (value: HTMLAnchorElement) => boolean,
) {
  return R.filter(links, R.anyPass([R.isStrictEqual(targetLink), callbackfn]));
}
