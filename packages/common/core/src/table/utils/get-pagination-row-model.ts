// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Row, RowData, RowModel, TableInstance} from "../types"
import {memo} from "../utils"

import {expandRows} from "./get-expanded-row-model"

export function getPaginationRowModel<TData extends RowData>(): (
  table: TableInstance<TData>,
) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [
        table.getState().pagination,
        table.getPrePaginationRowModel(),
        table.options.paginateExpandedRows
          ? undefined
          : table.getState().expanded,
      ],
      (pagination, rowModel) => {
        if (!rowModel.rows.length) {
          return rowModel
        }

        const {pageIndex, pageSize} = pagination
        let {rows} = rowModel
        const {flatRows, rowsById} = rowModel
        const pageStart = pageSize * pageIndex
        const pageEnd = pageStart + pageSize

        rows = rows.slice(pageStart, pageEnd)

        let paginatedRowModel: RowModel<TData>

        if (!table.options.paginateExpandedRows) {
          paginatedRowModel = expandRows({
            flatRows,
            rows,
            rowsById,
          })
        } else {
          paginatedRowModel = {
            flatRows,
            rows,
            rowsById,
          }
        }

        paginatedRowModel.flatRows = []

        const handleRow = (row: Row<TData>) => {
          paginatedRowModel.flatRows.push(row)
          if (row.subRows.length) {
            row.subRows.forEach(handleRow)
          }
        }

        paginatedRowModel.rows.forEach(handleRow)

        return paginatedRowModel
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key: process.env.NODE_ENV === "development" && "getPaginationRowModel",
      },
    )
}
