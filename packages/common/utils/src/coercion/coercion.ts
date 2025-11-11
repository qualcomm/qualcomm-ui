/**
 * Coerces a value to its css pixel value.  If the value contains non-numeric
 * characters, its raw value is returned instead.
 *
 * @param value
 */
export function coercePixelProperty(value: string | number): string {
  // default number-ish values to px
  return typeof value === "number" || /^\d+$/.test(value) ? `${value}px` : value
}

export type NumberInput = string | number | null | undefined
export type Numberish = number | string | null | undefined

/**
 * Coerces a data-bound value (typically a string) to a number.
 */
export function coerceNumberProperty(value: any): number
export function coerceNumberProperty<D>(value: any, fallback: D): number | D

export function coerceNumberProperty(value: any, fallbackValue = 0) {
  return _isNumberValue(value) ? Number(value) : fallbackValue
}

/**
 * Whether the provided value is considered a number.
 */
function _isNumberValue(value: any): boolean {
  // parseFloat(value) handles most of the cases we're interested in (it treats
  // null, empty string, and other non-number values as NaN, where Number just uses
  // 0) but it considers the string '123hello' to be a valid number. Therefore we
  // also check if Number(value) is NaN.
  return !isNaN(parseFloat(value)) && !isNaN(Number(value))
}

/**
 * Mimics the browser's boolean coercion with React-specific support for null and
 * undefined.
 *
 * @example
 * ```jsx
 * {/* the following examples evaluate to true *\/}
 * <div property></div>
 * <div property="true"></div>
 *
 * {/* the following examples evaluate to false *\/}
 * <div property="false"></div>
 * <div property={false}></div>
 * <div property={undefined}></div>
 * <div property={null}></div>
 */
export type Booleanish = boolean | "true" | "false" | "" | undefined
