import { IGNORE_URI_SCHEME } from "../../lib/constant";
import * as R from "remeda";

export const URI_SCHEME_FILTER_SELECTOR = R.pipe(
  IGNORE_URI_SCHEME,
  R.map((uriScheme) => `:not([href^='${uriScheme}:'])`),
  R.join(""),
);
