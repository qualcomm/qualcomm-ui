// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, type Signal} from "@angular/core"

import type {RowData} from "@qualcomm-ui/core/table"

import type {AngularTable} from "./create-angular-table"
import {lazyInit} from "./lazy-signal-initializer"

export interface CreateTablePaginationOptions {
  /**
   * The total number of data items. When using manual pagination, you must provide
   * this for accurate page counts.
   */
  totalCount?: Signal<number>
}

export interface TablePagination {
  count: Signal<number>
  onPageChange: (page: number) => void
  onPageSizeChange: (rows: number) => void
  page: Signal<number>
  pageSize: Signal<number>
}

/**
 * A helper function that creates an object. The properties on the object derive the
 * QUI Pagination state from the current table state, or update it.
 */
export function createTablePagination<TData extends RowData>(
  table: AngularTable<TData>,
  opts: CreateTablePaginationOptions = {},
): TablePagination {
  return lazyInit<TablePagination>(() => {
    return {
      count: computed(() => {
        // recompute whenever state changes
        table.getState()
        const total = opts.totalCount?.()
        const rows = table.getFilteredRowModel().rows
        return total || rows.length
      }),
      onPageChange: (page: number) => table.setPageIndex(page - 1),
      onPageSizeChange: table.setPageSize,
      page: computed(() => table.getState().pagination.pageIndex + 1),
      pageSize: computed(() => table.getState().pagination.pageSize),
    }
  })
}
