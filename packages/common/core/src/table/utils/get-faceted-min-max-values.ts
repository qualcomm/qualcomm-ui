// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RowData, TableInstance} from "../types"
import {memo} from "../utils"

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

        const firstValue =
          facetedRowModel.flatRows[0]?.getUniqueValues(columnId)

        if (typeof firstValue === "undefined") {
          return undefined
        }

        const facetedMinMaxValues: [any, any] = [firstValue, firstValue]

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const values =
            facetedRowModel.flatRows[i].getUniqueValues<number>(columnId)

          for (let j = 0; j < values.length; j++) {
            const value = values[j]

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
