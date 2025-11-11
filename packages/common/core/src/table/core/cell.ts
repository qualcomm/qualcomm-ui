// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  Cell,
  Column,
  ColumnMeta,
  Row,
  RowData,
  TableInstance,
} from "../types"
import {type Getter, memo} from "../utils"

export interface CellContext<
  TData extends RowData,
  TValue,
  TColumnMeta = ColumnMeta,
> {
  /** @inheritDoc */
  cell: Cell<TData, TValue, TColumnMeta>

  /** @inheritDoc */
  column: Column<TData, TValue, TColumnMeta>

  /**
   * Returns the value of the cell.
   */
  getValue: Getter<TValue>

  /** @inheritDoc */
  row: Row<TData>

  /** @inheritDoc */
  table: TableInstance<TData>
}

export interface CoreCell<
  TData extends RowData,
  TValue,
  TColumnMeta = ColumnMeta,
> {
  /**
   * The associated Column object for the cell.
   *
   * @inheritDoc
   */
  column: Column<TData, TValue, TColumnMeta>

  /**
   * Returns the rendering context for cell-based components like cells and
   * aggregated cells.
   */
  getContext: () => CellContext<TData, TValue>

  /**
   * Returns the value for the cell, accessed via the associated column's accessor
   * key or accessor function.
   */
  getValue: Getter<TValue>

  /**
   * The unique ID for the cell across the entire table.
   */
  id: string

  /**
   * The associated Row object for the cell.
   *
   * @inheritDoc
   */
  row: Row<TData>
}

export function createCell<TData extends RowData, TValue>(
  table: TableInstance<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>,
  columnId: string,
): Cell<TData, TValue> {
  const cell: CoreCell<TData, TValue> = {
    column,
    getContext: memo(
      () => [table, column, row, cell],
      (table, column, row, cell) => ({
        cell: cell as Cell<TData, TValue>,
        column,
        getValue: cell.getValue,
        row,
        table,
      }),
      {
        debug: () => table.options.debugAll,
        key: process.env.NODE_ENV === "development" && "cell.getContext",
      },
    ),
    getValue: () => row.getValue(columnId),
    id: `${row.id}_${column.id}`,
    row,
  }

  table._features.forEach((feature) => {
    feature.createCell?.(cell as Cell<TData, TValue>, column, row, table)
  }, {})

  return cell as Cell<TData, TValue>
}
