// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Row, RowData, RowModel, TableInstance} from "../types"
import {memo} from "../utils"

export function getExpandedRowModel<TData extends RowData>(): (
  table: TableInstance<TData>,
) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [
        table.getState().expanded,
        table.getPreExpandedRowModel(),
        table.options.paginateExpandedRows,
      ],
      (expanded, rowModel, paginateExpandedRows) => {
        if (
          !rowModel.rows.length ||
          (expanded !== true && !Object.keys(expanded ?? {}).length)
        ) {
          return rowModel
        }

        if (!paginateExpandedRows) {
          // Only expand rows at this point if they are being paginated
          return rowModel
        }

        return expandRows(rowModel)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key: process.env.NODE_ENV === "development" && "getExpandedRowModel",
      },
    )
}

export function expandRows<TData extends RowData>(
  rowModel: RowModel<TData>,
): {
  flatRows: Row<TData>[]
  rows: Row<TData>[]
  rowsById: Record<string, Row<TData>>
} {
  const expandedRows: Row<TData>[] = []

  const handleRow = (row: Row<TData>) => {
    expandedRows.push(row)

    if (row.subRows?.length && row.getIsExpanded()) {
      row.subRows.forEach(handleRow)
    }
  }

  rowModel.rows.forEach(handleRow)

  return {
    flatRows: rowModel.flatRows,
    rows: expandedRows,
    rowsById: rowModel.rowsById,
  }
}
