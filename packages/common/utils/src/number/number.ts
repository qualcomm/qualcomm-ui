// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

const {abs, floor, max, min, pow, round, sign} = Math

export function isNaN(v: number): boolean {
  return Number.isNaN(v)
}

export function nan(v: number): number {
  return isNaN(v) ? 0 : v
}

/**
 * Computes the modulus, ensuring a non-negative result for the operation.
 *
 * @param v - The dividend in the modulus operation.
 * @param m - The divisor in the modulus operation.
 * @returns The result of the modulus operation, always non-negative.
 */
export function mod(v: number, m: number): number {
  return ((v % m) + m) % m
}

/**
 * Wraps a given number within the range of 0 (inclusive) and vmax (exclusive).
 * Ensures the number cycles within the range by handling negative and overflow
 * values.
 *
 * @param v - The number to be wrapped.
 * @param vmax - The maximum boundary value of the range (exclusive).
 * @returns The wrapped number within the range [0, vmax).
 */
export function wrap(v: number, vmax: number): number {
  return ((v % vmax) + vmax) % vmax
}

export function getMinValueAtIndex(
  i: number,
  v: number[],
  vmin: number,
): number {
  return i === 0 ? vmin : v[i - 1]
}

export function getMaxValueAtIndex(
  i: number,
  v: number[],
  vmax: number,
): number {
  return i === v.length - 1 ? vmax : v[i + 1]
}

export function isValueAtMax(v: number, vmax: number): boolean {
  return nan(v) >= vmax
}

export function isValueAtMin(v: number, vmin: number): boolean {
  return nan(v) <= vmin
}

export function isValueWithinRange(
  v: number,
  vmin: number | null | undefined,
  vmax: number | null | undefined,
): boolean {
  const value = nan(v)
  const minCheck = vmin == null || value >= vmin
  const maxCheck = vmax == null || value <= vmax
  return minCheck && maxCheck
}

export function roundValue(v: number, vmin: number, step: number): number {
  return round((nan(v) - vmin) / step) * step + vmin
}

/**
 * Clamps a given number within the inclusive range specified by the minimum and
 * maximum values. If the input is not a valid number, it will be treated as NaN.
 *
 * @param v - The value to clamp.
 * @param vmin - The minimum allowable value.
 * @param vmax - The maximum allowable value.
 * @returns Returns the clamped value within the range [vmin, vmax].
 */
export function clampValue(v: number, vmin: number, vmax: number): number {
  return min(max(nan(v), vmin), vmax)
}

/**
 * Clamps the given number within the range of 0 to 1, ensuring the value is treated
 * as a percentage.
 *
 * @param v The value to be clamped within the range [0, 1].
 * @returns The clamped value, restricted to the range [0, 1].
 */
export function clampPercent(v: number): number {
  return clampValue(v, 0, 1)
}

/**
 * Calculates the percentage representation of a value within a range, clamps it
 * between 0 and 100, and rounds it to the specified precision.
 *
 * @param {number} v - The value to calculate the percentage for.
 * @param {number} vmin - The minimum value of the range.
 * @param {number} vmax - The maximum value of the range.
 * @param {number} precision - The number of decimal places to round the result to.
 * @returns The percentage representation of the value, rounded and clamped between 0 and 100.
 */
export function getRoundedValuePercent(
  v: number,
  vmin: number,
  vmax: number,
  precision: number,
): number {
  const valuePercent = getValuePercent(v, vmin, vmax) * 100
  const clamped = clampValue(valuePercent, 0, 100)
  return Number(clamped.toFixed(precision))
}

export function getValuePercent(v: number, vmin: number, vmax: number): number {
  return (nan(v) - vmin) / (vmax - vmin)
}

/**
 * Calculates a percentage-based value within a specified range, ensuring the result
 * adheres to a specified step.
 *
 * @param p - The percentage value (between 0 and 1) to be converted.
 * @param vmin - The minimum value of the range.
 * @param vmax - The maximum value of the range.
 * @param step - The step size to round the result to.
 * @returns The calculated value within the specified range, rounded to the closest step and clamped between vmin and vmax.
 */
export function getPercentValue(
  p: number,
  vmin: number,
  vmax: number,
  step: number,
): number {
  return clampValue(
    roundValue(p * (vmax - vmin) + vmin, vmin, step),
    vmin,
    vmax,
  )
}

export function roundToStepPrecision(v: number, step: number): number {
  let rv = v
  const ss = step.toString()
  const pi = ss.indexOf(".")
  const p = pi >= 0 ? ss.length - pi : 0
  if (p > 0) {
    const pw = pow(10, p)
    rv = round(rv * pw) / pw
  }
  return rv
}

export function roundToDpr(v: number, dpr: unknown): number {
  return typeof dpr === "number" ? floor(v * dpr + 0.5) / dpr : round(v)
}

export function snapValueToStep(
  v: number,
  vmin: number | undefined,
  vmax: number | undefined,
  step: number,
): number {
  const min = vmin != null ? Number(vmin) : 0
  const max = Number(vmax)

  // Snap to nearest step
  const remainder = (v - min) % step
  let snapped =
    abs(remainder) * 2 >= step
      ? v + sign(remainder) * (step - abs(remainder))
      : v - remainder

  snapped = roundToStepPrecision(snapped, step)

  // Clamp to bounds
  if (!isNaN(min) && snapped < min) {
    snapped = min
  } else if (!isNaN(max) && snapped > max) {
    const stepsInRange = floor((max - min) / step)
    const largestValidStep = min + stepsInRange * step
    snapped =
      stepsInRange <= 0 || largestValidStep < min ? max : largestValidStep
  }

  return roundToStepPrecision(snapped, step)
}

export function setValueAtIndex<T>(vs: T[], i: number, v: T): T[] {
  if (vs[i] === v) {
    return vs
  }
  return [...vs.slice(0, i), v, ...vs.slice(i + 1)]
}

interface RangeContext {
  max: number
  min: number
  step: number
  values: number[]
}

export function getValueSetterAtIndex(index: number, ctx: RangeContext) {
  const minValueAtIndex = getMinValueAtIndex(index, ctx.values, ctx.min)
  const maxValueAtIndex = getMaxValueAtIndex(index, ctx.values, ctx.max)
  let nextValues = ctx.values.slice()

  return function setValue(value: number): number[] {
    const nextValue = snapValueToStep(
      value,
      minValueAtIndex,
      maxValueAtIndex,
      ctx.step,
    )
    nextValues = setValueAtIndex(nextValues, index, value)
    nextValues[index] = nextValue
    return nextValues
  }
}

export function getNextStepValue(index: number, ctx: RangeContext): number[] {
  const nextValue = ctx.values[index] + ctx.step
  return getValueSetterAtIndex(index, ctx)(nextValue)
}

export function getPreviousStepValue(
  index: number,
  ctx: RangeContext,
): number[] {
  const nextValue = ctx.values[index] - ctx.step
  return getValueSetterAtIndex(index, ctx)(nextValue)
}

export function getClosestValueIndex(vs: number[], t: number): number {
  const i = vs.findIndex((v) => t - v < 0)
  if (i === 0) {
    return i
  }
  if (i === -1) {
    return vs.length - 1
  }
  const vLeft = vs[i - 1]
  const vRight = vs[i]
  if (abs(vLeft - t) < abs(vRight - t)) {
    return i - 1
  }
  return i
}

export function getClosestValue(vs: number[], t: number): number {
  return vs[getClosestValueIndex(vs, t)]
}

export function getValueRanges(
  vs: number[],
  vmin: number,
  vmax: number,
  gap: number,
): {max: number; min: number; value: number}[] {
  return vs.map((v, i) => ({
    max: i === vs.length - 1 ? vmax : vs[i + 1] - gap,
    min: i === 0 ? vmin : vs[i - 1] + gap,
    value: v,
  }))
}

export function getValueTransformer(
  va: number[],
  vb: number[],
): (v: number) => number {
  const [a, b] = va
  const [c, d] = vb
  return (v: number) =>
    a === b || c === d ? c : c + ((d - c) / (b - a)) * (v - a)
}

export function toFixedNumber(v: number, d = 0, b = 10): number {
  const pow = Math.pow(b, d)
  return round(v * pow) / pow
}

function countDecimals(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }
  let e = 1,
    p = 0
  while (Math.round(value * e) / e !== value) {
    e *= 10
    p += 1
  }
  return p
}

function decimalOp(a: number, op: "-" | "+", b: number): number {
  let result = op === "+" ? a + b : a - b
  if (a % 1 !== 0 || b % 1 !== 0) {
    const multiplier = 10 ** Math.max(countDecimals(a), countDecimals(b))
    a = Math.round(a * multiplier)
    b = Math.round(b * multiplier)
    result = op === "+" ? a + b : a - b
    result /= multiplier
  }
  return result
}

export function incrementValue(v: number, s: number): number {
  return decimalOp(nan(v), "+", s)
}

export function decrementValue(v: number, s: number): number {
  return decimalOp(nan(v), "-", s)
}

export function toPx(v: number | undefined): string | undefined {
  return v != null ? `${v}px` : undefined
}
