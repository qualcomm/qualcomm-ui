// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  Column,
  ColumnFiltersState,
  TableInstance,
  Updater,
} from "@qualcomm-ui/core/table"
import {isEqual} from "@qualcomm-ui/utils/equal"

const identityKeys = new WeakMap<object, number>()
let nextIdentityKey = 0

/**
 * Returns a stable number per object reference. Machine `track` dependencies
 * must be primitives, and serializing filter values is lossy and can throw.
 */
export function getIdentityKey(value: object): number {
  let key = identityKeys.get(value)
  if (key === undefined) {
    key = ++nextIdentityKey
    identityKeys.set(value, key)
  }
  return key
}

/**
 * Looks up a column without `table.getColumn`, which logs an error for unknown
 * ids. Filter ids are not required to match a column.
 */
export function findColumn(
  table: TableInstance<any>,
  id: string,
): Column<any, unknown> | undefined {
  return table.getAllFlatColumns().find((column) => column.id === id)
}

/**
 * A value is empty when it carries no filtering intent, or when the column's
 * filter function would auto-remove it. The generic check also applies to
 * columns so that, for example, an unchecked checkbox group (`[]`) is not
 * counted or applied when the column's filter function has no `autoRemove`.
 */
export function isEmptyFilterValue(
  table: TableInstance<any>,
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
  const column = findColumn(table, id)
  return !!column?.getFilterFn()?.autoRemove?.(value, column)
}

export function getFilterValue(
  filters: ColumnFiltersState,
  id: string,
): unknown {
  return filters.find((filter) => filter.id === id)?.value
}

export function setFilterValue(
  table: TableInstance<any>,
  filters: ColumnFiltersState,
  id: string,
  updater: Updater<unknown>,
): ColumnFiltersState {
  const value =
    typeof updater === "function"
      ? (updater as (prev: unknown) => unknown)(getFilterValue(filters, id))
      : updater

  const others = filters.filter((filter) => filter.id !== id)
  if (isEmptyFilterValue(table, id, value)) {
    return others
  }

  const index = filters.findIndex((filter) => filter.id === id)
  if (index === -1) {
    return [...others, {id, value}]
  }
  return filters.map((filter) => (filter.id === id ? {id, value} : filter))
}

export function getNonEmptyFilters(
  table: TableInstance<any>,
  filters: ColumnFiltersState,
): ColumnFiltersState {
  return filters.filter(
    (filter) => !isEmptyFilterValue(table, filter.id, filter.value),
  )
}

export function countFilters(
  table: TableInstance<any>,
  filters: ColumnFiltersState,
): number {
  return new Set(getNonEmptyFilters(table, filters).map((filter) => filter.id))
    .size
}

/**
 * Compares filter states by id and value, ignoring order and empty entries.
 */
export function areFiltersEqual(
  table: TableInstance<any>,
  a: ColumnFiltersState,
  b: ColumnFiltersState,
): boolean {
  const left = getNonEmptyFilters(table, a)
  const right = getNonEmptyFilters(table, b)
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
