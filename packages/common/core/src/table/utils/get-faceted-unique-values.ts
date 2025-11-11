// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RowData, TableInstance} from "../types"
import {memo} from "../utils"

export function getFacetedUniqueValues<TData extends RowData>(): (
  table: TableInstance<TData>,
  columnId: string,
) => () => Map<any, number> {
  return (table, columnId) =>
    memo(
      () => [table.getColumn(columnId)?.getFacetedRowModel()],
      (facetedRowModel) => {
        if (!facetedRowModel) {
          return new Map()
        }

        const facetedUniqueValues = new Map<any, number>()

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const values =
            facetedRowModel.flatRows[i].getUniqueValues<number>(columnId)

          for (let j = 0; j < values.length; j++) {
            const value = values[j]

            if (facetedUniqueValues.has(value)) {
              facetedUniqueValues.set(
                value,
                (facetedUniqueValues.get(value) ?? 0) + 1,
              )
            } else {
              facetedUniqueValues.set(value, 1)
            }
          }
        }

        return facetedUniqueValues
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key:
          process.env.NODE_ENV === "development" &&
          `getFacetedUniqueValues_${columnId}`,
        onChange: () => {},
      },
    )
}
