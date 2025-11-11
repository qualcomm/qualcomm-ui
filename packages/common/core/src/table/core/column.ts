// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  AccessorFn,
  Column,
  ColumnDef,
  ColumnDefResolved,
  ColumnMeta,
  RowData,
  TableInstance,
} from "../types"
import {memo} from "../utils"

export interface CoreColumn<TData extends RowData, TValue, TColumnMeta> {
  /**
   * The resolved accessor function to use when extracting the value for the column
   * from each row. Will only be defined if the column def has a valid accessor key
   * or function defined.
   */
  accessorFn?: AccessorFn<TData, TValue>

  /**
   * The original column def used to create the column.
   *
   * @inheritDoc
   */
  columnDef: ColumnDef<TData, TValue, TColumnMeta>

  /**
   * The child column (if the column is a group column). Will be an empty array if
   * the column is not a group column.
   *
   * @inheritDoc
   */
  columns: Column<TData, TValue>[]

  /**
   * The depth of the column (if grouped) relative to the root column def array.
   */
  depth: number

  /**
   * Returns the flattened array of this column and all child/grand-child columns
   * for this column.
   *
   * @inheritDoc
   */
  getFlatColumns: () => Column<TData, TValue>[]

  /**
   * Returns an array of all leaf-node columns for this column. If a column has no
   * children, it is considered the only leaf-node column.
   *
   * @inheritDoc
   */
  getLeafColumns: () => Column<TData, TValue>[]

  /**
   * The resolved unique identifier for the column resolved in this priority:
   * - A manual `id` property from the column def
   * - The accessor key from the column def
   * - The header string from the column def
   */
  id: string

  /**
   * The parent column for this column. Will be undefined if this is a root column.
   *
   * @inheritDoc
   */
  parent?: Column<TData, TValue>
}

export function createColumn<
  TData extends RowData,
  TValue,
  TColumnMeta = ColumnMeta,
>(
  table: TableInstance<TData>,
  columnDef: ColumnDef<TData, TValue>,
  depth: number,
  parent?: Column<TData, TValue>,
): Column<TData, TValue> {
  const defaultColumn = table._getDefaultColumnDef()

  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef,
  } as ColumnDefResolved<TData>

  const accessorKey = resolvedColumnDef.accessorKey

  const id =
    resolvedColumnDef.id ??
    (accessorKey ? accessorKey.replace(".", "_") : undefined) ??
    (typeof resolvedColumnDef.header === "string"
      ? resolvedColumnDef.header
      : undefined)

  let accessorFn: AccessorFn<TData> | undefined

  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn
  } else if (accessorKey) {
    // Support deep accessor keys
    if (accessorKey.includes(".")) {
      accessorFn = (originalRow: TData) => {
        let result = originalRow as Record<string, any>

        for (const key of accessorKey.split(".")) {
          result = result?.[key]
          if (process.env.NODE_ENV !== "production" && result === undefined) {
            console.warn(
              `"${key}" in deeply nested key "${accessorKey}" returned undefined.`,
            )
          }
        }

        return result
      }
    } else {
      accessorFn = (originalRow: TData) =>
        (originalRow as any)[resolvedColumnDef.accessorKey]
    }
  }

  if (!id) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        resolvedColumnDef.accessorFn
          ? `Columns require an id when using an accessorFn`
          : `Columns require an id when using a non-string header`,
      )
    }
    throw new Error()
  }

  const column: CoreColumn<TData, any, TColumnMeta> = {
    accessorFn,
    columnDef: resolvedColumnDef as ColumnDef<TData, any, TColumnMeta>,
    columns: [],
    depth,
    getFlatColumns: memo(
      () => [true],
      () => {
        return [
          column as unknown as Column<TData, TValue>,
          ...column.columns?.flatMap((d) => d.getFlatColumns()),
        ]
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "production" && "column.getFlatColumns",
      },
    ),
    getLeafColumns: memo(
      () => [table._getOrderColumnsFn()],
      (orderColumns) => {
        if (column.columns?.length) {
          const leafColumns = column.columns.flatMap((column) =>
            column.getLeafColumns(),
          )

          return orderColumns(leafColumns)
        }

        return [column as unknown as Column<TData, TValue>]
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "production" && "column.getLeafColumns",
      },
    ),
    id: `${String(id)}`,
    parent: parent as any,
  }

  for (const feature of table._features) {
    feature.createColumn?.(column, table)
  }

  return column as unknown as Column<TData, TValue>
}
