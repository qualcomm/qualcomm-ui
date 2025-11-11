// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CellContext, RowModel} from ".."
import {aggregationFns, type BuiltInAggregationFn} from "../aggregation-fns"
import type {TableFeature} from "../core/table"
import type {
  AggregationFns,
  Cell,
  Column,
  ColumnDefTemplate,
  ColumnMeta,
  OnChangeFn,
  Row,
  RowData,
  TableInstance,
  Updater,
} from "../types"
import {isFunction, makeStateUpdater} from "../utils"

export type GroupingState = string[]

export interface GroupingTableState {
  grouping: GroupingState
}

export type AggregationFn<TData extends RowData> = (
  /**
   * The id of the column.
   */
  columnId: string,
  /** @inheritDoc */
  leafRows: Row<TData>[],
  /** @inheritDoc */
  childRows: Row<TData>[],
) => any

export type CustomAggregationFns = Record<string, AggregationFn<any>>

export type AggregationFnOption<TData extends RowData> =
  | "auto"
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>

export interface GroupingColumnDef<TData extends RowData, TValue> {
  /**
   * The cell to display each row for the column if the cell is an aggregate.
   */
  aggregatedCell?: ColumnDefTemplate<CellContext<TData, TValue>>
  /**
   * The resolved aggregation function for the column.
   *
   * @inheritDoc
   */
  aggregationFn?: AggregationFnOption<TData>
  /**
   * Enables/disables grouping for this column.
   */
  enableGrouping?: boolean
  /**
   * Specify a value to be used for grouping rows on this column. If this option is
   * not specified, the value derived from `accessorKey` / `accessorFn` will be used
   * instead.
   */
  getGroupingValue?: (row: TData) => any
}

export interface GroupingColumn<TData extends RowData> {
  /**
   * Returns the aggregation function for the column.
   *
   * @inheritDoc
   */
  getAggregationFn: () => AggregationFn<TData> | undefined
  /**
   * Returns the automatically inferred aggregation function for the column.
   *
   * @inheritDoc
   */
  getAutoAggregationFn: () => AggregationFn<TData> | undefined
  /**
   * Returns whether the column can be grouped.
   */
  getCanGroup: () => boolean
  /**
   * Returns the index of the column in the grouping state.
   */
  getGroupedIndex: () => number
  /**
   * Returns whether the column is currently grouped.
   */
  getIsGrouped: () => boolean
  /**
   * Returns a function that toggles the grouping state of the column. This is
   * useful for passing to the `onClick` prop of a button.
   */
  getToggleGroupingHandler: () => () => void
  /**
   * Toggles the grouping state of the column.
   */
  toggleGrouping: () => void
}

export interface GroupingRow {
  /** @internal */
  _groupingValuesCache: Record<string, any>
  /**
   * Returns the grouping value for any row and column (including leaf rows).
   */
  getGroupingValue: (columnId: string) => unknown
  /**
   * Returns whether the row is currently grouped.
   */
  getIsGrouped: () => boolean
  /**
   * If this row is grouped, this is the id of the column that this row is grouped
   * by.
   */
  groupingColumnId?: string
  /**
   * If this row is grouped, this is the unique/shared value for the
   * `groupingColumnId` for all of the rows in this group.
   */
  groupingValue?: unknown
}

export interface GroupingCell {
  /**
   * Returns whether the cell is currently aggregated.
   */
  getIsAggregated: () => boolean
  /**
   * Returns whether the cell is currently grouped.
   */
  getIsGrouped: () => boolean
  /**
   * Returns whether the cell is currently a placeholder cell.
   */
  getIsPlaceholder: () => boolean
}

export interface ColumnDefaultOptions {
  enableGrouping: boolean
  onGroupingChange: OnChangeFn<GroupingState>
}

interface GroupingOptionsBase {
  /**
   * Enables/disables grouping for the table.
   */
  enableGrouping?: boolean
  /**
   * Returns the row model after grouping has taken place, but no further.
   */
  getGroupedRowModel?: (
    /** @inheritDoc */
    table: TableInstance<any>,
  ) => () => RowModel<any>
  /**
   * Grouping columns are automatically reordered by default to the start of the
   * columns list. If you would rather remove them or leave them as-is, set the
   * appropriate mode here.
   */
  groupedColumnMode?: false | "reorder" | "remove"
  /**
   * Enables manual grouping. If this option is set to `true`, the table will not
   * automatically group rows using `getGroupedRowModel()` and instead will expect
   * you to manually group the rows before passing them to the table. This is useful
   * if you are doing server-side grouping and aggregation.
   */
  manualGrouping?: boolean
  /**
   * If this function is provided, it will be called when the grouping state changes
   * and you will be expected to manage the state yourself. You can pass the managed
   * state back to the table via the `tableOptions.state.grouping` option.
   */
  onGroupingChange?: OnChangeFn<GroupingState>
}

type ResolvedAggregationFns = keyof AggregationFns extends never
  ? {
      /** @inheritDoc */
      aggregationFns?: Record<string, AggregationFn<any>>
    }
  : {
      /** @inheritDoc */
      aggregationFns: Record<keyof AggregationFns, AggregationFn<any>>
    }

export interface GroupingOptions
  extends GroupingOptionsBase,
    ResolvedAggregationFns {}

export type GroupingColumnMode = false | "reorder" | "remove"

export interface GroupingInstance<TData extends RowData> {
  /** @internal */
  _getGroupedRowModel?: () => RowModel<TData>
  /**
   * Returns the row model for the table after grouping has been applied.
   */
  getGroupedRowModel: () => RowModel<TData>
  /**
   * Returns the row model for the table before any grouping has been applied.
   */
  getPreGroupedRowModel: () => RowModel<TData>
  /**
   * Resets the `grouping` state to `initialState.grouping`, or `true` can be
   * passed to force a default blank state reset to `[]`.
   */
  resetGrouping: (defaultState?: boolean) => void
  /**
   * Updates the grouping state of the table via an update function or value.
   */
  setGrouping: (updater: Updater<GroupingState>) => void
}

//

export const Grouping: TableFeature = {
  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
  ): void => {
    cell.getIsGrouped = () =>
      column.getIsGrouped() && column.id === row.groupingColumnId
    cell.getIsPlaceholder = () => !cell.getIsGrouped() && column.getIsGrouped()
    cell.getIsAggregated = () =>
      !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!row.subRows?.length
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: TableInstance<TData>,
  ): void => {
    column.toggleGrouping = () => {
      table.setGrouping((old) => {
        // Find any existing grouping for this column
        if (old?.includes(column.id)) {
          return old.filter((d) => d !== column.id)
        }

        return [...(old ?? []), column.id]
      })
    }

    column.getCanGroup = () => {
      return (
        column.columnDef.enableGrouping ??
        true ??
        table.options.enableGrouping ??
        true ??
        !!column.accessorFn
      )
    }

    column.getIsGrouped = () => {
      return table.getState().grouping?.includes(column.id)
    }

    column.getGroupedIndex = () => table.getState().grouping?.indexOf(column.id)

    column.getToggleGroupingHandler = () => {
      const canGroup = column.getCanGroup()

      return () => {
        if (!canGroup) {
          return
        }
        column.toggleGrouping()
      }
    }
    column.getAutoAggregationFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0]

      const value = firstRow?.getValue(column.id)

      if (typeof value === "number") {
        return aggregationFns.sum
      }

      if (Object.prototype.toString.call(value) === "[object Date]") {
        return aggregationFns.extent
      }

      return undefined
    }
    column.getAggregationFn = () => {
      if (!column) {
        throw new Error()
      }

      return isFunction(column.columnDef.aggregationFn)
        ? column.columnDef.aggregationFn
        : column.columnDef.aggregationFn === "auto"
          ? column.getAutoAggregationFn()
          : (table.options.aggregationFns?.[
              column.columnDef.aggregationFn as string
            ] ??
            aggregationFns[
              column.columnDef.aggregationFn as BuiltInAggregationFn
            ])
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: TableInstance<TData>,
  ): void => {
    row.getIsGrouped = () => !!row.groupingColumnId
    row.getGroupingValue = (columnId) => {
      if (row._groupingValuesCache.hasOwnProperty(columnId)) {
        return row._groupingValuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column?.columnDef.getGroupingValue) {
        return row.getValue(columnId)
      }

      row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
        row.original,
      )

      return row._groupingValuesCache[columnId]
    }
    row._groupingValuesCache = {}
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    table.setGrouping = (updater) => table.options.onGroupingChange?.(updater)

    table.resetGrouping = (defaultState) => {
      table.setGrouping(
        defaultState ? [] : (table.initialState?.grouping ?? []),
      )
    }

    table.getPreGroupedRowModel = () => table.getFilteredRowModel()
    table.getGroupedRowModel = () => {
      if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
        table._getGroupedRowModel = table.options.getGroupedRowModel(table)
      }

      if (table.options.manualGrouping || !table._getGroupedRowModel) {
        return table.getPreGroupedRowModel()
      }

      return table._getGroupedRowModel()
    }
  },

  getDefaultColumnDef: <TData extends RowData>(): GroupingColumnDef<
    TData,
    unknown
  > => {
    return {
      aggregatedCell: (props) =>
        (props.getValue() as any)?.toString?.() ?? null,
      aggregationFn: "auto",
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): GroupingOptions => {
    return {
      groupedColumnMode: "reorder",
      onGroupingChange: makeStateUpdater("grouping", table),
    }
  },

  getInitialState: (state): GroupingTableState => {
    return {
      grouping: [],
      ...state,
    }
  },
}

export function orderColumns<TData extends RowData>(
  leafColumns: Column<TData, unknown>[],
  grouping: string[],
  groupedColumnMode?: GroupingColumnMode,
): Column<TData, unknown, ColumnMeta>[] {
  if (!grouping?.length || !groupedColumnMode) {
    return leafColumns
  }

  const nonGroupingColumns = leafColumns.filter(
    (col) => !grouping.includes(col.id),
  )

  if (groupedColumnMode === "remove") {
    return nonGroupingColumns
  }

  const groupingColumns = grouping
    .map((g) => leafColumns.find((col) => col.id === g)!)
    .filter(Boolean)

  return [...groupingColumns, ...nonGroupingColumns]
}
