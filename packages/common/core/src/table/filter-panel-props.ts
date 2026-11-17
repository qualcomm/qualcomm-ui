// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterPanelApiProps,
  FilterPanelValues,
} from "@qualcomm-ui/core/filter-panel"
import type {FilterOptionObject} from "@qualcomm-ui/core/filters"

import {shouldAutoRemoveFilter} from "./features/filters.js"
import {warnOnce} from "./internal-warn.js"
import type {Column, RowData, TableInstance} from "./types.js"

export interface TableFilterPanelProps extends Required<
  Pick<
    FilterPanelApiProps,
    | "getFilterLabel"
    | "getFilterOptionLabel"
    | "getFilterRange"
    | "isEmptyValue"
    | "onValueChange"
    | "value"
  >
> {
  getFilterOptions: (id: string) => FilterOptionObject[] | undefined
}

const facetedOptionsCache = new WeakMap<
  Map<any, number>,
  FilterOptionObject[]
>()

const collator = new Intl.Collator(undefined, {numeric: true})

function getFacetedOptions<TData extends RowData>(
  column: Column<TData, unknown>,
): FilterOptionObject[] {
  const uniqueValues = column.getFacetedUniqueValues()
  const cached = facetedOptionsCache.get(uniqueValues)
  if (cached) {
    return cached
  }

  const options = new Map<string, FilterOptionObject>()
  for (const key of uniqueValues.keys()) {
    /**
     * Array-valued columns facet on the whole array unless the column defines
     * `getUniqueValues`, so each item is flattened into its own option here.
     */
    for (const item of Array.isArray(key) ? key : [key]) {
      if (item === undefined || item === null || item === "") {
        continue
      }
      const value = String(item)
      if (!options.has(value)) {
        options.set(value, {label: column.getFilterOptionLabel(item), value})
      }
    }
  }

  const sorted = [...options.values()].sort((a, b) =>
    collator.compare(a.label, b.label),
  )
  facetedOptionsCache.set(uniqueValues, sorted)
  return sorted
}

/**
 * Returns filter panel props that bind the panel to a table's column filters.
 * Converts between the panel's values and `ColumnFiltersState`. Labels resolve
 * from each column's `getFilterLabel` and `getFilterOptionLabel`, options and
 * range bounds from the column's faceted values, and empty values from the
 * column's filter function `autoRemove`. Filter definitions take precedence
 * over all of these. Filter ids without a matching column fall back to the
 * panel defaults.
 */
export function getTableFilterPanelProps<TData extends RowData>(
  table: TableInstance<TData>,
): TableFilterPanelProps {
  /**
   * `table.getColumn` logs an error for unknown ids, but filter ids are not
   * required to match a column.
   */
  const findColumn = (id: string): Column<TData, unknown> | undefined =>
    table.getAllFlatColumns().find((column) => column.id === id)

  return {
    getFilterLabel: (id) => {
      const column = findColumn(id)
      if (!column) {
        warnOnce(
          `filter-panel-label-${id}`,
          `Filter "${id}" has no matching column and no label. Add a label to its definition.`,
        )
        return undefined
      }
      const {filterLabel, header} = column.columnDef
      if (!filterLabel && header !== undefined && typeof header !== "string") {
        warnOnce(
          `filter-panel-label-${id}`,
          `Column "${id}" has a non-string header, so its filter label falls back to the column id. Set the column's filterLabel or add a label to the filter definition.`,
        )
      }
      return column.getFilterLabel()
    },
    getFilterOptionLabel: (id, value) =>
      findColumn(id)?.getFilterOptionLabel(value),
    getFilterOptions: (id) => {
      const column = findColumn(id)
      if (!column) {
        return undefined
      }
      if (table.options.manualFiltering) {
        warnOnce(
          `filter-panel-manual-options-${id}`,
          `Filter "${id}" has no options. Tables with manualFiltering only facet the loaded rows, so pass options to the filter component or its definition.`,
        )
        return undefined
      }
      if (!table.options.getFacetedUniqueValues) {
        warnOnce(
          `filter-panel-faceting-${id}`,
          `Filter "${id}" has no options. Pass options to the filter component or its definition, or enable faceting with the table's getFacetedRowModel and getFacetedUniqueValues options.`,
        )
        return undefined
      }
      return getFacetedOptions(column)
    },
    getFilterRange: (id) => {
      const column = findColumn(id)
      if (!column || table.options.manualFiltering) {
        return undefined
      }
      if (!table.options.getFacetedMinMaxValues) {
        warnOnce(
          `filter-panel-range-${id}`,
          `Range filter "${id}" has no bounds. Set min and max on its definition, or enable faceting with the table's getFacetedRowModel and getFacetedMinMaxValues options.`,
        )
        return undefined
      }
      const minMax = column.getFacetedMinMaxValues()
      return minMax ? {max: minMax[1], min: minMax[0]} : undefined
    },
    isEmptyValue: (id, value) => {
      const column = findColumn(id)
      return (
        !!column &&
        shouldAutoRemoveFilter(column.getFilterFn(value), value, column)
      )
    },
    onValueChange: (values: FilterPanelValues) =>
      table.setColumnFilters(
        Object.entries(values).map(([id, value]) => ({id, value})),
      ),
    value: Object.fromEntries(
      table.getState().columnFilters.map(({id, value}) => [id, value]),
    ),
  }
}
