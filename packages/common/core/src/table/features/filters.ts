// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RowModel} from ".."
import type {TableFeature} from "../core/table"
import {type BuiltInFilterFn, filterFns} from "../filter-fns"
import type {
  Column,
  FilterFns,
  OnChangeFn,
  Row,
  RowData,
  TableInstance,
  Updater,
} from "../types"
import {functionalUpdate, isFunction, makeStateUpdater} from "../utils"

export interface FiltersTableState {
  columnFilters: ColumnFiltersState
  globalFilter: any
}

export type ColumnFiltersState = ColumnFilter[]

export interface ColumnFilter {
  id: string
  value: unknown
}

export interface ResolvedColumnFilter<TData extends RowData> {
  filterFn: FilterFn<TData>
  id: string
  resolvedValue: unknown
}

export interface FilterFn<TData extends RowData> {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: Record<string, any>) => void,
  ): boolean

  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>
  resolveFilterValue?: TransformFilterValueFn<TData>
}

export type TransformFilterValueFn<TData extends RowData> = (
  value: any,
  column?: Column<TData, unknown>,
) => unknown

export type ColumnFilterAutoRemoveTestFn<TData extends RowData> = (
  value: any,
  column?: Column<TData, unknown>,
) => boolean

export type CustomFilterFns<TData extends RowData> = Record<
  string,
  FilterFn<TData>
>

export type FilterFnOption<TData extends RowData> =
  | "auto"
  | BuiltInFilterFn
  | FilterFn<TData>

export interface FiltersColumnDef<TData extends RowData> {
  /**
   * Enables/disables the `column` filter for this column.
   */
  enableColumnFilter?: boolean

  /**
   * Enables/disables the global filter for this column.
   */
  enableGlobalFilter?: boolean

  /**
   * The filter function to use with this column. Can be the name of a built-in
   * filter function or a custom filter function.
   *
   * @inheritDoc
   */
  filterFn?: FilterFnOption<TData>
}

export interface FiltersColumn<TData extends RowData> {
  /** @internal */
  _getFacetedMinMaxValues?: () => undefined | [number, number]
  /** @internal */
  _getFacetedRowModel?: () => RowModel<TData>
  /** @internal */
  _getFacetedUniqueValues?: () => Map<any, number>
  /**
   * Returns an automatically calculated filter function for the column based off of
   * the columns first known value.
   *
   * @inheritDoc
   */
  getAutoFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns whether the column can be `column` filtered.
   */
  getCanFilter: () => boolean
  /**
   * Returns whether the column can be globally filtered. Set to `false`
   * to disable a column from being scanned during global filtering.
   */
  getCanGlobalFilter: () => boolean
  /**
   * A function that computes and returns a min/max tuple derived from
   * {@link getFacetedRowModel}. Useful for displaying faceted result values. > ⚠️
   * Requires that you pass a valid {@link getFacetedMinMaxValues} function to
   * `options.getFacetedMinMaxValues`. A default implementation is provided via the
   * exported {@link getFacetedMinMaxValues} function.
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model with all other column filters applied, excluding its own
   * filter. Useful for displaying faceted result counts.️ Requires that you
   * pass a valid {@link getFacetedRowModel} function to `options.facetedRowModel`. A
   * default implementation is provided via the exported {@link getFacetedRowModel}
   * function.
   *
   * @inheritDoc
   */
  getFacetedRowModel: () => RowModel<TData>
  /**
   * A function that computes and returns a `Map` of unique values and their
   * occurrences derived from `column.getFacetedRowModel`. Useful for displaying
   * faceted result values. Requires that you pass a valid {@link
   * getFacetedUniqueValues} function to `options.getFacetedUniqueValues`. A default
   * implementation is provided via the exported {@link getFacetedUniqueValues}
   * function.
   */
  getFacetedUniqueValues: () => Map<any, number>
  /**
   * Returns the filter function (either user-defined or automatic, depending on
   * configuration) for the columnId specified.
   *
   * @inheritDoc
   */
  getFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns the index of the column filter in the table's `state.columnFilters`
   * array. Returns `-1` if not found.
   */
  getFilterIndex: () => number
  /**
   * Returns the current filter value for the column.
   */
  getFilterValue: () => unknown
  /**
   * Returns whether the column is currently filtered.
   */
  getIsFiltered: () => boolean
  /**
   * A function that sets the current filter value for the column. You can pass it a
   * value or an updater function for immutability-safe operations on existing
   * values.
   */
  setFilterValue: (updater: Updater<any>) => void
}

export interface FiltersRow<_TData extends RowData> {
  /**
   * The column filters map for the row. This object tracks whether a row is
   * passing/failing specific filters by their column ID.
   */
  columnFilters: Record<string, boolean>
  /**
   * The column filters meta map for the row. This object tracks any filter meta for
   * a row as optionally provided during the filtering process.
   */
  columnFiltersMeta: Record<string, Record<string, any>>
}

interface FiltersOptionsBase<TData extends RowData> {
  /**
   * Enables/disables `column` filtering for all columns.
   */
  enableColumnFilters?: boolean
  /**
   * Enables/disables all filtering for the table.
   */
  enableFilters?: boolean
  // Global
  /**
   * Enables/disables global filtering for all columns.
   */
  enableGlobalFilter?: boolean
  /**
   * By default, filtering is done from parent rows down (so if a parent row is
   * filtered out, all of its children will be filtered out as well). Setting this
   * option to `true` will cause filtering to be done from leaf rows up (which means
   * parent rows will be included so long as one of their child or grand-child rows
   * is also included).
   */
  filterFromLeafRows?: boolean
  /**
   * If provided, this function will be called with the column and should return
   * `true` or `false` to indicate whether this column should be used for global
   * filtering.
   *
   * This is useful if the column can contain data that is not `string` or `number`
   * (i.e. `undefined`).
   */
  getColumnCanGlobalFilter?: (
    /** @inheritDoc */
    column: Column<TData, unknown>,
  ) => boolean

  getFacetedMinMaxValues?: (
    /** @inheritDoc */
    table: TableInstance<TData>,
    columnId: string,
  ) => () => undefined | [number, number]
  // Faceting
  getFacetedRowModel?: (
    /** @inheritDoc */
    table: TableInstance<TData>,
    /**
     * The id of the column
     */
    columnId: string,
  ) => () => RowModel<TData>

  getFacetedUniqueValues?: (
    /** @inheritDoc */
    table: TableInstance<TData>,
    columnId: string,
  ) => () => Map<any, number>
  /**
   * If provided, this function is called once per table and should return a
   * new function which will calculate and return the row model for the table
   * when it's filtered. - For server-side filtering, this function is unnecessary
   * and can be ignored since the server should already return the filtered row
   * model. - For client-side filtering, this function is required. A default
   * implementation is provided via any table adapter's `{ getFilteredRowModel }`
   * export.
   */
  getFilteredRowModel?: (
    /** @inheritDoc */
    table: TableInstance<TData>,
  ) => () => RowModel<TData>
  /**
   * The filter function to use for global filtering.
   * - A `string` referencing a built-in filter function
   * - A `string` that references a custom filter functions provided via the
   * `tableOptions.filterFns` option - A custom filter function
   *
   * @inheritDoc
   */
  globalFilterFn?: FilterFnOption<TData>
  /**
   * Disables the `getFilteredRowModel` from being used to filter data. This may be
   * useful if your table needs to dynamically support both client-side and
   * server-side filtering.
   */
  manualFiltering?: boolean

  /**
   * By default, filtering is done for all rows (max depth of 100), no matter if
   * they are root level parent rows or the child leaf rows of a parent row. Setting
   * this option to `0` will cause filtering to only be applied to the root level
   * parent rows, with all sub-rows remaining unfiltered. Similarly, setting this
   * option to `1` will cause filtering to only be applied to child leaf rows 1
   * level deep, and so on.
   *
   * This is useful for situations where you want a row's entire child hierarchy to
   * be visible regardless of the applied filter.
   */
  maxLeafRowFilterDepth?: number
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.columnFilters` changes. This overrides the default internal state
   * management, so you will need to persist the state change either fully or
   * partially outside the table.
   */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.globalFilter` changes. This overrides the default internal state
   * management, so you will need to persist the state change either fully or
   * partially outside the table.
   */
  onGlobalFilterChange?: OnChangeFn<any>
}

type ResolvedFilterFns = keyof FilterFns extends never
  ? {
      /** @inheritDoc */
      filterFns?: Record<string, FilterFn<any>>
    }
  : {
      /** @inheritDoc */
      filterFns: Record<keyof FilterFns, FilterFn<any>>
    }

export interface FiltersOptions<TData extends RowData>
  extends FiltersOptionsBase<TData>,
    ResolvedFilterFns {}

export interface FiltersInstance<TData extends RowData> {
  /** @internal */
  _getFilteredRowModel?: () => RowModel<TData>
  /** @internal */
  _getGlobalFacetedMinMaxValues?: () => undefined | [number, number]
  /** @internal */
  _getGlobalFacetedRowModel?: () => RowModel<TData>
  /** @internal */
  _getGlobalFacetedUniqueValues?: () => Map<any, number>
  /**
   * Returns the row model for the table after `column` filtering has been applied.
   */
  getFilteredRowModel: () => RowModel<TData>

  /**
   * Currently, this function returns the built-in `includesString` filter function.
   * In future releases, it may return more dynamic filter functions based on the
   * nature of the data provided.
   *
   * @inheritDoc
   */
  getGlobalAutoFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns the faceted min and max values for the global filter.
   */
  getGlobalFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model for the table after global filtering has been applied.
   */
  getGlobalFacetedRowModel: () => RowModel<TData>
  /**
   * Returns the faceted unique values for the global filter.
   */
  getGlobalFacetedUniqueValues: () => Map<any, number>
  /**
   * Returns the filter function (either user-defined or automatic, depending on
   * configuration) for the global filter.
   *
   * @inheritDoc
   */
  getGlobalFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns the row model for the table before any `column` filtering has been
   * applied.
   */
  getPreFilteredRowModel: () => RowModel<TData>
  /**
   * Resets the `columnFilters` state to `initialState.columnFilters`, or `true`
   * can be passed to force a default blank state reset to `[]`.
   */
  resetColumnFilters: (defaultState?: boolean) => void
  /**
   * Resets the `globalFilter` state to `initialState.globalFilter`, or `true` can
   * be passed to force a default blank state reset to `undefined`.
   */
  resetGlobalFilter: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnFilters` state.
   */
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  /**
   * Sets or updates the `state.globalFilter` state.
   */
  setGlobalFilter: (updater: Updater<any>) => void
}

export const Filters: TableFeature = {
  createColumn: <TData extends RowData>(
    column: Column<TData>,
    table: TableInstance<TData>,
  ): void => {
    column.getAutoFilterFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0]

      const value = firstRow?.getValue(column.id)

      if (typeof value === "string") {
        return filterFns.includesString
      }

      if (typeof value === "number") {
        return filterFns.inNumberRange
      }

      if (typeof value === "boolean") {
        return filterFns.equals
      }

      if (value !== null && typeof value === "object") {
        return filterFns.equals
      }

      if (Array.isArray(value)) {
        return filterFns.arrIncludes
      }

      return filterFns.weakEquals
    }
    column.getFilterFn = () => {
      return isFunction(column.columnDef.filterFn)
        ? column.columnDef.filterFn
        : column.columnDef.filterFn === "auto"
          ? column.getAutoFilterFn()
          : // @ts-ignore
            (table.options.filterFns?.[column.columnDef.filterFn as string] ??
            filterFns[column.columnDef.filterFn as BuiltInFilterFn])
    }
    column.getCanFilter = () => {
      return (
        (column.columnDef.enableColumnFilter ?? true) &&
        (table.options.enableColumnFilters ?? true) &&
        (table.options.enableFilters ?? true) &&
        !!column.accessorFn
      )
    }

    column.getCanGlobalFilter = () => {
      return (
        (column.columnDef.enableGlobalFilter ?? true) &&
        (table.options.enableGlobalFilter ?? true) &&
        (table.options.enableFilters ?? true) &&
        (table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
        !!column.accessorFn
      )
    }

    column.getIsFiltered = () => column.getFilterIndex() > -1

    column.getFilterValue = () =>
      table.getState().columnFilters?.find((d) => d.id === column.id)?.value

    column.getFilterIndex = () =>
      table.getState().columnFilters?.findIndex((d) => d.id === column.id) ?? -1

    column.setFilterValue = (value) => {
      table.setColumnFilters((old) => {
        const filterFn = column.getFilterFn()
        const previousfilter = old?.find((d) => d.id === column.id)

        const newFilter = functionalUpdate(
          value,
          previousfilter ? previousfilter.value : undefined,
        )

        //
        if (
          shouldAutoRemoveFilter(filterFn as FilterFn<TData>, newFilter, column)
        ) {
          return old?.filter((d) => d.id !== column.id) ?? []
        }

        const newFilterObj = {id: column.id, value: newFilter}

        if (previousfilter) {
          return (
            old?.map((d) => {
              if (d.id === column.id) {
                return newFilterObj
              }
              return d
            }) ?? []
          )
        }

        if (old?.length) {
          return [...old, newFilterObj]
        }

        return [newFilterObj]
      })
    }
    column._getFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, column.id)
    column.getFacetedRowModel = () => {
      if (!column._getFacetedRowModel) {
        return table.getPreFilteredRowModel()
      }

      return column._getFacetedRowModel()
    }
    column._getFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, column.id)
    column.getFacetedUniqueValues = () => {
      if (!column._getFacetedUniqueValues) {
        return new Map()
      }

      return column._getFacetedUniqueValues()
    }
    column._getFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, column.id)
    column.getFacetedMinMaxValues = () => {
      if (!column._getFacetedMinMaxValues) {
        return undefined
      }

      return column._getFacetedMinMaxValues()
    }
    // () => [column.getFacetedRowModel()],
    // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    _table: TableInstance<TData>,
  ): void => {
    row.columnFilters = {}
    row.columnFiltersMeta = {}
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    table.getGlobalAutoFilterFn = () => {
      return filterFns.includesString
    }

    table.getGlobalFilterFn = () => {
      const {globalFilterFn: globalFilterFn} = table.options

      return isFunction(globalFilterFn)
        ? globalFilterFn
        : globalFilterFn === "auto"
          ? table.getGlobalAutoFilterFn()
          : // @ts-ignore
            (table.options.filterFns?.[globalFilterFn as string] ??
            filterFns[globalFilterFn as BuiltInFilterFn])
    }

    table.setColumnFilters = (updater: Updater<ColumnFiltersState>) => {
      const leafColumns = table.getAllLeafColumns()

      const updateFn = (old: ColumnFiltersState) => {
        return functionalUpdate(updater, old)?.filter((filter) => {
          const column = leafColumns.find((d) => d.id === filter.id)

          if (column) {
            const filterFn = column.getFilterFn()

            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
              return false
            }
          }

          return true
        })
      }

      table.options.onColumnFiltersChange?.(updateFn)
    }

    table.setGlobalFilter = (updater) => {
      table.options.onGlobalFilterChange?.(updater)
    }

    table.resetGlobalFilter = (defaultState) => {
      table.setGlobalFilter(
        defaultState ? undefined : table.initialState.globalFilter,
      )
    }

    table.resetColumnFilters = (defaultState) => {
      table.setColumnFilters(
        defaultState ? [] : (table.initialState?.columnFilters ?? []),
      )
    }

    table.getPreFilteredRowModel = () => table.getCoreRowModel()
    table.getFilteredRowModel = () => {
      if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
        table._getFilteredRowModel = table.options.getFilteredRowModel(table)
      }

      if (table.options.manualFiltering || !table._getFilteredRowModel) {
        return table.getPreFilteredRowModel()
      }

      return table._getFilteredRowModel()
    }

    table._getGlobalFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, "__global__")

    table.getGlobalFacetedRowModel = () => {
      if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
        return table.getPreFilteredRowModel()
      }

      return table._getGlobalFacetedRowModel()
    }

    table._getGlobalFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, "__global__")
    table.getGlobalFacetedUniqueValues = () => {
      if (!table._getGlobalFacetedUniqueValues) {
        return new Map()
      }

      return table._getGlobalFacetedUniqueValues()
    }

    table._getGlobalFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, "__global__")
    table.getGlobalFacetedMinMaxValues = () => {
      if (!table._getGlobalFacetedMinMaxValues) {
        return
      }

      return table._getGlobalFacetedMinMaxValues()
    }
  },

  getDefaultColumnDef: <TData extends RowData>(): FiltersColumnDef<TData> => {
    return {
      filterFn: "auto",
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): FiltersOptions<TData> => {
    return {
      filterFromLeafRows: false,
      getColumnCanGlobalFilter: (column) => {
        const value = table
          .getCoreRowModel()
          .flatRows[0]?._getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === "string" || typeof value === "number"
      },
      globalFilterFn: "auto",
      maxLeafRowFilterDepth: 100,
      onColumnFiltersChange: makeStateUpdater("columnFilters", table),
      onGlobalFilterChange: makeStateUpdater("globalFilter", table),
    } as FiltersOptions<TData>
  },

  getInitialState: (state): FiltersTableState => {
    return {
      columnFilters: [],
      globalFilter: undefined,
      // filtersProgress: 1,
      // facetProgress: {},
      ...state,
    }
  },
}

export function shouldAutoRemoveFilter<TData extends RowData>(
  filterFn?: FilterFn<TData>,
  value?: any,
  column?: Column<TData, unknown>,
): boolean {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === "undefined" ||
    (typeof value === "string" && !value)
  )
}
