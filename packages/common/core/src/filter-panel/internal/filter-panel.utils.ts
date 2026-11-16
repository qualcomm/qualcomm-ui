// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isEqual} from "@qualcomm-ui/utils/equal"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

import type {
  FilterPanelApiProps,
  FilterPanelValue,
} from "../filter-panel.types.js"

type IsEmptyValue = FilterPanelApiProps["isEmptyValue"]

/**
 * A value is empty when it carries no filtering intent, or when the consumer's
 * `isEmptyValue` check rejects it. The built-in check always applies so that,
 * for example, an unchecked checkbox group (`[]`) is never counted or
 * committed.
 */
export function isEmptyFilterValue(
  isEmptyValue: IsEmptyValue,
  id: string,
  value: unknown,
): boolean {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return true
  }
  return !!isEmptyValue?.(id, value)
}

export function getFilterValue(filters: FilterPanelValue, id: string): unknown {
  return filters.find((filter) => filter.id === id)?.value
}

export function setFilterValue(
  isEmptyValue: IsEmptyValue,
  filters: FilterPanelValue,
  id: string,
  updater: ValueOrFn<unknown>,
): FilterPanelValue {
  const value =
    typeof updater === "function"
      ? (updater as (prev: unknown) => unknown)(getFilterValue(filters, id))
      : updater

  if (isEmptyFilterValue(isEmptyValue, id, value)) {
    return filters.filter((filter) => filter.id !== id)
  }
  if (filters.some((filter) => filter.id === id)) {
    return filters.map((filter) => (filter.id === id ? {id, value} : filter))
  }
  return [...filters, {id, value}]
}

export function getNonEmptyFilters(
  isEmptyValue: IsEmptyValue,
  filters: FilterPanelValue,
): FilterPanelValue {
  return filters.filter(
    (filter) => !isEmptyFilterValue(isEmptyValue, filter.id, filter.value),
  )
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
 * Compares filter states by id and value, ignoring order and empty entries.
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
      (other) => other.id === filter.id && isEqual(other.value, filter.value),
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
