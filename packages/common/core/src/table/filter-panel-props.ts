// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterPanelApiProps,
  FilterPanelValues,
} from "@qualcomm-ui/core/filter-panel"
import type {FilterOptionObject} from "@qualcomm-ui/core/filters"
import {isEqual} from "@qualcomm-ui/utils/equal"

import {
  type ResolvedColumnFilter,
  shouldAutoRemoveFilter,
} from "./features/filters.js"
import {warnOnce} from "./internal-warn.js"
import type {Column, Row, RowData, RowModel, TableInstance} from "./types.js"
import {filterRows} from "./utils/filter-rows-utils.js"

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
  getFilterOptionCounts: (
    id: string,
    values: FilterPanelValues,
  ) => ReadonlyMap<string, number> | undefined
  getFilterOptions: (id: string) => FilterOptionObject[] | undefined
}

const facetedOptionsCache = new WeakMap<
  Map<any, number>,
  FilterOptionObject[]
>()

const collator = new Intl.Collator(undefined, {numeric: true})

/**
 * Yields each non-empty option value of a faceted value. Array-valued columns
 * facet on the whole array unless the column defines `getUniqueValues`, so
 * each item is its own option.
 */
function* getOptionValues(key: unknown): Generator<unknown> {
  for (const item of Array.isArray(key) ? key : [key]) {
    if (item !== undefined && item !== null && item !== "") {
      yield item
    }
  }
}

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
    for (const item of getOptionValues(key)) {
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

const facetedCountsCache = new WeakMap<Map<any, number>, Map<string, number>>()

function getFacetedCounts<TData extends RowData>(
  column: Column<TData, unknown>,
): Map<string, number> {
  const uniqueValues = column.getFacetedUniqueValues()
  const cached = facetedCountsCache.get(uniqueValues)
  if (cached) {
    return cached
  }

  const counts = new Map<string, number>()
  for (const [key, count] of uniqueValues) {
    for (const value of new Set(Array.from(getOptionValues(key), String))) {
      counts.set(value, (counts.get(value) ?? 0) + count)
    }
  }
  facetedCountsCache.set(uniqueValues, counts)
  return counts
}

interface DraftFacets {
  counts: Map<string, Map<string, number>>
  /**
   * The ids of the draft filters each row fails, keyed by row id.
   */
  failedFilters: Map<string, Set<string>>
  globalFilter: unknown
  key: string
  preFilteredRowModel: RowModel<any>
}

const draftFacetsCache = new WeakMap<TableInstance<any>, DraftFacets>()

function getDraftFacets<TData extends RowData>(
  table: TableInstance<TData>,
  values: FilterPanelValues,
): DraftFacets {
  const preFilteredRowModel = table.getPreFilteredRowModel()
  const {globalFilter} = table.getState()
  const key = JSON.stringify(
    Object.entries(values).sort(([a], [b]) => a.localeCompare(b)),
  )
  const cached = draftFacetsCache.get(table)
  if (
    cached?.key === key &&
    cached.preFilteredRowModel === preFilteredRowModel &&
    cached.globalFilter === globalFilter
  ) {
    return cached
  }

  const resolvedFilters: ResolvedColumnFilter<TData>[] = []
  for (const [id, value] of Object.entries(values)) {
    const column = table.getAllLeafColumns().find((leaf) => leaf.id === id)
    const filterFn = column?.getFilterFn(value)
    if (
      !column ||
      !filterFn ||
      shouldAutoRemoveFilter(filterFn, value, column)
    ) {
      continue
    }
    resolvedFilters.push({
      filterFn,
      id,
      resolvedValue: filterFn.resolveFilterValue?.(value) ?? value,
    })
  }

  const failedFilters = new Map<string, Set<string>>()
  for (const row of preFilteredRowModel.flatRows) {
    const failed = new Set<string>()
    for (const {filterFn, id, resolvedValue} of resolvedFilters) {
      if (!filterFn(row, id, resolvedValue, () => {})) {
        failed.add(id)
      }
    }
    failedFilters.set(row.id, failed)
  }

  const facets: DraftFacets = {
    counts: new Map(),
    failedFilters,
    globalFilter,
    key,
    preFilteredRowModel,
  }
  draftFacetsCache.set(table, facets)
  return facets
}

/**
 * Counts option values across the rows that pass every draft filter except
 * the column's own, matching how the faceted row model treats committed
 * filters. The committed global filter still applies.
 */
function getDraftFacetedCounts<TData extends RowData>(
  table: TableInstance<TData>,
  columnId: string,
  values: FilterPanelValues,
): Map<string, number> {
  /**
   * Runs the filtered row model so that each row's `__global__` flag reflects
   * the current global filter.
   */
  table.getFilteredRowModel()
  const facets = getDraftFacets(table, values)
  const cached = facets.counts.get(columnId)
  if (cached) {
    return cached
  }

  const passes = (row: Row<TData>): boolean => {
    if (row.columnFilters.__global__ === false) {
      return false
    }
    const failed = facets.failedFilters.get(row.id)
    return !failed || [...failed].every((id) => id === columnId)
  }

  const counts = new Map<string, number>()
  for (const row of filterRows(
    facets.preFilteredRowModel.rows as Row<TData>[],
    passes,
    table,
  ).flatRows) {
    const rowValues = new Set<string>()
    for (const key of row.getUniqueValues(columnId) ?? []) {
      for (const item of getOptionValues(key)) {
        rowValues.add(String(item))
      }
    }
    for (const value of rowValues) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  facets.counts.set(columnId, counts)
  return counts
}

/**
 * Returns filter panel props that bind the panel to a table's column filters.
 * Converts between the panel's values and `ColumnFiltersState`. Labels resolve
 * from each column's `getFilterLabel` and `getFilterOptionLabel`, options,
 * option counts, and range bounds from the column's faceted values, and empty values from the
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

  const committed: FilterPanelValues = Object.fromEntries(
    table.getState().columnFilters.map(({id, value}) => [id, value]),
  )

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
    getFilterOptionCounts: (id, values) => {
      const column = findColumn(id)
      if (
        !column ||
        table.options.manualFiltering ||
        !table.options.getFacetedUniqueValues
      ) {
        return undefined
      }
      return isEqual(values, committed)
        ? getFacetedCounts(column)
        : getDraftFacetedCounts(table, id, values)
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
    value: committed,
  }
}
