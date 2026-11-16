// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  ColumnFiltersState,
  TableInstance,
  Updater,
} from "@qualcomm-ui/core/table"
import {isEqual} from "@qualcomm-ui/utils/equal"

import type {TableFilterPanelColumnResolver} from "../table-filter-panel.types.js"

/**
 * Creates a column resolver for a table. Unlike `table.getColumn`, it does not
 * log an error for unknown ids, since filter ids are not required to match a
 * column.
 */
export function createTableColumnResolver(
  table: TableInstance<any>,
): TableFilterPanelColumnResolver {
  return (id) => table.getAllFlatColumns().find((column) => column.id === id)
}

/**
 * A value is empty when it carries no filtering intent, or when the column's
 * filter function would auto-remove it. The generic check also applies to
 * columns so that, for example, an unchecked checkbox group (`[]`) is not
 * counted or applied when the column's filter function has no `autoRemove`.
 */
export function isEmptyFilterValue(
  getColumn: TableFilterPanelColumnResolver | undefined,
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
  const column = getColumn?.(id)
  return !!column?.getFilterFn()?.autoRemove?.(value, column)
}

export function getFilterValue(
  filters: ColumnFiltersState,
  id: string,
): unknown {
  return filters.find((filter) => filter.id === id)?.value
}

export function setFilterValue(
  getColumn: TableFilterPanelColumnResolver | undefined,
  filters: ColumnFiltersState,
  id: string,
  updater: Updater<unknown>,
): ColumnFiltersState {
  const value =
    typeof updater === "function"
      ? (updater as (prev: unknown) => unknown)(getFilterValue(filters, id))
      : updater

  if (isEmptyFilterValue(getColumn, id, value)) {
    return filters.filter((filter) => filter.id !== id)
  }
  if (filters.some((filter) => filter.id === id)) {
    return filters.map((filter) => (filter.id === id ? {id, value} : filter))
  }
  return [...filters, {id, value}]
}

export function getNonEmptyFilters(
  getColumn: TableFilterPanelColumnResolver | undefined,
  filters: ColumnFiltersState,
): ColumnFiltersState {
  return filters.filter(
    (filter) => !isEmptyFilterValue(getColumn, filter.id, filter.value),
  )
}

export function countFilters(
  getColumn: TableFilterPanelColumnResolver | undefined,
  filters: ColumnFiltersState,
): number {
  return new Set(
    getNonEmptyFilters(getColumn, filters).map((filter) => filter.id),
  ).size
}

/**
 * Compares filter states by id and value, ignoring order and empty entries.
 */
export function areFiltersEqual(
  getColumn: TableFilterPanelColumnResolver | undefined,
  a: ColumnFiltersState,
  b: ColumnFiltersState,
): boolean {
  const left = getNonEmptyFilters(getColumn, a)
  const right = getNonEmptyFilters(getColumn, b)
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
