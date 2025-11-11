// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableFeature} from "../core/table"
import type {
  Cell,
  Column,
  ColumnMeta,
  OnChangeFn,
  Row,
  RowData,
  TableInstance,
  Updater,
} from "../types"
import {makeStateUpdater, memo} from "../utils"

export type ColumnPinningPosition = false | "left" | "right"
export type RowPinningPosition = false | "top" | "bottom"

export interface ColumnPinningState {
  left?: string[]
  right?: string[]
}

export interface RowPinningState {
  bottom?: string[]
  includeLeafRows?: boolean
  includeParentRows?: boolean
  top?: string[]
}

export interface ColumnPinningTableState {
  columnPinning: ColumnPinningState
}

export interface RowPinningTableState {
  rowPinning: RowPinningState
}

export interface ColumnPinningOptions {
  /**
   * Enables/disables column pinning for the table. Defaults to `true`.
   */
  enableColumnPinning?: boolean
  /**
   * Enables/disables all pinning for the table. Defaults to `true`.
   */
  enablePinning?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.columnPinning` changes. This overrides the default internal state
   * management, so you will also need to supply `state.columnPinning` from your own
   * managed state.
   */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

export interface RowPinningOptions<TData extends RowData> {
  /**
   * Enables/disables row pinning for the table. Defaults to `true`.
   */
  enableRowPinning?:
    | boolean
    | ((
        /** @inheritDoc */
        row: Row<TData>,
      ) => boolean)

  /**
   * Include child rows when pinning parent.
   */
  includeLeafRows?: boolean

  /**
   * Include parent rows when pinning child.
   */
  includeParentRows?: boolean

  /**
   * When `false`, pinned rows will not be visible if they are filtered or paginated
   * out of the table. When `true`, pinned rows will always be visible regardless of
   * filtering or pagination. Defaults to `true`.
   */
  keepPinnedRows?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.rowPinning` changes. This overrides the default internal state
   * management, so you will also need to supply `state.rowPinning` from your own
   * managed state.
   */
  onRowPinningChange?: OnChangeFn<RowPinningState>
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface RowPinningDefaultOptions {
  onRowPinningChange: OnChangeFn<RowPinningState>
}

export interface ColumnPinningColumnDef {
  /**
   * Enables/disables column pinning for this column. Defaults to `true`.
   */
  enablePinning?: boolean
}

export interface ColumnPinningColumn {
  /**
   * Returns whether the column can be pinned.
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the column. (`'left'`, `'right'` or `false`)
   */
  getIsPinned: () => ColumnPinningPosition
  /**
   * Returns whether the column is pinned to the left.
   */
  getIsPinnedLeft: () => boolean
  /**
   * Returns whether the column is pinned to the right.
   */
  getIsPinnedRight: () => boolean
  /**
   * Returns the numeric pinned index of the column within a pinned column group.
   */
  getPinnedIndex: () => number
  /**
   * Pins a column to the `'left'` or `'right'`, or unpins the column to the center
   * if `false` is passed.
   */
  pin: (position: ColumnPinningPosition) => void
}

export interface ColumnPinningRow<TData extends RowData> {
  /**
   * Returns all center pinned (unpinned) leaf cells in the row.
   *
   * @inheritDoc
   */
  getCenterVisibleCells: () => Cell<TData, unknown>[]
  /**
   * Returns all left pinned leaf cells in the row.
   *
   * @inheritDoc
   */
  getLeftVisibleCells: () => Cell<TData, unknown>[]
  /**
   * Returns all right pinned leaf cells in the row.
   *
   * @inheritDoc
   */
  getRightVisibleCells: () => Cell<TData, unknown>[]
}

export interface RowPinningRow {
  /**
   * Returns whether the row can be pinned.
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)
   */
  getIsPinned: () => RowPinningPosition
  /**
   * Returns whether the row is pinned to the bottom.
   */
  getIsPinnedBottom: () => boolean
  /**
   * Returns whether the row is pinned to the top.
   */
  getIsPinnedTop: () => boolean
  /**
   * Returns the numeric pinned index of the row within a pinned row group.
   */
  getPinnedIndex: () => number
  /**
   * Pins a row to the `top` or `bottom` or unpins the row to the center if `false`
   * is passed.
   */
  pin: (
    position: RowPinningPosition,
    includeLeafRows?: boolean,
    includeParentRows?: boolean,
  ) => void
}

export interface ColumnPinningInstance<TData extends RowData> {
  /**
   * Returns all center pinned (unpinned) leaf columns.
   *
   * @inheritDoc
   */
  getCenterLeafColumns: () => Column<TData, unknown>[]
  /**
   * Returns whether any columns are pinned. Optionally specify to only check
   * for pinned columns in either the `left` or `right` position.
   */
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  /**
   * Returns all left pinned leaf columns.
   *
   * @inheritDoc
   */
  getLeftLeafColumns: () => Column<TData, unknown>[]
  /**
   * Returns all right pinned leaf columns.
   *
   * @inheritDoc
   */
  getRightLeafColumns: () => Column<TData, unknown>[]
  /**
   * Resets the `columnPinning` state to `initialState.columnPinning`, or `true`
   * can be passed to force a default blank state reset to `{ left: [], right: [],
   * }`.
   */
  resetColumnPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnPinning` state.
   *
   * @inheritDoc
   */
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
}

export interface RowPinningInstance<TData extends RowData> {
  /** @internal */
  _getPinnedRows: (position: "top" | "bottom") => Row<TData>[]
  /**
   * Returns all bottom pinned rows.
   *
   * @inheritDoc
   */
  getBottomRows: () => Row<TData>[]
  /**
   * Returns all rows that are not pinned to the top or bottom.
   *
   * @inheritDoc
   */
  getCenterRows: () => Row<TData>[]
  /**
   * Returns whether any rows are pinned. Optionally specify to only check
   * for pinned rows in either the `top` or `bottom` position.
   */
  getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
  /**
   * Returns all top pinned rows.
   *
   * @inheritDoc
   */
  getTopRows: () => Row<TData>[]
  /**
   * Resets the `rowPinning` state to `initialState.rowPinning`, or `true` can be
   * passed to force a default blank state reset to `{ top: [], bottom: [], }`.
   */
  resetRowPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.rowPinning` state.
   */
  setRowPinning: (updater: Updater<RowPinningState>) => void
}

const getDefaultColumnPinningState = (): ColumnPinningState => ({
  left: [],
  right: [],
})

const getDefaultRowPinningState = (): RowPinningState => ({
  bottom: [],
  includeLeafRows: false,
  includeParentRows: false,
  top: [],
})

export const Pinning: TableFeature = {
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: TableInstance<TData>,
  ): void => {
    column.pin = (position) => {
      const columnIds = column
        .getLeafColumns()
        .map((d) => d.id)
        .filter(Boolean)

      table.setColumnPinning((old) => {
        if (position === "right") {
          return {
            left: (old?.left ?? []).filter((d) => !columnIds?.includes(d)),
            right: [
              ...(old?.right ?? []).filter((d) => !columnIds?.includes(d)),
              ...columnIds,
            ],
          }
        }

        if (position === "left") {
          return {
            left: [
              ...(old?.left ?? []).filter((d) => !columnIds?.includes(d)),
              ...columnIds,
            ],
            right: (old?.right ?? []).filter((d) => !columnIds?.includes(d)),
          }
        }

        return {
          left: (old?.left ?? []).filter((d) => !columnIds?.includes(d)),
          right: (old?.right ?? []).filter((d) => !columnIds?.includes(d)),
        }
      })
    }

    column.getCanPin = () => {
      const leafColumns = column.getLeafColumns()

      return leafColumns.some(
        (d) =>
          (d.columnDef.enablePinning ?? true) &&
          (table.options.enableColumnPinning ??
            table.options.enablePinning ??
            true),
      )
    }

    column.getIsPinned = () => getIsColumnPinned(column, table)

    column.getIsPinnedLeft = () => getIsColumnPinned(column, table) === "left"

    column.getIsPinnedRight = () => getIsColumnPinned(column, table) === "right"

    column.getPinnedIndex = () => {
      const position = column.getIsPinned()

      return position
        ? (table.getState().columnPinning?.[position]?.indexOf(column.id) ?? -1)
        : 0
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: TableInstance<TData>,
  ): void => {
    row.pin = (position, includeLeafRows, includeParentRows) => {
      const leafRowIds =
        includeLeafRows || table.options.includeLeafRows
          ? row.getLeafRows().map(({id}) => id)
          : []
      const parentRowIds =
        includeParentRows || table.options.includeParentRows
          ? row.getParentRows().map(({id}) => id)
          : []
      const rowIds = new Set([...parentRowIds, row.id, ...leafRowIds])

      table.setRowPinning((old) => {
        if (position === "bottom") {
          return {
            ...old,
            bottom: [
              ...(old?.bottom ?? []).filter((d) => !rowIds?.has(d)),
              ...Array.from(rowIds),
            ],
            top: (old?.top ?? []).filter((d) => !rowIds?.has(d)),
          }
        }

        if (position === "top") {
          return {
            ...old,
            bottom: (old?.bottom ?? []).filter((d) => !rowIds?.has(d)),
            top: [
              ...(old?.top ?? []).filter((d) => !rowIds?.has(d)),
              ...Array.from(rowIds),
            ],
          }
        }

        return {
          ...old,
          bottom: (old?.bottom ?? []).filter((d) => !rowIds?.has(d)),
          top: (old?.top ?? []).filter((d) => !rowIds?.has(d)),
        }
      })
    }
    row.getCanPin = () => {
      const {enablePinning, enableRowPinning} = table.options
      if (typeof enableRowPinning === "function") {
        return enableRowPinning(row)
      }
      return enableRowPinning ?? enablePinning ?? true
    }

    row.getIsPinned = () => getIsRowPinned(row, table)

    row.getIsPinnedBottom = () => getIsRowPinned(row, table) === "bottom"

    row.getIsPinnedTop = () => getIsRowPinned(row, table) === "top"

    row.getPinnedIndex = () => {
      const position = row.getIsPinned()
      if (!position) {
        return -1
      }

      const visiblePinnedRowIds = table
        ._getPinnedRows(position)
        ?.map(({id}) => id)

      return visiblePinnedRowIds?.indexOf(row.id) ?? -1
    }
    row.getCenterVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allCells, left, right) => {
        const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

        return allCells.filter((d) => !leftAndRight.includes(d.column.id))
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key:
          process.env.NODE_ENV === "development" && "row.getCenterVisibleCells",
      },
    )
    row.getLeftVisibleCells = memo(
      (): [Cell<TData, unknown, ColumnMeta>[], string[] | undefined] => [
        row._getAllVisibleCells(),
        table.getState().columnPinning.left,
      ],
      (allCells, left) => {
        const cells = (left ?? [])
          .map(
            (columnId) => allCells.find((cell) => cell.column.id === columnId)!,
          )
          .filter(Boolean)
          .map((d) => ({...d, position: "left"}) as Cell<TData, unknown>)

        return cells
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key:
          process.env.NODE_ENV === "development" && "row.getLeftVisibleCells",
      },
    )
    row.getRightVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
      (allCells, right) => {
        const cells = (right ?? [])
          .map(
            (columnId) => allCells.find((cell) => cell.column.id === columnId)!,
          )
          .filter(Boolean)
          .map((d) => ({...d, position: "right"}) as Cell<TData, unknown>)

        return cells
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key:
          process.env.NODE_ENV === "development" && "row.getRightVisibleCells",
      },
    )
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    table.setColumnPinning = (updater) =>
      table.options.onColumnPinningChange?.(updater)

    table.resetColumnPinning = (defaultState) =>
      table.setColumnPinning(
        defaultState
          ? getDefaultColumnPinningState()
          : (table.initialState?.columnPinning ??
              getDefaultColumnPinningState()),
      )

    table.getIsSomeColumnsPinned = (position) => {
      const pinningState = table.getState().columnPinning

      if (!position) {
        return Boolean(pinningState.left?.length || pinningState.right?.length)
      }
      return Boolean(pinningState[position]?.length)
    }

    table.getLeftLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.left],
      (allColumns, left) => {
        return (left ?? [])
          .map(
            (columnId) => allColumns.find((column) => column.id === columnId)!,
          )
          .filter(Boolean)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getLeftLeafColumns",
      },
    )

    table.getRightLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.right],
      (allColumns, right) => {
        return (right ?? [])
          .map(
            (columnId) => allColumns.find((column) => column.id === columnId)!,
          )
          .filter(Boolean)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getRightLeafColumns",
      },
    )

    table.getCenterLeafColumns = memo(
      () => [
        table.getAllLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, left, right) => {
        const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

        return allColumns.filter((d) => !leftAndRight.includes(d.id))
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getCenterLeafColumns",
      },
    )

    table.setRowPinning = (updater) =>
      table.options.onRowPinningChange?.(updater)

    table.resetRowPinning = (defaultState) =>
      table.setRowPinning(
        defaultState
          ? getDefaultRowPinningState()
          : (table.initialState?.rowPinning ?? getDefaultRowPinningState()),
      )

    table.getIsSomeRowsPinned = (position) => {
      const pinningState = table.getState().rowPinning

      if (!position) {
        return Boolean(pinningState.top?.length || pinningState.bottom?.length)
      }
      return Boolean(pinningState[position]?.length)
    }

    table._getPinnedRows = (position: "top" | "bottom") =>
      memo(
        () => [table.getRowModel().rows, table.getState().rowPinning[position]],
        (visibleRows, pinnedRowIds) => {
          const rows =
            (table.options.keepPinnedRows ?? true)
              ? // get all rows that are pinned even if they would not be otherwise visible
                // account for expanded parent rows, but not pagination or filtering
                (pinnedRowIds ?? []).map((rowId) => {
                  const row = table.getRow(rowId, true)
                  return row.getIsAllParentsExpanded() ? row : null
                })
              : // else get only visible rows that are pinned
                (pinnedRowIds ?? []).map(
                  (rowId) => visibleRows.find((row) => row.id === rowId)!,
                )

          return rows
            .filter(Boolean)
            .map((d) => ({...d, position})) as Row<TData>[]
        },
        {
          debug: () => table.options.debugAll ?? table.options.debugRows,
          key:
            process.env.NODE_ENV === "development" &&
            `row.get${position === "top" ? "Top" : "Bottom"}Rows`,
        },
      )()

    table.getTopRows = () => table._getPinnedRows("top")

    table.getBottomRows = () => table._getPinnedRows("bottom")

    table.getCenterRows = memo(
      () => [
        table.getRowModel().rows,
        table.getState().rowPinning.top,
        table.getState().rowPinning.bottom,
      ],
      (allRows, top, bottom) => {
        const topAndBottom = new Set([...(top ?? []), ...(bottom ?? [])])
        return allRows.filter((d) => !topAndBottom.has(d.id))
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key: process.env.NODE_ENV === "development" && "row.getCenterRows",
      },
    )
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): ColumnPinningDefaultOptions & RowPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater("columnPinning", table),
      onRowPinningChange: makeStateUpdater("rowPinning", table),
    }
  },

  getInitialState: (state): ColumnPinningTableState & RowPinningState => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      rowPinning: getDefaultRowPinningState(),
      ...state,
    }
  },
}

function getIsColumnPinned<TData extends RowData>(
  column: Column<TData>,
  table: TableInstance<TData>,
) {
  const leafColumnIds = column.getLeafColumns().map((d) => d.id)

  const {left, right} = table.getState().columnPinning

  const isLeft = leafColumnIds.some((d) => left?.includes(d))
  const isRight = leafColumnIds.some((d) => right?.includes(d))

  return isLeft ? "left" : isRight ? "right" : false
}

function getIsRowPinned<TData extends RowData>(
  row: Row<TData>,
  table: TableInstance<TData>,
) {
  const rowIds = [row.id]

  const {bottom, top} = table.getState().rowPinning

  const isTop = rowIds.some((d) => top?.includes(d))
  const isBottom = rowIds.some((d) => bottom?.includes(d))

  return isTop ? "top" : isBottom ? "bottom" : false
}
