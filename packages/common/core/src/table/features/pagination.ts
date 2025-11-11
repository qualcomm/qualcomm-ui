// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableFeature} from "../core/table"
import type {
  OnChangeFn,
  RowData,
  RowModel,
  TableInstance,
  Updater,
} from "../types"
import {functionalUpdate, makeStateUpdater, memo} from "../utils"

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface PaginationTableState {
  pagination: PaginationState
}

export interface PaginationInitialTableState {
  pagination?: Partial<PaginationState>
}

export interface PaginationOptions {
  /**
   * If set to `true`, pagination will be reset to the first page when page-altering
   * state changes e.g.,`data` is updated, filters change, grouping changes, etc.
   */
  autoResetPageIndex?: boolean
  /**
   * Returns the row model after pagination has taken place, but no further.
   *
   * Pagination columns are automatically reordered by default to the start of the
   * columns list. If you would rather remove them or leave them as-is, set the
   * appropriate mode here.
   */
  getPaginationRowModel?: (
    /** @inheritDoc */
    table: TableInstance<any>,
  ) => () => RowModel<any>
  /**
   * Enables manual pagination. If this option is set to `true`, the table will not
   * automatically paginate rows using `getPaginationRowModel()` and instead will
   * expect you to manually paginate the rows before passing them to the table. This
   * is useful if you are doing server-side pagination and aggregation.
   */
  manualPagination?: boolean
  /**
   * If this function is provided, it will be called when the pagination state
   * changes and you will be expected to manage the state yourself. You can pass the
   * managed state back to the table via the `tableOptions.state.pagination` option.
   */
  onPaginationChange?: OnChangeFn<PaginationState>
  /**
   * When manually controlling pagination, you should supply a total `pageCount`
   * value to the table if you know it. If you do not know how many pages there are,
   * you can set this to `-1`.
   */
  pageCount?: number
}

export interface PaginationDefaultOptions {
  onPaginationChange: OnChangeFn<PaginationState>
}

export interface PaginationInstance<TData extends RowData> {
  /** @internal */
  _autoResetPageIndex: () => void
  /** @internal */
  _getPaginationRowModel?: () => RowModel<TData>
  /**
   * Returns whether the table can go to the next page.
   */
  getCanNextPage: () => boolean
  /**
   * Returns whether the table can go to the previous page.
   */
  getCanPreviousPage: () => boolean
  /**
   * Returns the page count. If manually paginating or controlling the pagination
   * state, this will come directly from the `options.pageCount` table option,
   * otherwise it will be calculated from the table data using the total row count
   * and current page size.
   */
  getPageCount: () => number
  /**
   * Returns an array of page options (zero-index-based) for the current page size.
   */
  getPageOptions: () => number[]
  /**
   * Returns the row model for the table after pagination has been applied.
   */
  getPaginationRowModel: () => RowModel<TData>
  /**
   * Returns the row model for the table before any pagination has been applied.
   */
  getPrePaginationRowModel: () => RowModel<TData>
  /**
   * Increments the page index by one, if possible.
   */
  nextPage: () => void
  /**
   * Decrements the page index by one, if possible.
   */
  previousPage: () => void
  /**
   * Resets the page index to its initial state. If `defaultState` is `true`, the
   * page index will be reset to `0` regardless of initial state.
   */
  resetPageIndex: (defaultState?: boolean) => void
  /**
   * Resets the page size to its initial state. If `defaultState` is `true`, the
   * page size will be reset to `10` regardless of initial state.
   */
  resetPageSize: (defaultState?: boolean) => void
  /**
   * Resets the `pagination` state to `initialState.pagination`, or `true` can be
   * passed to force a default blank state reset to `[]`.
   */
  resetPagination: (defaultState?: boolean) => void
  /**
   * Updates the page count using the provided function or value.
   */
  setPageCount: (updater: Updater<number>) => void
  /**
   * Updates the page index using the provided function or value in the
   * `state.pagination.pageIndex` state.
   */
  setPageIndex: (updater: Updater<number>) => void
  /**
   * Updates the page size using the provided function or value in the
   * `state.pagination.pageSize` state.
   */
  setPageSize: (updater: Updater<number>) => void
  /**
   * Sets or updates the `state.pagination` state.
   */
  setPagination: (updater: Updater<PaginationState>) => void
}

const defaultPageIndex = 0
const defaultPageSize = 10

const getDefaultPaginationState = (): PaginationState => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize,
})

export const Pagination: TableFeature = {
  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    let registered = false
    let queued = false

    table._autoResetPageIndex = () => {
      if (!registered) {
        table._queue(() => {
          registered = true
        })
        return
      }

      if (
        table.options.autoResetAll ??
        table.options.autoResetPageIndex ??
        !table.options.manualPagination
      ) {
        if (queued) {
          return
        }
        queued = true
        table._queue(() => {
          table.resetPageIndex()
          queued = false
        })
      }
    }
    table.setPagination = (updater) => {
      const safeUpdater: Updater<PaginationState> = (old) => {
        const newState = functionalUpdate(updater, old)

        return newState
      }

      return table.options.onPaginationChange?.(safeUpdater)
    }
    table.resetPagination = (defaultState) => {
      table.setPagination(
        defaultState
          ? getDefaultPaginationState()
          : (table.initialState.pagination ?? getDefaultPaginationState()),
      )
    }
    table.setPageIndex = (updater) => {
      table.setPagination((old) => {
        let pageIndex = functionalUpdate(updater, old.pageIndex)

        const maxPageIndex =
          typeof table.options.pageCount === "undefined" ||
          table.options.pageCount === -1
            ? Number.MAX_SAFE_INTEGER
            : table.options.pageCount - 1

        pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex))

        return {
          ...old,
          pageIndex,
        }
      })
    }
    table.resetPageIndex = (defaultState) => {
      table.setPageIndex(
        defaultState
          ? defaultPageIndex
          : (table.initialState?.pagination?.pageIndex ?? defaultPageIndex),
      )
    }
    table.resetPageSize = (defaultState) => {
      table.setPageSize(
        defaultState
          ? defaultPageSize
          : (table.initialState?.pagination?.pageSize ?? defaultPageSize),
      )
    }
    table.setPageSize = (updater) => {
      table.setPagination((old) => {
        const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize))
        const topRowIndex = old.pageSize * old.pageIndex
        const pageIndex = Math.floor(topRowIndex / pageSize)

        return {
          ...old,
          pageIndex,
          pageSize,
        }
      })
    }
    table.setPageCount = (updater) =>
      table.setPagination((old) => {
        let newPageCount = functionalUpdate(
          updater,
          table.options.pageCount ?? -1,
        )

        if (typeof newPageCount === "number") {
          newPageCount = Math.max(-1, newPageCount)
        }

        return {
          ...old,
          pageCount: newPageCount,
        }
      })

    table.getPageOptions = memo(
      () => [table.getPageCount()],
      (pageCount) => {
        let pageOptions: number[] = []
        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
        }
        return pageOptions
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key: process.env.NODE_ENV === "development" && "getPageOptions",
      },
    )

    table.getCanPreviousPage = () => table.getState().pagination.pageIndex > 0

    table.getCanNextPage = () => {
      const {pageIndex} = table.getState().pagination

      const pageCount = table.getPageCount()

      if (pageCount === -1) {
        return true
      }

      if (pageCount === 0) {
        return false
      }

      return pageIndex < pageCount - 1
    }

    table.previousPage = () => {
      return table.setPageIndex((old) => old - 1)
    }

    table.nextPage = () => {
      return table.setPageIndex((old) => {
        return old + 1
      })
    }

    table.getPrePaginationRowModel = () => table.getExpandedRowModel()
    table.getPaginationRowModel = () => {
      if (
        !table._getPaginationRowModel &&
        table.options.getPaginationRowModel
      ) {
        table._getPaginationRowModel =
          table.options.getPaginationRowModel(table)
      }

      if (table.options.manualPagination || !table._getPaginationRowModel) {
        return table.getPrePaginationRowModel()
      }

      return table._getPaginationRowModel()
    }

    table.getPageCount = () => {
      return (
        table.options.pageCount ??
        Math.ceil(
          table.getPrePaginationRowModel().rows.length /
            table.getState().pagination.pageSize,
        )
      )
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): PaginationDefaultOptions => {
    return {
      onPaginationChange: makeStateUpdater("pagination", table),
    }
  },

  getInitialState: (state): PaginationTableState => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state?.pagination,
      },
    }
  },
}
