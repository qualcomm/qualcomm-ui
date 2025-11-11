// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RowModel} from ".."
import type {TableFeature} from "../core/table"
import type {OnChangeFn, Row, RowData, TableInstance, Updater} from "../types"
import {makeStateUpdater} from "../utils"

export type ExpandedStateList = Record<string, boolean>
export type ExpandedState = true | Record<string, boolean>
export interface ExpandedTableState {
  expanded: ExpandedState
}

export interface ExpandedRow {
  /**
   * Returns whether the row can be expanded.
   */
  getCanExpand: () => boolean
  /**
   * Returns whether all parent rows of the row are expanded.
   */
  getIsAllParentsExpanded: () => boolean
  /**
   * Returns whether the row is expanded.
   */
  getIsExpanded: () => boolean
  /**
   * Returns a function that can be used to toggle the expanded state of the row.
   * This function can be used to bind to an event handler to a button.
   */
  getToggleExpandedHandler: () => () => void
  /**
   * Toggles the expanded state (or sets it if `expanded` is provided) for the row.
   */
  toggleExpanded: (expanded?: boolean) => void
}

export interface ExpandedOptions<TData extends RowData> {
  /**
   * Enable this setting to automatically reset the expanded state of the table when
   * expanding state changes.
   */
  autoResetExpanded?: boolean
  /**
   * Enable/disable expanding for all rows.
   */
  enableExpanding?: boolean
  /**
   * This function is responsible for returning the expanded row model. If this
   * function is not provided, the table will not expand rows. You can use the
   * default exported `getExpandedRowModel` function to get the expanded row model
   * or implement your own.
   */
  getExpandedRowModel?: (
    /** @inheritDoc */
    table: TableInstance<any>,
  ) => () => RowModel<any>
  /**
   * If provided, allows you to override the default behavior of determining whether
   * a row is currently expanded.
   */
  getIsRowExpanded?: (
    /** @inheritDoc */
    row: Row<TData>,
  ) => boolean
  /**
   * If provided, allows you to override the default behavior of determining whether
   * a row can be expanded.
   */
  getRowCanExpand?: (
    /** @inheritDoc */
    row: Row<TData>,
  ) => boolean
  /**
   * Enables manual row expansion. If this is set to `true`, `getExpandedRowModel`
   * will not be used to expand rows and you would be expected to perform the
   * expansion in your own data model. This is useful if you are doing server-side
   * expansion.
   */
  manualExpanding?: boolean
  /**
   * This function is called when the `expanded` table state changes. If a function
   * is provided, you will be responsible for managing this state on your own. To
   * pass the managed state back to the table, use the `tableOptions.state.expanded`
   * option.
   *
   * @inheritDoc
   */
  onExpandedChange?: OnChangeFn<ExpandedState>
  /**
   * If `true` expanded rows will be paginated along with the rest of the table
   * (which means expanded rows may span multiple pages). If `false` expanded rows
   * will not be considered for pagination (which means expanded rows will always
   * render on their parents page. This also means more rows will be rendered than
   * the set page size)
   */
  paginateExpandedRows?: boolean
}

export interface ExpandedInstance<TData extends RowData> {
  /** @internal */
  _autoResetExpanded: () => void
  /** @internal */
  _getExpandedRowModel?: () => RowModel<TData>
  /**
   * Returns whether there are any rows that can be expanded.
   */
  getCanSomeRowsExpand: () => boolean
  /**
   * Returns the maximum depth of the expanded rows.
   */
  getExpandedDepth: () => number
  /**
   * Returns the row model after expansion has been applied.
   */
  getExpandedRowModel: () => RowModel<TData>
  /**
   * Returns whether all rows are currently expanded.
   */
  getIsAllRowsExpanded: () => boolean
  /**
   * Returns whether there are any rows that are currently expanded.
   */
  getIsSomeRowsExpanded: () => boolean
  /**
   * Returns the row model before expansion has been applied.
   */
  getPreExpandedRowModel: () => RowModel<TData>
  /**
   * Returns a handler that can be used to toggle the expanded state of all rows.
   * This handler is meant to be used with an `input[type=checkbox]` element.
   */
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  /**
   * Resets the expanded state of the table to the initial state.
   */
  resetExpanded: (defaultState?: boolean) => void
  /**
   * Updates the expanded state of the table via an update function or value.
   */
  setExpanded: (updater: Updater<ExpandedState>) => void
  /**
   * Toggles the expanded state for all rows.
   */
  toggleAllRowsExpanded: (expanded?: boolean) => void
}

export const Expanding: TableFeature = {
  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: TableInstance<TData>,
  ): void => {
    row.toggleExpanded = (expanded) => {
      table.setExpanded((old) => {
        const exists = old === true ? true : !!old?.[row.id]

        let oldExpanded: ExpandedStateList = {}

        if (old === true) {
          Object.keys(table.getRowModel().rowsById).forEach((rowId) => {
            oldExpanded[rowId] = true
          })
        } else {
          oldExpanded = old
        }

        expanded = expanded ?? !exists

        if (!exists && expanded) {
          return {
            ...oldExpanded,
            [row.id]: true,
          }
        }

        if (exists && !expanded) {
          const {[row.id]: _, ...rest} = oldExpanded
          return rest
        }

        return old
      })
    }
    row.getIsExpanded = () => {
      const expanded = table.getState().expanded

      return !!(
        table.options.getIsRowExpanded?.(row) ??
        (expanded === true || expanded?.[row.id])
      )
    }
    row.getCanExpand = () => {
      return (
        table.options.getRowCanExpand?.(row) ??
        ((table.options.enableExpanding ?? true) && !!row.subRows?.length)
      )
    }
    row.getIsAllParentsExpanded = () => {
      let isFullyExpanded = true
      let currentRow = row

      while (isFullyExpanded && currentRow.parentId) {
        currentRow = table.getRow(currentRow.parentId, true)
        isFullyExpanded = currentRow.getIsExpanded()
      }

      return isFullyExpanded
    }
    row.getToggleExpandedHandler = () => {
      const canExpand = row.getCanExpand()

      return () => {
        if (!canExpand) {
          return
        }
        row.toggleExpanded()
      }
    }
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    let registered = false
    let queued = false

    table._autoResetExpanded = () => {
      if (!registered) {
        table._queue(() => {
          registered = true
        })
        return
      }

      if (
        table.options.autoResetAll ??
        table.options.autoResetExpanded ??
        !table.options.manualExpanding
      ) {
        if (queued) {
          return
        }
        queued = true
        table._queue(() => {
          table.resetExpanded()
          queued = false
        })
      }
    }
    table.setExpanded = (updater) => table.options.onExpandedChange?.(updater)
    table.toggleAllRowsExpanded = (expanded) => {
      if (expanded ?? !table.getIsAllRowsExpanded()) {
        table.setExpanded(true)
      } else {
        table.setExpanded({})
      }
    }
    table.resetExpanded = (defaultState) => {
      table.setExpanded(
        defaultState ? {} : (table.initialState?.expanded ?? {}),
      )
    }
    table.getCanSomeRowsExpand = () => {
      return table
        .getPrePaginationRowModel()
        .flatRows.some((row) => row.getCanExpand())
    }
    table.getToggleAllRowsExpandedHandler = () => {
      return (e: unknown) => {
        ;(e as any).persist?.()
        table.toggleAllRowsExpanded()
      }
    }
    table.getIsSomeRowsExpanded = () => {
      const expanded = table.getState().expanded
      return expanded === true || Object.values(expanded).some(Boolean)
    }
    table.getIsAllRowsExpanded = () => {
      const expanded = table.getState().expanded

      // If expanded is true, save some cycles and return true
      if (typeof expanded === "boolean") {
        return expanded === true
      }

      if (!Object.keys(expanded).length) {
        return false
      }

      // If any row is not expanded, return false
      if (table.getRowModel().flatRows.some((row) => !row.getIsExpanded())) {
        return false
      }

      // They must all be expanded :shrug:
      return true
    }
    table.getExpandedDepth = () => {
      let maxDepth = 0

      const rowIds =
        table.getState().expanded === true
          ? Object.keys(table.getRowModel().rowsById)
          : Object.keys(table.getState().expanded)

      rowIds.forEach((id) => {
        const splitId = id.split(".")
        maxDepth = Math.max(maxDepth, splitId.length)
      })

      return maxDepth
    }
    table.getPreExpandedRowModel = () => table.getSortedRowModel()
    table.getExpandedRowModel = () => {
      if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
        table._getExpandedRowModel = table.options.getExpandedRowModel(table)
      }

      if (table.options.manualExpanding || !table._getExpandedRowModel) {
        return table.getPreExpandedRowModel()
      }

      return table._getExpandedRowModel()
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): ExpandedOptions<TData> => {
    return {
      onExpandedChange: makeStateUpdater("expanded", table),
      paginateExpandedRows: true,
    }
  },

  getInitialState: (state): ExpandedTableState => {
    return {
      expanded: {},
      ...state,
    }
  },
}
