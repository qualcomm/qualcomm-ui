// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableFeature} from "../core/table"
import type {
  Cell,
  Column,
  OnChangeFn,
  Row,
  RowData,
  TableInstance,
  Updater,
} from "../types"
import {makeStateUpdater, memo} from "../utils"

export type VisibilityState = Record<string, boolean>

export interface VisibilityTableState {
  columnVisibility: VisibilityState
}

export interface VisibilityOptions {
  enableHiding?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.columnVisibility` changes. This overrides the default internal state
   * management, so you will need to persist the state change either fully or
   * partially outside of the table.
   *
   * @inheritDoc
   */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
}

export type VisibilityDefaultOptions = Pick<
  VisibilityOptions,
  "onColumnVisibilityChange"
>

export interface VisibilityInstance<TData extends RowData> {
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible
   * in the unpinned/center portion of the table.
   *
   * @inheritDoc
   */
  getCenterVisibleLeafColumns: () => Column<TData, unknown>[]
  /**
   * Returns whether all columns are visible
   */
  getIsAllColumnsVisible: () => boolean
  /**
   * Returns whether any columns are visible
   */
  getIsSomeColumnsVisible: () => boolean
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible
   * in the left portion of the table.
   *
   * @inheritDoc
   */
  getLeftVisibleLeafColumns: () => Column<TData, unknown>[]
  /**
   * If column pinning, returns a flat array of leaf-node columns that are visible
   * in the right portion of the table.
   *
   * @inheritDoc
   */
  getRightVisibleLeafColumns: () => Column<TData, unknown>[]
  /**
   * Returns a handler for toggling the visibility of all columns, meant to be bound
   * to a `input[type=checkbox]` element.
   */
  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void
  /**
   * Returns a flat array of columns that are visible, including parent columns.
   *
   * @inheritDoc
   */
  getVisibleFlatColumns: () => Column<TData, unknown>[]
  /**
   * Returns a flat array of leaf-node columns that are visible.
   *
   * @inheritDoc
   */
  getVisibleLeafColumns: () => Column<TData, unknown>[]
  /**
   * Resets the column visibility state to the initial state. If `defaultState` is
   * provided, the state will be reset to `{}`
   */
  resetColumnVisibility: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnVisibility` state.
   *
   * @inheritDoc
   */
  setColumnVisibility: (updater: Updater<VisibilityState>) => void
  /**
   * Toggles the visibility of all columns.
   */
  toggleAllColumnsVisible: (value?: boolean) => void
}

export interface VisibilityColumnDef {
  /**
   * Enables/Disables hiding the column.
   */
  enableHiding?: boolean
}

export interface VisibilityRow<TData extends RowData> {
  /** @internal */
  _getAllVisibleCells: () => Cell<TData>[]
  /**
   * Returns an array of cells that account for column visibility for the row.
   *
   * @inheritDoc
   */
  getVisibleCells: () => Cell<TData>[]
}

export interface VisibilityColumn {
  /**
   * Returns whether the column can be hidden.
   */
  getCanHide: () => boolean
  /**
   * Returns whether the column is visible.
   */
  getIsVisible: () => boolean
  /**
   * Returns a function that can be used to toggle the column visibility. This
   * function can be used to bind to an event handler to an element.
   */
  getToggleVisibilityHandler: () => (event: unknown) => void
  /**
   * Toggles the visibility of the column.
   */
  toggleVisibility: (value?: boolean) => void
}

export const Visibility: TableFeature = {
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: TableInstance<TData>,
  ): void => {
    column.toggleVisibility = (value) => {
      if (column.getCanHide()) {
        table.setColumnVisibility((old) => ({
          ...old,
          [column.id]: value ?? !column.getIsVisible(),
        }))
      }
    }
    column.getIsVisible = () => {
      return table.getState().columnVisibility?.[column.id] ?? true
    }

    column.getCanHide = () => {
      return (
        (column.columnDef.enableHiding ?? true) &&
        (table.options.enableHiding ?? true)
      )
    }
    column.getToggleVisibilityHandler = () => {
      return (e: unknown) => {
        column.toggleVisibility?.(
          ((e as MouseEvent).target as HTMLInputElement).checked,
        )
      }
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: TableInstance<TData>,
  ): void => {
    row._getAllVisibleCells = memo(
      () => [row.getAllCells(), table.getState().columnVisibility],
      (cells) => {
        return cells.filter((cell) => cell.column.getIsVisible())
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key: process.env.NODE_ENV === "production" && "row._getAllVisibleCells",
      },
    )
    row.getVisibleCells = memo(
      () => [
        row.getLeftVisibleCells(),
        row.getCenterVisibleCells(),
        row.getRightVisibleCells(),
      ],
      (left, center, right) => [...left, ...center, ...right],
      {
        debug: () => table.options.debugAll ?? table.options.debugRows,
        key: process.env.NODE_ENV === "development" && "row.getVisibleCells",
      },
    )
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    const makeVisibleColumnsMethod = (
      key: string,
      getColumns: () => Column<TData, unknown>[],
    ): (() => Column<TData, unknown>[]) => {
      return memo(
        () => [
          getColumns(),
          getColumns()
            .filter((d) => d.getIsVisible())
            .map((d) => d.id)
            .join("_"),
        ],
        (columns) => {
          return columns.filter((d) => d.getIsVisible?.())
        },
        {
          debug: () => table.options.debugAll ?? table.options.debugColumns,
          key,
        },
      )
    }

    table.getVisibleFlatColumns = makeVisibleColumnsMethod(
      "getVisibleFlatColumns",
      () => table.getAllFlatColumns(),
    )
    table.getVisibleLeafColumns = makeVisibleColumnsMethod(
      "getVisibleLeafColumns",
      () => table.getAllLeafColumns(),
    )
    table.getLeftVisibleLeafColumns = makeVisibleColumnsMethod(
      "getLeftVisibleLeafColumns",
      () => table.getLeftLeafColumns(),
    )
    table.getRightVisibleLeafColumns = makeVisibleColumnsMethod(
      "getRightVisibleLeafColumns",
      () => table.getRightLeafColumns(),
    )
    table.getCenterVisibleLeafColumns = makeVisibleColumnsMethod(
      "getCenterVisibleLeafColumns",
      () => table.getCenterLeafColumns(),
    )

    table.setColumnVisibility = (updater) =>
      table.options.onColumnVisibilityChange?.(updater)

    table.resetColumnVisibility = (defaultState) => {
      table.setColumnVisibility(
        defaultState ? {} : (table.initialState.columnVisibility ?? {}),
      )
    }

    table.toggleAllColumnsVisible = (value) => {
      value = value ?? !table.getIsAllColumnsVisible()

      table.setColumnVisibility(
        table.getAllLeafColumns().reduce(
          (obj, column) => ({
            ...obj,
            [column.id]: !value ? !column.getCanHide?.() : value,
          }),
          {},
        ),
      )
    }

    table.getIsAllColumnsVisible = () =>
      !table.getAllLeafColumns().some((column) => !column.getIsVisible?.())

    table.getIsSomeColumnsVisible = () =>
      table.getAllLeafColumns().some((column) => column.getIsVisible?.())

    table.getToggleAllColumnsVisibilityHandler = () => {
      return (e: unknown) => {
        table.toggleAllColumnsVisible(
          ((e as MouseEvent).target as HTMLInputElement)?.checked,
        )
      }
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): VisibilityDefaultOptions => {
    return {
      onColumnVisibilityChange: makeStateUpdater("columnVisibility", table),
    }
  },

  getInitialState: (state): VisibilityTableState => {
    return {
      columnVisibility: {},
      ...state,
    }
  },
}
