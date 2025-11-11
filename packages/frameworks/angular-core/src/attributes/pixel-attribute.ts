/**
 * Coerces a string or number to a pixel value. Returns the value as-is if it
 * doesn't match a number-ish format.
 */
export function pixelAttribute(value: string | number): string {
  return typeof value === "number" || /^\d+$/.test(value) ? `${value}px` : value
}
