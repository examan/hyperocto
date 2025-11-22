import { URI_SCHEME_FILTER_SELECTOR } from "./uri-scheme-filter";

export function getSimpleSelector() {
  return `a${URI_SCHEME_FILTER_SELECTOR}` as const;
}
