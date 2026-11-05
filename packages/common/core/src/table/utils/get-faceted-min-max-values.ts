// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RowData, TableInstance} from "../types.js"
import {memo} from "../utils.js"

export function getFacetedMinMaxValues<TData extends RowData>(): (
  table: TableInstance<TData>,
  columnId: string,
) => () => undefined | [number, number] {
  return (table, columnId) =>
    memo(
      () => [table.getColumn(columnId)?.getFacetedRowModel()],
      (facetedRowModel) => {
        if (!facetedRowModel) {
          return undefined
        }

        let facetedMinMaxValues: [number, number] | undefined

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const values =
            facetedRowModel.flatRows[i].getUniqueValues<number>(columnId)

          for (let j = 0; j < values.length; j++) {
            const value = values[j]

            if (typeof value !== "number" || Number.isNaN(value)) {
              continue
            }

            if (!facetedMinMaxValues) {
              facetedMinMaxValues = [value, value]
              continue
            }

            if (value < facetedMinMaxValues[0]) {
              facetedMinMaxValues[0] = value
            } else if (value > facetedMinMaxValues[1]) {
              facetedMinMaxValues[1] = value
            }
          }
        }

        return facetedMinMaxValues
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key:
          process.env.NODE_ENV === "development" &&
          `getFacetedMinMaxValues_${columnId}`,
        onChange: () => {},
      },
    )
}
