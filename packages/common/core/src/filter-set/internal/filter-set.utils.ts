// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterDefinition,
  type FilterDefinitions,
  isCollectionFilter,
  isEmptyFilterValue,
} from "@qualcomm-ui/core/filters"
import {ListCollection, TreeCollection} from "@qualcomm-ui/utils/collection"
import {isEqual} from "@qualcomm-ui/utils/equal"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

import type {
  FilterSetApiProps,
  FilterSetCapturedItem,
  FilterSetCollection,
  FilterSetCollectionState,
  FilterSetValues,
} from "../filter-set.types.js"

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

/**
 * Returns a list or tree filter's selected values as strings.
 */
export function getSelectedValues(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

/**
 * Returns a filter's selected values in `value` and `draftValue`.
 */
export function getSelectionValues(
  value: unknown,
  draftValue: unknown,
): string[] {
  return [
    ...new Set([...getSelectedValues(value), ...getSelectedValues(draftValue)]),
  ]
}

/**
 * Returns the selected values whose items haven't been seen in a collection.
 * They are passed to `getFilterCollection` so the resolver can include them.
 */
export function getUncapturedValues(
  captured: Record<string, FilterSetCapturedItem> | undefined,
  selected: string[],
): string[] {
  return selected.filter((option) => !captured?.[option])
}

/**
 * Returns the state of a list or tree filter's collection: `success` with the
 * definition's collection, otherwise the resolver's result. Other filter kinds
 * have no collection.
 */
export function getCollectionState(
  definition: FilterDefinition | undefined,
  id: string,
  resolver: FilterSetApiProps["getFilterCollection"],
  values: string[],
): FilterSetCollectionState | undefined {
  if (definition && !isCollectionFilter(definition)) {
    return undefined
  }
  if (definition?.collection) {
    return {collection: definition.collection, status: "success"}
  }
  return resolver?.(id, {values})
}

/**
 * Finds a value's item in a list or tree collection, with its label.
 */
export function findCollectionItem(
  collection: FilterSetCollection | undefined,
  value: string,
): FilterSetCapturedItem | undefined {
  if (collection instanceof ListCollection) {
    const item = collection.find(value)
    return item === null
      ? undefined
      : {item, label: collection.stringifyItem(item) ?? value}
  }
  if (collection instanceof TreeCollection) {
    const node = collection.findNode(value)
    return node === undefined
      ? undefined
      : {item: node, label: collection.stringifyNode(node)}
  }
  return undefined
}

/**
 * Updates the items seen for one filter: keeps the selected values only, and
 * records the item of each selected value found in the collection.
 */
export function captureFilterItems(
  captured: Record<string, FilterSetCapturedItem> | undefined,
  selected: string[],
  collection: FilterSetCollection | undefined,
): Record<string, FilterSetCapturedItem> {
  const next: Record<string, FilterSetCapturedItem> = {}
  for (const value of selected) {
    const found = findCollectionItem(collection, value) ?? captured?.[value]
    if (found) {
      next[value] = found
    }
  }
  return next
}
