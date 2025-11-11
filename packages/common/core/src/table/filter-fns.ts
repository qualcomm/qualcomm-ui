// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterFn} from "./features/filters"

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
  | "weakEquals"

export const filterFns: Record<BuiltInFilterFn, FilterFn<any>> = {
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  equalsString,
  includesString,
  includesStringSensitive,
  inNumberRange,
  weakEquals,
}

// Utils

function testFalsy(val: any) {
  return val === undefined || val === null || val === ""
}
