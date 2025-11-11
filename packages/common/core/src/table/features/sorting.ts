// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RowModel} from ".."
import type {TableFeature} from "../core/table"
import {
  type BuiltInSortingFn,
  reSplitAlphaNumeric,
  sortingFns,
} from "../sorting-fns"
import type {
  Column,
  OnChangeFn,
  Row,
  RowData,
  SortingFns,
  TableInstance,
  Updater,
} from "../types"
import {isFunction, makeStateUpdater} from "../utils"

export type SortDirection = "asc" | "desc"

export interface ColumnSort {
  desc: boolean
  id: string
}

export type SortingState = ColumnSort[]

export interface SortingTableState {
  sorting: SortingState
}

export interface SortingFn<TData extends RowData> {
  (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
}

export type CustomSortingFns<TData extends RowData> = Record<
  string,
  SortingFn<TData>
>

export type SortingFnOption<TData extends RowData> =
  | "auto"
  | BuiltInSortingFn
  | SortingFn<TData>

export interface SortingColumnDef<TData extends RowData> {
  /**
   * Enables/Disables multi-sorting for this column.
   */
  enableMultiSort?: boolean

  /**
   * Enables/Disables sorting for this column.
   */
  enableSorting?: boolean

  /**
   * Inverts the order of the sorting for this column. This is useful for values
   * that have an inverted best/worst scale where lower numbers are better, e.g.,a
   * ranking (1st, 2nd, 3rd) or golf-like scoring
   */
  invertSorting?: boolean

  /**
   * Set to `true` for sorting toggles on this column to start in the descending
   * direction.
   */
  sortDescFirst?: boolean

  /**
   * The sorting function to use with this column.
   * - A `string` referencing a built-in sorting function
   * - A custom sorting function
   */
  sortingFn?: SortingFnOption<TData>

  /**
   * Configure how undefined values are sorted for this column.
   *
   * @option `false`: Undefined values will be considered tied and need to be sorted by the next column filter or original index (whichever applies).
   * @option `-1`: Undefined values will be sorted with higher priority (ascending) (if ascending, undefined will appear on the beginning of the list)
   * @option `1`: Undefined values will be sorted with lower priority (descending) (if ascending, undefined will appear on the end of the list)
   */
  sortUndefined?: false | -1 | 1
}

export interface SortingColumn<TData extends RowData> {
  /**
   * Removes this column from the table's sorting state
   */
  clearSorting: () => void
  /**
   * Returns a sort direction automatically inferred based on the columns values.
   */
  getAutoSortDir: () => SortDirection
  /**
   * Returns a sorting function automatically inferred based on the columns values.
   */
  getAutoSortingFn: () => SortingFn<TData>
  /**
   * Returns whether this column can be multi-sorted.
   */
  getCanMultiSort: () => boolean
  /**
   * Returns whether this column can be sorted.
   */
  getCanSort: () => boolean
  /**
   * Returns the first direction that should be used when sorting this column.
   */
  getFirstSortDir: () => SortDirection
  /**
   * Returns the current sort direction of this column.
   */
  getIsSorted: () => false | SortDirection
  /**
   * Returns the next sorting order.
   */
  getNextSortingOrder: () => SortDirection | false
  /**
   * Returns the index position of this column's sorting within the sorting state
   */
  getSortIndex: () => number
  /**
   * Returns the resolved sorting function to be used for this column
   */
  getSortingFn: () => SortingFn<TData>
  /**
   * Returns a function that can be used to toggle this column's sorting state. This
   * is useful for attaching a click handler to the column header.
   */
  getToggleSortingHandler: () => undefined | ((event: unknown) => void)
  /**
   * Toggles this columns sorting state. If `desc` is provided, it will force the
   * sort direction to that value. If `isMulti` is provided, it will additivity
   * multi-sort the column (or toggle it if it is already sorted).
   */
  toggleSorting: (desc?: boolean, isMulti?: boolean) => void
}

interface SortingOptionsBase {
  /**
   * Enables/disables the ability to remove multi-sorts
   */
  enableMultiRemove?: boolean
  /**
   * Enables/Disables multi-sorting for the table.
   */
  enableMultiSort?: boolean
  /**
   * Enables/Disables sorting for the table.
   */
  enableSorting?: boolean
  /**
   * Enables/Disables the ability to remove sorting for the table.
   * - If `true` then changing sort order will circle like: 'none' -> 'desc' ->
   * 'asc' -> 'none' -> ... - If `false` then changing sort order will circle like:
   * 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...
   */
  enableSortingRemoval?: boolean
  /**
   * This function is used to retrieve the sorted row model. If using server-side
   * sorting, this function is not required. To use client-side sorting, pass the
   * exported `getSortedRowModel()` from your adapter to your table or implement
   * your own.
   */
  getSortedRowModel?: (
    /** @inheritDoc */
    table: TableInstance<any>,
  ) => () => RowModel<any>
  /**
   * Pass a custom function that will be used to determine if a multi-sort event
   * should be triggered. It is passed the event from the sort toggle handler and
   * should return `true` if the event should trigger a multi-sort.
   */
  isMultiSortEvent?: (e: unknown) => boolean
  /**
   * Enables manual sorting for the table. If this is `true`, you will be expected
   * to sort your data before it is passed to the table. This is useful if you are
   * doing server-side sorting.
   */
  manualSorting?: boolean
  /**
   * Set a maximum number of columns that can be multi-sorted.
   */
  maxMultiSortColCount?: number
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.sorting` changes. This overrides the default internal state management,
   * so you will need to persist the state change either fully or partially outside
   * of the table.
   */
  onSortingChange?: OnChangeFn<SortingState>
  /**
   * If `true`, all sorts will default to descending as their first toggle state.
   */
  sortDescFirst?: boolean
}

type ResolvedSortingFns = keyof SortingFns extends never
  ? {
      sortingFns?: Record<string, SortingFn<any>>
    }
  : {
      sortingFns: Record<keyof SortingFns, SortingFn<any>>
    }

export interface SortingOptions<_TData extends RowData>
  extends SortingOptionsBase,
    ResolvedSortingFns {}

export interface SortingInstance<TData extends RowData> {
  /** @internal */
  _getSortedRowModel?: () => RowModel<TData>
  /**
   * Returns the row model for the table before any sorting has been applied.
   */
  getPreSortedRowModel: () => RowModel<TData>
  /**
   * Returns the row model for the table after sorting has been applied.
   */
  getSortedRowModel: () => RowModel<TData>
  /**
   * Resets the `sorting` state to `initialState.sorting`, or `true` can be passed
   * to force a default blank state reset to `[]`.
   */
  resetSorting: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.sorting` state.
   */
  setSorting: (updater: Updater<SortingState>) => void
}

export const Sorting: TableFeature = {
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: TableInstance<TData>,
  ): void => {
    column.getAutoSortingFn = () => {
      const firstRows = table.getFilteredRowModel().flatRows.slice(10)

      let isString = false

      for (const row of firstRows) {
        const value = row?.getValue(column.id)

        if (Object.prototype.toString.call(value) === "[object Date]") {
          return sortingFns.datetime
        }

        if (typeof value === "string") {
          isString = true

          if (value.split(reSplitAlphaNumeric).length > 1) {
            return sortingFns.alphanumeric
          }
        }
      }

      if (isString) {
        return sortingFns.text
      }

      return sortingFns.basic
    }
    column.getAutoSortDir = () => {
      const firstRow = table.getFilteredRowModel().flatRows[0]

      const value = firstRow?.getValue(column.id)

      if (typeof value === "string") {
        return "asc"
      }

      return "desc"
    }
    column.getSortingFn = () => {
      if (!column) {
        throw new Error()
      }

      return isFunction(column.columnDef.sortingFn)
        ? column.columnDef.sortingFn
        : column.columnDef.sortingFn === "auto"
          ? column.getAutoSortingFn()
          : (table.options.sortingFns?.[column.columnDef.sortingFn as string] ??
            sortingFns[column.columnDef.sortingFn as BuiltInSortingFn])
    }
    column.toggleSorting = (desc, multi) => {
      // this needs to be outside of table.setSorting to be in sync with rerender
      const nextSortingOrder = column.getNextSortingOrder()
      const hasManualValue = typeof desc !== "undefined" && desc !== null

      table.setSorting((old) => {
        // Find any existing sorting for this column
        const existingSorting = old?.find((d) => d.id === column.id)
        const existingIndex = old?.findIndex((d) => d.id === column.id)

        let newSorting: SortingState = []

        // What should we do with this sort action?
        let sortAction: "add" | "remove" | "toggle" | "replace"
        const nextDesc = hasManualValue ? desc : nextSortingOrder === "desc"

        // Multi-mode
        if (old?.length && column.getCanMultiSort() && multi) {
          if (existingSorting) {
            sortAction = "toggle"
          } else {
            sortAction = "add"
          }
        } else {
          // Normal mode
          if (old?.length && existingIndex !== old.length - 1) {
            sortAction = "replace"
          } else if (existingSorting) {
            sortAction = "toggle"
          } else {
            sortAction = "replace"
          }
        }

        // Handle toggle states that will remove the sorting
        if (sortAction === "toggle") {
          // If we are "actually" toggling (not a manual set value), should we
          // remove the sorting?
          if (!hasManualValue) {
            // Is our intention to remove?
            if (!nextSortingOrder) {
              sortAction = "remove"
            }
          }
        }

        if (sortAction === "add") {
          newSorting = [
            ...old,
            {
              desc: nextDesc,
              id: column.id,
            },
          ]
          // Take latest n columns
          newSorting.splice(
            0,
            newSorting.length -
              (table.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER),
          )
        } else if (sortAction === "toggle") {
          // This flips (or sets) the
          newSorting = old.map((d) => {
            if (d.id === column.id) {
              return {
                ...d,
                desc: nextDesc,
              }
            }
            return d
          })
        } else if (sortAction === "remove") {
          newSorting = old.filter((d) => d.id !== column.id)
        } else {
          newSorting = [
            {
              desc: nextDesc,
              id: column.id,
            },
          ]
        }

        return newSorting
      })
    }

    column.getFirstSortDir = () => {
      const sortDescFirst =
        column.columnDef.sortDescFirst ??
        table.options.sortDescFirst ??
        column.getAutoSortDir() === "desc"
      return sortDescFirst ? "desc" : "asc"
    }

    column.getNextSortingOrder = (multi?: boolean) => {
      const firstSortDirection = column.getFirstSortDir()
      const isSorted = column.getIsSorted()

      if (!isSorted) {
        return firstSortDirection
      }

      if (
        isSorted !== firstSortDirection &&
        (table.options.enableSortingRemoval ?? true) && // If enableSortRemove, enable in general
        (multi ? (table.options.enableMultiRemove ?? true) : true) // If multi, don't allow if enableMultiRemove))
      ) {
        return false
      }
      return isSorted === "desc" ? "asc" : "desc"
    }

    column.getCanSort = () => {
      return (
        (column.columnDef.enableSorting ?? true) &&
        (table.options.enableSorting ?? true) &&
        !!column.accessorFn
      )
    }

    column.getCanMultiSort = () => {
      return (
        column.columnDef.enableMultiSort ??
        table.options.enableMultiSort ??
        !!column.accessorFn
      )
    }

    column.getIsSorted = () => {
      const columnSort = table
        .getState()
        .sorting?.find((d) => d.id === column.id)

      return !columnSort ? false : columnSort.desc ? "desc" : "asc"
    }

    column.getSortIndex = () =>
      table.getState().sorting?.findIndex((d) => d.id === column.id) ?? -1

    column.clearSorting = () => {
      // clear sorting for just 1 column
      table.setSorting((old) =>
        old?.length ? old.filter((d) => d.id !== column.id) : [],
      )
    }

    column.getToggleSortingHandler = () => {
      const canSort = column.getCanSort()

      return (e: unknown) => {
        if (!canSort) {
          return
        }
        ;(e as any).persist?.()
        column.toggleSorting?.(
          undefined,
          column.getCanMultiSort()
            ? table.options.isMultiSortEvent?.(e)
            : false,
        )
      }
    }
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    table.setSorting = (updater) => table.options.onSortingChange?.(updater)
    table.resetSorting = (defaultState) => {
      table.setSorting(defaultState ? [] : (table.initialState?.sorting ?? []))
    }
    table.getPreSortedRowModel = () => table.getGroupedRowModel()
    table.getSortedRowModel = () => {
      if (!table._getSortedRowModel && table.options.getSortedRowModel) {
        table._getSortedRowModel = table.options.getSortedRowModel(table)
      }

      if (table.options.manualSorting || !table._getSortedRowModel) {
        return table.getPreSortedRowModel()
      }

      return table._getSortedRowModel()
    }
  },

  getDefaultColumnDef: <TData extends RowData>(): SortingColumnDef<TData> => {
    return {
      sortingFn: "auto",
      sortUndefined: 1,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): SortingOptions<TData> => {
    return {
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
      onSortingChange: makeStateUpdater("sorting", table),
    }
  },

  getInitialState: (state): SortingTableState => {
    return {
      sorting: [],
      ...state,
    }
  },
}
