// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterDefinitions,
  isEmptyFilterValue,
} from "@qualcomm-ui/core/filters"
import {isEqual} from "@qualcomm-ui/utils/equal"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

import type {FilterSetApiProps, FilterSetValues} from "../filter-set.types.js"

export type IsEmptyFilterValue = (id: string, value: unknown) => boolean

/**
 * Builds the empty-value check for a filter set. A value is empty when
 * `isEmptyFilterValue` considers it empty for its definition, or when the
 * consumer's `isEmptyValue` rejects it. Empty values are never counted or
 * committed.
 */
export function createEmptyValueCheck(
  definitions: FilterDefinitions | undefined,
  isEmptyValue: FilterSetApiProps["isEmptyValue"],
): IsEmptyFilterValue {
  return (id, value) => {
    return (
      isEmptyFilterValue(definitions?.[id], value) ||
      !!isEmptyValue?.(id, value)
    )
  }
}

/**
 * Writes a filter value. Empty values delete the filter's key.
 */
export function setFilterValue(
  isEmpty: IsEmptyFilterValue,
  values: FilterSetValues,
  id: string,
  updater: ValueOrFn<unknown>,
): FilterSetValues {
  const value =
    typeof updater === "function"
      ? (updater as (prev: unknown) => unknown)(values[id])
      : updater

  const {[id]: _removed, ...rest} = values
  return isEmpty(id, value) ? rest : {...values, [id]: value}
}

export function getNonEmptyValues(
  isEmpty: IsEmptyFilterValue,
  values: FilterSetValues,
): FilterSetValues {
  return Object.fromEntries(
    Object.entries(values).filter(([id, value]) => !isEmpty(id, value)),
  )
}

/**
 * Compares filter values by key, ignoring key order and empty values.
 */
export function areValuesEqual(
  isEmpty: IsEmptyFilterValue,
  a: FilterSetValues,
  b: FilterSetValues,
): boolean {
  const left = getNonEmptyValues(isEmpty, a)
  const right = getNonEmptyValues(isEmpty, b)
  const keys = Object.keys(left)
  if (keys.length !== Object.keys(right).length) {
    return false
  }
  return keys.every((key) => key in right && isEqual(left[key], right[key]))
}

/**
 * Serializes values with sorted keys, so that the same filters in a different
 * key order produce the same hash.
 */
export function hashValues(values: FilterSetValues | undefined): string {
  if (!values) {
    return ""
  }
  return JSON.stringify(
    Object.keys(values)
      .sort()
      .map((key) => [key, values[key]]),
  )
}

export function countValues(
  definitions: FilterDefinitions | undefined,
  isEmpty: IsEmptyFilterValue,
  values: FilterSetValues,
): number {
  return Object.entries(getNonEmptyValues(isEmpty, values)).reduce(
    (count, [id, value]) => count + countFilterValue(definitions?.[id], value),
    0,
  )
}
