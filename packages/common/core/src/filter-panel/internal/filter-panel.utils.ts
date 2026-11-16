// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isEqual} from "@qualcomm-ui/utils/equal"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

import type {
  FilterPanelApiProps,
  FilterPanelFilter,
  FilterPanelFilterType,
  FilterPanelValue,
} from "../filter-panel.types.js"

type IsEmptyValue = FilterPanelApiProps["isEmptyValue"]

export interface FilterPanelFilterUpdate {
  id: string
  type?: FilterPanelFilterType | undefined
  value: ValueOrFn<unknown>
}

/**
 * A value is empty when it carries no filtering intent, or when the consumer's
 * `isEmptyValue` check rejects it. The built-in check always applies so that,
 * for example, an unchecked checkbox group (`[]`) is never counted or
 * committed.
 */
export function isEmptyFilterValue(
  isEmptyValue: IsEmptyValue,
  filter: FilterPanelFilter,
): boolean {
  const {value} = filter
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return true
  }
  return !!isEmptyValue?.(filter)
}

export function getFilterValue(filters: FilterPanelValue, id: string): unknown {
  return filters.find((filter) => filter.id === id)?.value
}

/**
 * Writes a filter value. An update without a `type` keeps the existing
 * filter's type, so a write from outside the filter control (for example,
 * removing one value from a chip) does not change how the filter is applied.
 */
export function setFilterValue(
  isEmptyValue: IsEmptyValue,
  filters: FilterPanelValue,
  update: FilterPanelFilterUpdate,
): FilterPanelValue {
  const {id, value: updater} = update
  const previous = filters.find((filter) => filter.id === id)
  const value =
    typeof updater === "function"
      ? (updater as (prev: unknown) => unknown)(previous?.value)
      : updater
  const type = update.type ?? previous?.type
  const next: FilterPanelFilter = type ? {id, type, value} : {id, value}

  if (isEmptyFilterValue(isEmptyValue, next)) {
    return filters.filter((filter) => filter.id !== id)
  }
  if (previous) {
    return filters.map((filter) => (filter.id === id ? next : filter))
  }
  return [...filters, next]
}

export function getNonEmptyFilters(
  isEmptyValue: IsEmptyValue,
  filters: FilterPanelValue,
): FilterPanelValue {
  return filters.filter((filter) => !isEmptyFilterValue(isEmptyValue, filter))
}

export function countFilters(
  isEmptyValue: IsEmptyValue,
  filters: FilterPanelValue,
): number {
  return new Set(
    getNonEmptyFilters(isEmptyValue, filters).map((filter) => filter.id),
  ).size
}

/**
 * Compares filter states by id, type, and value, ignoring order and empty
 * entries.
 */
export function areFiltersEqual(
  isEmptyValue: IsEmptyValue,
  a: FilterPanelValue,
  b: FilterPanelValue,
): boolean {
  const left = getNonEmptyFilters(isEmptyValue, a)
  const right = getNonEmptyFilters(isEmptyValue, b)
  if (left.length !== right.length) {
    return false
  }
  return left.every((filter) =>
    right.some(
      (other) =>
        other.id === filter.id &&
        other.type === filter.type &&
        isEqual(other.value, filter.value),
    ),
  )
}

export function stringifyFilterValue(value: unknown): string {
  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
    ? String(value)
    : ""
}
