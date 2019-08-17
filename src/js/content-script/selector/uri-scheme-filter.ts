import { IGNORE_URI_SCHEME } from "../../lib/constant";

export const URI_SCHEME_FILTER_SELECTOR = IGNORE_URI_SCHEME.map(
  (uriScheme): string => `:not([href^='${uriScheme}:'])`
).join("");
