// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Cell, Row, RowData, TableInstance} from "../types"
import {flattenBy, memo} from "../utils"

import {createCell} from "./cell"

export interface CoreRow<TData extends RowData> {
  /** @internal */
  _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>
  /** @internal */
  _uniqueValuesCache: Record<string, unknown>
  /** @internal */
  _valuesCache: Record<string, unknown>

  /**
   * The depth of the row (if nested or grouped) relative to the root row array.
   */
  depth: number

  /**
   * Returns all of the cells for the row.
   *
   * @inheritDoc
   */
  getAllCells: () => Cell<TData, unknown>[]

  /**
   * Returns the leaf rows for the row, not including any parent rows.
   *
   * @inheritDoc
   */
  getLeafRows: () => Row<TData>[]

  /**
   * Returns the parent row for the row, if it exists.
   *
   * @inheritDoc
   */
  getParentRow: () => Row<TData> | undefined

  /**
   * Returns the parent rows for the row, all the way up to a root row.
   *
   * @inheritDoc
   */
  getParentRows: () => Row<TData>[]

  /**
   * Returns a unique array of values from the row for a given columnId.
   */
  getUniqueValues: <TValue>(columnId: string) => TValue[]

  /**
   * Returns the value from the row for a given columnId.
   */
  getValue: <TValue>(columnId: string) => TValue

  /**
   * The resolved unique identifier for the row resolved via the `options.getRowId`
   * option. Defaults to the row's index (or relative index if it is a subRow).
   */
  id: string

  /**
   * The index of the row within its parent array (or the root data array).
   */
  index: number

  /**
   * The original row object provided to the table. If the row is a grouped row, the
   * original row object will be the first original in the group.
   */
  original: TData

  /**
   * An array of the original subRows as returned by the `options.getSubRows` option.
   */
  originalSubRows?: TData[]

  /**
   * If nested, this row's parent row id.
   */
  parentId?: string

  /**
   * An array of subRows for the row as returned and created by the
   * `options.getSubRows` option.
   *
   * @inheritDoc
   */
  subRows: Row<TData>[]
}

export const createRow = <TData extends RowData>(
  table: TableInstance<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[],
  parentId?: string,
): Row<TData> => {
  const row: CoreRow<TData> = {
    _getAllCellsByColumnId: memo(
      () => [row.getAllCells()],
      (allCells) => {
        return allCells.reduce(
          (acc, cell) => {
            acc[cell.column.id] = cell
            return acc
          },
          {} as Record<string, Cell<TData, unknown>>,
        )
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key:
          process.env.NODE_ENV === "production" && "row.getAllCellsByColumnId",
      },
    ),
    _uniqueValuesCache: {},
    _valuesCache: {},
    depth,
    getAllCells: memo(
      () => [table.getAllLeafColumns()],
      (leafColumns) => {
        return leafColumns.map((column) => {
          return createCell(table, row as Row<TData>, column, column.id)
        })
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key: process.env.NODE_ENV === "development" && "row.getAllCells",
      },
    ),
    getLeafRows: () => flattenBy(row.subRows, (d) => d.subRows),
    getParentRow: () =>
      row.parentId ? table.getRow(row.parentId, true) : undefined,
    getParentRows: () => {
      const parentRows: Row<TData>[] = []
      let currentRow = row
      while (true) {
        const parentRow = currentRow.getParentRow()
        if (!parentRow) {
          break
        }
        parentRows.push(parentRow)
        currentRow = parentRow
      }
      return parentRows.reverse()
    },
    getUniqueValues: (columnId) => {
      if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
        return row._uniqueValuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column?.accessorFn) {
        return undefined
      }

      if (!column.columnDef.getUniqueValues) {
        row._uniqueValuesCache[columnId] = [row.getValue(columnId)]
        return row._uniqueValuesCache[columnId]
      }

      row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
        row.original,
        rowIndex,
      )

      return row._uniqueValuesCache[columnId] as any
    },
    getValue: (columnId) => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column?.accessorFn) {
        return undefined
      }

      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex)

      return row._valuesCache[columnId] as any
    },
    id,
    index: rowIndex,
    original,
    parentId,
    subRows: subRows ?? [],
  }

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i]
    feature?.createRow?.(row, table)
  }

  return row as Row<TData>
}
