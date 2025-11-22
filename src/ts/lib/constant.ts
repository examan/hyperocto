/**
 * Available modes for finding similar links.
 * - NORMAL: Uses full path selector with standard query from document
 * - STRICT: Uses full path selector with strict query (within same container)
 * - FLEXIBLE: Uses simple tag selector to match all similar elements
 */
export const MODE_VALUES = ["NORMAL", "STRICT", "FLEXIBLE"] as const;

/**
 * CSS properties used to determine if links have similar string-based styles.
 * These properties are compared as exact string matches.
 */
export const SIMILAR_STRING_STYLE = ["fontFamily", "display"] as const;

/**
 * CSS properties used to determine if links have similar numeric styles.
 * These properties are compared with tolerance for small differences.
 */
export const SIMILAR_NUMBER_STYLE = ["fontSize", "lineHeight"] as const;

/**
 * URI schemes to ignore when finding similar links.
 * Links with these schemes will be filtered out from results.
 */
export const IGNORE_URI_SCHEME = [
  "about",
  "brave",
  "chrome-extension",
  "chrome",
  "devtools",
  "edge",
  "javascript",
  "magnet",
  "mailto",
  "moz-extension",
  "ms-browser-extension",
  "opera",
  "safari-extension",
  "sms",
  "tel",
  "urn",
  "vivaldi",
] as const;

/**
 * Threshold for confirming tab creation.
 * If the number of links to open exceeds this value, user confirmation is required.
 */
export const THRESHOLD_TAB_CREATE_CONFIRM = 16;
