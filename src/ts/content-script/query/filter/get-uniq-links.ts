import * as R from "remeda";

export function getUniqLinks(links: HTMLAnchorElement[]) {
  return R.uniqueBy(links, R.prop("href"));
}
