// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type DateFilterPreset,
  type DateFilterValue,
  isEmptyDateFilterValue,
  resolveDateFilterPreset,
  type ResolveDateFilterPresetOptions,
} from "@qualcomm-ui/core/filters"

import type {FilterFn} from "./features/filters.js"
import {warnOnce} from "./internal-warn.js"

const includesString: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: string,
) => {
  const search = filterValue.toLowerCase()
  return Boolean(
    row
      .getValue<string | null>(columnId)
      ?.toString()
      ?.toLowerCase()
      ?.includes(search),
  )
}

includesString.autoRemove = (val: any) => testFalsy(val)

const includesStringSensitive: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: string,
) => {
  return Boolean(
    row.getValue<string | null>(columnId)?.toString()?.includes(filterValue),
  )
}

includesStringSensitive.autoRemove = (val: any) => testFalsy(val)

const equalsString: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: string,
) => {
  return (
    row.getValue<string | null>(columnId)?.toString()?.toLowerCase() ===
    filterValue?.toLowerCase()
  )
}

equalsString.autoRemove = (val: any) => testFalsy(val)

const arrIncludes: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue<unknown[]>(columnId)?.includes(filterValue)
}

arrIncludes.autoRemove = (val: any) => testFalsy(val) || !val?.length

const arrIncludesAll: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: unknown[],
) => {
  return !filterValue.some(
    (val) => !row.getValue<unknown[]>(columnId)?.includes(val),
  )
}

arrIncludesAll.autoRemove = (val: any) => testFalsy(val) || !val?.length

const arrIncludesSome: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: unknown[],
) => {
  return filterValue.some((val) =>
    row.getValue<unknown[]>(columnId)?.includes(val),
  )
}

arrIncludesSome.autoRemove = (val: any) => testFalsy(val) || !val?.length

/**
 * Matches rows whose value is one of the filter values. Use for multi-value
 * filters on scalar columns. `arrIncludesSome` is not a substitute: it expects
 * an array row value, and on a string row value it performs substring
 * matching. Values are compared as strings, so string options from a filter
 * control match numeric or boolean row values.
 */
const includesValue: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: unknown[],
) => {
  const rowValue = String(row.getValue(columnId))
  return filterValue.some((value) => String(value) === rowValue)
}

includesValue.autoRemove = (val: any) => testFalsy(val) || !val?.length

const equals: FilterFn<any> = (row, columnId: string, filterValue: unknown) => {
  return row.getValue(columnId) === filterValue
}

equals.autoRemove = (val: any) => testFalsy(val)

const weakEquals: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: unknown,
) => {
  // eslint-disable-next-line eqeqeq
  return row.getValue(columnId) == filterValue
}

weakEquals.autoRemove = (val: any) => testFalsy(val)

const inNumberRange: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: [number, number],
) => {
  const [min, max] = filterValue

  const rowValue = row.getValue<number>(columnId)
  return rowValue >= min && rowValue <= max
}

inNumberRange.resolveFilterValue = (val: [any, any]) => {
  const [unsafeMin, unsafeMax] = val

  const parsedMin =
    typeof unsafeMin !== "number" ? parseFloat(unsafeMin as string) : unsafeMin
  const parsedMax =
    typeof unsafeMax !== "number" ? parseFloat(unsafeMax as string) : unsafeMax

  let min =
    unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin
  let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax

  if (min > max) {
    const temp = min
    min = max
    max = temp
  }

  return [min, max] as const
}

inNumberRange.autoRemove = (val: any) =>
  testFalsy(val) || (testFalsy(val[0]) && testFalsy(val[1]))

const DAY_MS = 24 * 60 * 60 * 1000
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Converts a row or filter date to epoch milliseconds. Date-only ISO strings
 * (`2026-11-01`) are read as local dates, not UTC midnight, so a range picked
 * in a date picker matches the dates the user sees.
 */
function toTime(value: unknown): number | undefined {
  if (value instanceof Date) {
    return value.getTime()
  }
  if (typeof value === "number") {
    return value
  }
  if (typeof value === "string" && value) {
    const dateOnly = DATE_ONLY.exec(value)
    const time = dateOnly
      ? new Date(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]).getTime()
      : Date.parse(value)
    return Number.isNaN(time) ? undefined : time
  }
  return undefined
}

/**
 * Resolves `[start, end]` to epoch milliseconds. A date-only end includes its
 * whole day. Missing bounds are unbounded.
 */
function resolveDateBounds(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
): [number, number] {
  const startTime = toTime(start) ?? -Infinity
  let endTime = toTime(end) ?? Infinity
  if (typeof end === "string" && DATE_ONLY.test(end)) {
    endTime += DAY_MS - 1
  }
  return [startTime, endTime]
}

/**
 * Matches rows whose date falls within `{range: [start, end]}`. Row values may
 * be `Date` objects, epoch milliseconds, or ISO 8601 strings. Preset values
 * need a filter function that knows the presets; see `createDateFilterFn`.
 */
const inDateRange: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: [number, number],
) => {
  const time = toTime(row.getValue(columnId))
  if (time === undefined) {
    return false
  }
  const [start, end] = filterValue
  return time >= start && time <= end
}

inDateRange.resolveFilterValue = (val: DateFilterValue) => {
  if ("range" in val) {
    return resolveDateBounds(...val.range)
  }
  warnOnce(
    `inDateRange-preset-${val.preset}`,
    `The date filter preset "${val.preset}" cannot be resolved by the built-in "inDateRange" filter function. Set the column's filterFn to createDateFilterFn(presets).`,
  )
  return [-Infinity, Infinity]
}

inDateRange.autoRemove = isEmptyDateFilterValue

/**
 * Creates a date filter function that resolves the given presets when
 * filtering runs, so relative presets such as "Last 7 days" stay relative to
 * the current date. Pass the same presets to the date filter's definition.
 */
export function createDateFilterFn(
  presets: DateFilterPreset[],
  options?: ResolveDateFilterPresetOptions,
): FilterFn<any> {
  const filterFn: FilterFn<any> = (row, columnId, filterValue, addMeta) =>
    inDateRange(row, columnId, filterValue, addMeta)

  filterFn.resolveFilterValue = (val: DateFilterValue) => {
    if ("range" in val) {
      return resolveDateBounds(...val.range)
    }
    const preset = presets.find((preset) => preset.value === val.preset)
    if (!preset) {
      warnOnce(
        `createDateFilterFn-preset-${val.preset}`,
        `The date filter preset "${val.preset}" is not one of the presets passed to createDateFilterFn.`,
      )
      return [-Infinity, Infinity]
    }
    return resolveDateBounds(...resolveDateFilterPreset(preset, options))
  }

  filterFn.autoRemove = isEmptyDateFilterValue

  return filterFn
}

// Export

export type BuiltInFilterFn =
  | "arrIncludes"
  | "arrIncludesAll"
  | "arrIncludesSome"
  | "equals"
  | "equalsString"
  | "inNumberRange"
  | "includesString"
  | "includesStringSensitive"
  | "inDateRange"
  | "includesValue"
  | "weakEquals"

export const filterFns: Record<BuiltInFilterFn, FilterFn<any>> = {
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  equalsString,
  includesString,
  includesStringSensitive,
  includesValue,
  inDateRange,
  inNumberRange,
  weakEquals,
}

// Utils

function testFalsy(val: any) {
  return val === undefined || val === null || val === ""
}
