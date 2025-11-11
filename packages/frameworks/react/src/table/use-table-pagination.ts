// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableInstance} from "@qualcomm-ui/core/table"
import type {PaginationRootProps} from "@qualcomm-ui/react/pagination"
import {defined} from "@qualcomm-ui/utils/guard"

export interface UseTablePaginationOptions {
  /**
   * The total number of data items. When using manual pagination, you must provide
   * this for accurate page counts.
   */
  totalCount?: number
}

export function useTablePagination<TData extends object = NonNullable<unknown>>(
  table: TableInstance<TData>,
  opts: UseTablePaginationOptions = {},
): Omit<PaginationRootProps, "children"> {
  return {
    count: defined(opts.totalCount)
      ? opts.totalCount
      : Math.ceil(table.getPageCount() * table.getState().pagination.pageSize),
    onPageChange: (page) => table.setPageIndex(page - 1),
    onPageSizeChange: (pageSize) => table.setPageSize(pageSize),
    page: table.getState().pagination.pageIndex + 1,
    pageSize: table.getState().pagination.pageSize,
  }
}
