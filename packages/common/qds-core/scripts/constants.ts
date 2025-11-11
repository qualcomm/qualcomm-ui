const omittedPrefixes: (string | RegExp)[] = [
  "qc",
  "dw",
  "sd",
  "primary",
  "secondary",
  "medium",
  "light",
  "dark",
  "spacing-number",
  "base-opacity",
  "color-support",
  "color-accent",
  // omit the palette categories, but keep the semantic colors like
  // `color-category-1-strong`
  /color-category-\w+-\d+/,
  "color-brand",
  "color-grey",
  "color-opacity",
  "measurements",
  "type-dynamic",
  "opacity",
]

/**
 * Runs before the final output after all variables have been resolved.
 * We use this to omit unused collections, like the numbered color palette, from the
 * final output.
 */
export const omittedPrefixRegexp = new RegExp(
  `^(${omittedPrefixes.map((p) => (typeof p === "string" ? p : p.source)).join("|")})`,
)
