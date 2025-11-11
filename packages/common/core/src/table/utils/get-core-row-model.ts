// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRow} from "../core/row"
import type {Row, RowData, RowModel, TableInstance} from "../types"
import {memo} from "../utils"

export function getCoreRowModel<TData extends RowData>(): (
  table: TableInstance<TData>,
) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [table.options.data],
      (
        data,
      ): {
        flatRows: Row<TData>[]
        rows: Row<TData>[]
        rowsById: Record<string, Row<TData>>
      } => {
        const rowModel: RowModel<TData> = {
          flatRows: [],
          rows: [],
          rowsById: {},
        }

        const accessRows = (
          originalRows: TData[],
          depth = 0,
          parentRow?: Row<TData>,
        ): Row<TData>[] => {
          const rows = [] as Row<TData>[]

          originalRows.forEach((originalRow, i) => {
            // Make the row
            const row = createRow(
              table,
              table._getRowId(originalRow, i, parentRow),
              originalRow,
              i,
              depth,
              undefined,
              parentRow?.id,
            )

            // Keep track of every row in a flat array
            rowModel.flatRows.push(row)
            // Also keep track of every row by its ID
            rowModel.rowsById[row.id] = row
            // Push table row into parent
            rows.push(row)

            // Get the original subrows
            if (table.options.getSubRows) {
              row.originalSubRows = table.options.getSubRows(originalRow, i)

              // Then recursively access them
              if (row.originalSubRows?.length) {
                row.subRows = accessRows(row.originalSubRows, depth + 1, row)
              }
            }
          })

          return rows
        }

        rowModel.rows = accessRows(data)

        return rowModel
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key: process.env.NODE_ENV === "development" && "getRowModel",
        onChange: () => {
          table._autoResetPageIndex()
        },
      },
    )
}
