// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ColumnSizing} from "../features/column-sizing"
import {Expanding} from "../features/expanding"
import {Filters} from "../features/filters"
import {Grouping} from "../features/grouping"
import {Ordering} from "../features/ordering"
import {Pagination} from "../features/pagination"
import {Pinning} from "../features/pinning"
import {RowSelection} from "../features/row-selection"
import {Sorting} from "../features/sorting"
import {Visibility} from "../features/visibility"
import type {
  Column,
  ColumnDef,
  ColumnDefResolved,
  GroupColumnDef,
  InitialTableState,
  Row,
  RowData,
  RowModel,
  TableInstance,
  TableMeta,
  TableOptions,
  TableOptionsResolved,
  TableState,
  Updater,
} from "../types"
import {functionalUpdate, memo, type RequiredKeys} from "../utils"

import {createColumn} from "./column"
import {Headers} from "./headers"

export interface TableFeature {
  createCell?: (cell: any, column: any, row: any, table: any) => any
  createColumn?: (column: any, table: any) => any
  createHeader?: (column: any, table: any) => any
  createRow?: (row: any, table: any) => any
  createTable?: (table: any) => any
  getDefaultColumnDef?: () => any
  getDefaultOptions?: (table: any) => any
  getInitialState?: (initialState?: InitialTableState) => any
}

const features = [
  Headers,
  Visibility,
  Ordering,
  Pinning,
  Filters,
  Sorting,
  Grouping,
  Expanding,
  Pagination,
  RowSelection,
  ColumnSizing,
] as const

export interface CoreTableState {}

export interface CoreOptions<TData extends RowData> {
  /**
   * Set this option to override any of the `autoReset...` feature options.
   */
  autoResetAll?: boolean

  /**
   * The array of column defs to use for the table.
   *
   * @inheritDoc
   */
  columns: ColumnDef<TData, any>[]

  /**
   * The data for the table to display. This array should match the type you
   * provided to `table.setRowType<...>`. Columns can access this data via
   * string/index or a functional accessor. When the `data` option changes
   * reference, the table will reprocess the data.
   */
  data: TData[]

  /**
   * Set this option to `true` to output all debugging information to the console.
   */
  debugAll?: boolean

  /**
   * Set this option to `true` to output column debugging information to the console.
   */
  debugColumns?: boolean

  /**
   * Set this option to `true` to output header debugging information to the console.
   */
  debugHeaders?: boolean

  /**
   * Set this option to `true` to output row debugging information to the console.
   */
  debugRows?: boolean

  /**
   * Set this option to `true` to output table debugging information to the console.
   */
  debugTable?: boolean

  /**
   * Default column options to use for all column defs supplied to the table.
   *
   * @inheritDoc
   */
  defaultColumn?: Partial<ColumnDef<TData>>

  /**
   * This required option is a factory for a function that computes and returns the
   * core row model for the table.
   *
   * @inheritDoc
   */
  getCoreRowModel?: (table: TableInstance<any>) => () => RowModel<any>

  /**
   * This optional function is used to derive a unique ID for any given row. If not
   * provided the rows index is used (nested rows join together with `.` using their
   * grandparents' index e.g.,`index.index.index`). If you need to identify
   * individual rows that are originating from any server-side operations, it's
   * suggested you use this function to return an ID that makes sense regardless of
   * network IO/ambiguity e.g., a userId, taskId, database ID field, etc.
   *
   * @example getRowId: row => row.userI
   */
  getRowId?: (
    originalRow: TData,
    index: number,
    /** @inheritDoc */
    parent?: Row<TData>,
  ) => string

  /**
   * This optional function is used to access the sub rows for any given row. If you
   * are using nested rows, you will need to use this function to return the sub
   * rows object (or undefined) from the row.
   *
   * @example getSubRows: row => row.subRow
   */
  getSubRows?: (originalRow: TData, index: number) => undefined | TData[]

  /**
   * Use this option to optionally pass initial state to the table. This state will
   * be used when resetting various table states either automatically by the table
   * (e.g.,`options.autoResetPageIndex`) or via functions like
   * `table.resetRowSelection()`. Most reset functions allow you to optionally pass a
   * flag to reset to a blank/default state instead of the initial state.
   *
   * Table state will not be reset when this object changes, which also means that
   * the initial state object does not need to be stable.
   *
   * @inheritDoc
   */
  initialState?: InitialTableState

  /**
   * This option is used to optionally implement the merging of table options.
   *
   * @inheritDoc
   */
  mergeOptions?: (
    /** @inheritDoc */
    defaultOptions: TableOptions<TData>,
    /** @inheritDoc */
    options: Partial<TableOptions<TData>>,
  ) => TableOptions<TData>

  /**
   * You can pass any object to `options.meta` and access it anywhere the `table` is
   * available via `table.options.meta`.
   *
   * @inheritDoc
   */
  meta?: TableMeta<TData>

  /**
   * The `onStateChange` option can be used to optionally listen to state changes
   * within the table.
   *
   * @inheritDoc
   */
  onStateChange: (updater: Updater<TableState>) => void

  /**
   * Value used when the desired value is not found in the data.
   */
  renderFallbackValue: any

  /**
   * The `state` option can be used to optionally _control_ part or all of the table
   * state. The state you pass here will merge with and overwrite the internal
   * automatically-managed state to produce the final state for the table. You can
   * also listen to state changes via the `onStateChange` option. > Note: Any state
   * passed in here will override both the internal state and any other
   * `initialState` you provide.
   *
   * @inheritDoc
   */
  state: Partial<TableState>
}

export interface CoreInstance<TData extends RowData> {
  /** @internal */
  _features: readonly TableFeature[]
  /** @internal */
  _getAllFlatColumnsById: () => Record<string, Column<TData, unknown>>
  /** @internal */
  _getColumnDefs: () => ColumnDef<TData, unknown>[]
  /** @internal */
  _getCoreRowModel?: () => RowModel<TData>
  /** @internal */
  _getDefaultColumnDef: () => Partial<ColumnDef<TData, unknown>>
  /** @internal */
  _getRowId: (_: TData, index: number, parent?: Row<TData>) => string
  /** @internal */
  _queue: (cb: () => void) => void

  /**
   * Returns all columns in the table in their normalized and nested hierarchy.
   *
   * @inheritDoc
   */
  getAllColumns: () => Column<TData, unknown>[]

  /**
   * Returns all columns in the table flattened to a single level.
   *
   * @inheritDoc
   */
  getAllFlatColumns: () => Column<TData, unknown>[]

  /**
   * Returns all leaf-node columns in the table flattened to a single level. This
   * does not include parent columns.
   *
   * @inheritDoc
   */
  getAllLeafColumns: () => Column<TData, unknown>[]

  /**
   * Returns a single column by its ID.
   *
   * @inheritDoc
   */
  getColumn: (columnId: string) => Column<TData, unknown> | undefined

  /**
   * Returns the core row model before any processing has been applied.
   *
   * @inheritDoc
   */
  getCoreRowModel: () => RowModel<TData>

  /**
   * Returns the row with the given ID.
   *
   * @inheritDoc
   */
  getRow: (id: string, searchAll?: boolean) => Row<TData>

  /**
   * Returns the final model after all processing from other used features has been
   * applied. This is the row model that is most commonly used for rendering.
   *
   * @inheritDoc
   */
  getRowModel: () => RowModel<TData>

  /**
   * Call this function to get the table's current state. It's recommended to use
   * this function and its state, especially when managing the table state manually.
   * It is the exact same state used internally by the table for every feature and
   * function it provides.
   *
   * @inheritDoc
   */
  getState: () => TableState

  /**
   * This is the resolved initial state of the table.
   *
   * @inheritDoc
   */
  initialState: TableState

  /**
   * A read-only reference to the table's current options.
   *
   * @inheritDoc
   */
  options: RequiredKeys<TableOptionsResolved<TData>, "state">

  /**
   * Call this function to reset the table state to the initial state.
   */
  reset: () => void

  /**
   * This function can be used to provide new table options.
   *
   * @inheritDoc
   */
  setOptions: (newOptions: Updater<TableOptionsResolved<TData>>) => void

  /**
   * Call this function to update the table state.
   *
   * @inheritDoc
   */
  setState: (updater: Updater<TableState>) => void

  /**
   * Use this function to update the table options.
   *
   * @inheritDoc
   */
  updateOptions: (options: Partial<TableOptionsResolved<TData>>) => void
}

export function createTable<TData extends RowData>(
  options: TableOptionsResolved<TData>,
): TableInstance<TData> {
  if (options.debugAll || options.debugTable) {
    console.info("Creating Table Instance...")
  }

  const table = {_features: features} as unknown as TableInstance<TData>

  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(table))
  }, {}) as TableOptionsResolved<TData>

  const mergeOptions = (options: TableOptionsResolved<TData>) => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options)
    }

    return {
      ...defaultOptions,
      ...options,
    }
  }

  const coreInitialState: CoreTableState = {}

  let initialState = {
    ...coreInitialState,
    ...(options.initialState ?? {}),
  } as TableState

  table._features.forEach((feature) => {
    initialState = feature.getInitialState?.(initialState) ?? initialState
  })

  const queued: (() => void)[] = []
  let queuedTimeout = false

  const coreInstance: CoreInstance<TData> = {
    _features: features,
    _getAllFlatColumnsById: memo(
      () => [table.getAllFlatColumns()],
      (flatColumns) => {
        return flatColumns.reduce(
          (acc, column) => {
            acc[column.id] = column
            return acc
          },
          {} as Record<string, Column<TData, unknown>>,
        )
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getAllFlatColumnsById",
      },
    ),
    _getColumnDefs: () => table.options.columns,
    _getDefaultColumnDef: memo(
      () => [table.options.defaultColumn],
      (defaultColumn) => {
        defaultColumn = (defaultColumn ?? {}) as Partial<
          ColumnDef<TData, unknown>
        >

        return {
          cell: (props) => props.getValue(),

          header: (props: any) => {
            const resolvedColumnDef = props.header.column
              .columnDef as ColumnDefResolved<TData>

            if (resolvedColumnDef.accessorKey) {
              return resolvedColumnDef.accessorKey
            }

            if (resolvedColumnDef.accessorFn) {
              return resolvedColumnDef.id
            }

            return null
          },
          ...table._features.reduce((obj, feature) => {
            return Object.assign(obj, feature.getDefaultColumnDef?.())
          }, {}),
          ...defaultColumn,
        } as Partial<ColumnDef<TData, unknown>>
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getDefaultColumnDef",
      },
    ),
    _getRowId: (row: TData, index: number, parent?: Row<TData>) =>
      table.options.getRowId?.(row, index, parent) ??
      `${parent ? [parent.id, index].join(".") : index}`,
    _queue: (cb) => {
      queued.push(cb)

      if (!queuedTimeout) {
        queuedTimeout = true

        // Schedule a microtask to run the queued callbacks after
        // the current call stack (render, etc) has finished.
        Promise.resolve()
          .then(() => {
            while (queued.length) {
              queued.shift()!()
            }
            queuedTimeout = false
          })
          .catch((error) =>
            setTimeout(() => {
              throw error
            }),
          )
      }
    },

    getAllColumns: memo(
      () => [table._getColumnDefs()],
      (columnDefs) => {
        const recurseColumns = (
          columnDefs: ColumnDef<TData, unknown>[],
          parent?: Column<TData, unknown>,
          depth = 0,
        ): Column<TData, unknown>[] => {
          return columnDefs.map((columnDef) => {
            const column = createColumn(table, columnDef, depth, parent)

            const groupingColumnDef = columnDef as GroupColumnDef<
              TData,
              unknown
            >

            column.columns = groupingColumnDef.columns
              ? recurseColumns(groupingColumnDef.columns, column, depth + 1)
              : []

            return column
          })
        }

        return recurseColumns(columnDefs)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getAllColumns",
      },
    ),

    getAllFlatColumns: memo(
      () => [table.getAllColumns()],
      (allColumns) => {
        return allColumns.flatMap((column) => {
          return column.getFlatColumns()
        })
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getAllFlatColumns",
      },
    ),

    getAllLeafColumns: memo(
      () => [table.getAllColumns(), table._getOrderColumnsFn()],
      (allColumns, orderColumns) => {
        const leafColumns = allColumns.flatMap((column) =>
          column.getLeafColumns(),
        )
        return orderColumns(leafColumns)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === "development" && "getAllLeafColumns",
      },
    ),

    getColumn: (columnId) => {
      const column = table._getAllFlatColumnsById()[columnId]

      if (process.env.NODE_ENV !== "production" && !column) {
        console.error(`[Table] Column with id '${columnId}' does not exist.`)
      }

      return column
    },

    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options?.getCoreRowModel?.(table)
      }

      return table._getCoreRowModel!()
    },

    getRow: (id: string, searchAll?: boolean) => {
      let row = (
        searchAll ? table.getPrePaginationRowModel() : table.getRowModel()
      ).rowsById[id]

      if (!row) {
        row = table.getCoreRowModel().rowsById[id]
        if (!row) {
          if (process.env.NODE_ENV !== "production") {
            throw new Error(`getRow could not find row with ID: ${id}`)
          }
          throw new Error()
        }
      }

      return row
    },

    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => {
      return table.getPaginationRowModel()
    },

    getState: () => {
      return table.options.state as TableState
    },

    initialState,

    options: {
      ...defaultOptions,
      ...options,
    },

    reset: () => {
      table.setState(table.initialState)
    },

    setOptions: (updater) => {
      const newOptions = functionalUpdate(updater, table.options)
      table.options = mergeOptions(newOptions) as RequiredKeys<
        TableOptionsResolved<TData>,
        "state"
      >
    },

    setState: (updater: Updater<TableState>) => {
      table.options.onStateChange?.(updater)
    },

    updateOptions: (options) => {
      table.options = {...table.options, ...options}
    },
  }

  Object.assign(table, coreInstance)

  for (let index = 0; index < table._features.length; index++) {
    const feature = table._features[index]
    feature?.createTable?.(table)
  }

  return table
}
