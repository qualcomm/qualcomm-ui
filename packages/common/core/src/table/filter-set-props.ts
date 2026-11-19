// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterSetApiProps,
  FilterSetValues,
} from "@qualcomm-ui/core/filter-set"
import type {FilterOptionObject} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {isEqual} from "@qualcomm-ui/utils/equal"

import {
  type ResolvedColumnFilter,
  shouldAutoRemoveFilter,
} from "./features/filters.js"
import {warnOnce} from "./internal-warn.js"
import type {Column, Row, RowData, RowModel, TableInstance} from "./types.js"
import {filterRows} from "./utils/filter-rows-utils.js"

export interface TableFilterSetProps extends Required<
  Pick<
    FilterSetApiProps,
    | "getFilterCollection"
    | "getFilterLabel"
    | "getFilterRange"
    | "isEmptyValue"
    | "onValueChange"
    | "value"
  >
> {
  getFilterOptionCounts: (
    id: string,
    values: FilterSetValues,
  ) => ReadonlyMap<string, number> | undefined
}

const collectionCache = new WeakMap<
  RowModel<any>,
  Map<string, ListCollection<FilterOptionObject>>
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

/**
 * Builds a column's collection from the unique values of every row before
 * filtering, so values never drop out as other filters narrow the rows.
 * Counts express what the current filters leave available.
 */
function getColumnCollection<TData extends RowData>(
  table: TableInstance<TData>,
  column: Column<TData, unknown>,
): ListCollection<FilterOptionObject> {
  const rowModel = table.getPreFilteredRowModel()
  let byColumn = collectionCache.get(rowModel)
  if (!byColumn) {
    byColumn = new Map()
    collectionCache.set(rowModel, byColumn)
  }
  const cached = byColumn.get(column.id)
  if (cached) {
    return cached
  }

  const options = new Map<string, FilterOptionObject>()
  for (const row of rowModel.flatRows) {
    for (const key of row.getUniqueValues(column.id) ?? []) {
      for (const item of getOptionValues(key)) {
        const value = String(item)
        if (!options.has(value)) {
          options.set(value, {label: column.getFilterOptionLabel(item), value})
        }
      }
    }
  }

  const collection = new ListCollection<FilterOptionObject>({
    items: [...options.values()].sort((a, b) =>
      collator.compare(a.label, b.label),
    ),
  })
  byColumn.set(column.id, collection)
  return collection
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
  values: FilterSetValues,
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
  values: FilterSetValues,
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
 * Returns filter set props that bind the filters to a table's column filters.
 * Converts between the filter set's values and `ColumnFiltersState`. Filter
 * labels resolve from each column's `getFilterLabel`. Collections hold every
 * value of the column across all rows, labeled by `getFilterOptionLabel`.
 * Option counts and range bounds come from the column's faceted values, and
 * empty values from the column's filter function `autoRemove`. Filter
 * definitions take precedence over all of these. Filter ids without a
 * matching column fall back to the filter set defaults.
 */
export function getTableFilterSetProps<TData extends RowData>(
  table: TableInstance<TData>,
): TableFilterSetProps {
  /**
   * `table.getColumn` logs an error for unknown ids, but filter ids are not
   * required to match a column.
   */
  const findColumn = (id: string): Column<TData, unknown> | undefined =>
    table.getAllFlatColumns().find((column) => column.id === id)

  const committed: FilterSetValues = Object.fromEntries(
    table.getState().columnFilters.map(({id, value}) => [id, value]),
  )

  return {
    getFilterCollection: (id) => {
      const column = findColumn(id)
      if (!column) {
        return undefined
      }
      if (table.options.manualFiltering) {
        warnOnce(
          `filter-set-manual-collection-${id}`,
          `Filter "${id}" has no collection. Tables with manualFiltering only load some rows, so add a collection to the filter's definition or resolve it with getFilterCollection.`,
        )
        return undefined
      }
      return {collection: getColumnCollection(table, column), status: "success"}
    },
    getFilterLabel: (id) => {
      const column = findColumn(id)
      if (!column) {
        warnOnce(
          `filter-set-label-${id}`,
          `Filter "${id}" has no matching column and no label. Add a label to its definition.`,
        )
        return undefined
      }
      const {filterLabel, header} = column.columnDef
      if (!filterLabel && header !== undefined && typeof header !== "string") {
        warnOnce(
          `filter-set-label-${id}`,
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
    getFilterRange: (id) => {
      const column = findColumn(id)
      if (!column || table.options.manualFiltering) {
        return undefined
      }
      if (!table.options.getFacetedMinMaxValues) {
        warnOnce(
          `filter-set-range-${id}`,
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
    onValueChange: (values: FilterSetValues) =>
      table.setColumnFilters(
        Object.entries(values).map(([id, value]) => ({id, value})),
      ),
    value: committed,
  }
}
