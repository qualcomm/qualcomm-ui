// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Row, RowData, RowModel, TableInstance} from "../types"
import {memo} from "../utils"

import {filterRows} from "./filter-rows-utils"

export function getFacetedRowModel<TData extends RowData>(): (
  table: TableInstance<TData>,
  columnId: string,
) => () => RowModel<TData> {
  return (table, columnId) =>
    memo(
      () => [
        table.getPreFilteredRowModel(),
        table.getState().columnFilters,
        table.getState().globalFilter,
        table.getFilteredRowModel(),
      ],
      (preRowModel, columnFilters, globalFilter) => {
        if (
          !preRowModel.rows.length ||
          (!columnFilters?.length && !globalFilter)
        ) {
          return preRowModel
        }

        const filterableIds = [
          ...columnFilters.map((d) => d.id).filter((d) => d !== columnId),
          globalFilter ? "__global__" : undefined,
        ].filter(Boolean) as string[]

        const filterRowsImpl = (row: Row<TData>) => {
          // Horizontally filter rows through each column
          for (let i = 0; i < filterableIds.length; i++) {
            if (row.columnFilters[filterableIds[i]] === false) {
              return false
            }
          }
          return true
        }

        return filterRows(preRowModel.rows, filterRowsImpl, table)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key:
          process.env.NODE_ENV === "development" &&
          `getFacetedRowModel_${columnId}`,
        onChange: () => {},
      },
    )
}
