// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableInstance} from "@qualcomm-ui/core/table"
import type {PaginationRootProps} from "@qualcomm-ui/react/pagination"
import {defined} from "@qualcomm-ui/utils/guard"
import {warnOnce} from "@qualcomm-ui/utils/warning"

export interface UseTablePaginationOptions {
  /**
   * The total number of data items. When using manual pagination, you must provide
   * this for accurate page counts.
   */
  totalCount?: number
}

function getCount<TData extends object>(
  table: TableInstance<TData>,
  opts: UseTablePaginationOptions,
): number {
  if (defined(opts.totalCount)) {
    return opts.totalCount
  }
  /**
   * `totalCount` is often undefined while the first page loads, so only a
   * missing option counts as a mistake.
   */
  if (table.options.manualPagination && !("totalCount" in opts)) {
    warnOnce(
      "useTablePagination-totalCount",
      "useTablePagination: pass `totalCount` when the table uses `manualPagination`. Without it, the count is estimated as `pageCount * pageSize`, which rounds the last page up to a full page.",
    )
  }
  if (table.options.manualPagination || defined(table.options.pageCount)) {
    /**
     * The table only holds the current page, so the page count is the only
     * measure of the full dataset.
     */
    return table.getPageCount() * table.getState().pagination.pageSize
  }
  return table.getPrePaginationRowModel().rows.length
}

export function useTablePagination<TData extends object = NonNullable<unknown>>(
  table: TableInstance<TData>,
  opts: UseTablePaginationOptions = {},
): Omit<PaginationRootProps, "children"> {
  return {
    count: getCount(table, opts),
    onPageChange: (page) => table.setPageIndex(page - 1),
    onPageSizeChange: (pageSize) => table.setPageSize(pageSize),
    page: table.getState().pagination.pageIndex + 1,
    pageSize: table.getState().pagination.pageSize,
  }
}
