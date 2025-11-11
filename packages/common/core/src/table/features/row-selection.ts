// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableFeature} from "../core/table"
import type {
  OnChangeFn,
  Row,
  RowData,
  RowModel,
  TableInstance,
  Updater,
} from "../types"
import {makeStateUpdater, memo} from "../utils"

export type RowSelectionState = Record<string, boolean>

export interface RowSelectionTableState {
  rowSelection: RowSelectionState
}

export interface RowSelectionOptions<TData extends RowData> {
  /**
   * - Enables/disables multiple row selection for all rows in the table OR
   * - A function that given a row, returns whether to enable/disable multiple row
   * selection for that row's children/grandchildren
   */
  enableMultiRowSelection?:
    | boolean
    | ((
        /**
         * @inheritDoc
         */
        row: Row<TData>,
      ) => boolean)

  /**
   * - Enables/disables row selection for all rows in the table OR
   * - A function that given a row, returns whether to enable/disable row selection
   * for that row
   */
  enableRowSelection?:
    | boolean
    | ((
        /**
         * @inheritDoc
         */
        row: Row<TData>,
      ) => boolean)

  /**
   * Enables/disables automatic sub-row selection when a parent row is selected, or
   * a function that enables/disables automatic sub-row selection for each row. (Use
   * in combination with expanding or grouping features)
   */
  enableSubRowSelection?:
    | boolean
    | ((
        /**
         * @inheritDoc
         */
        row: Row<TData>,
      ) => boolean)

  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.rowSelection` changes. This overrides the default internal state
   * management, so you will need to persist the state change either fully or
   * partially outside of the table.
   */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export interface RowSelectionRow {
  /**
   * Returns whether the row can multi-select.
   */
  getCanMultiSelect: () => boolean

  /**
   * Returns whether the row can be selected.
   */
  getCanSelect: () => boolean

  /**
   * Returns whether the row can select sub rows automatically when the
   * parent row is selected.
   */
  getCanSelectSubRows: () => boolean

  /**
   * Returns whether all of the row's sub rows are selected.
   */
  getIsAllSubRowsSelected: () => boolean

  /**
   * Returns whether the row is selected.
   */
  getIsSelected: () => boolean

  /**
   * Returns whether some of the row's sub rows are selected.
   */
  getIsSomeSelected: () => boolean

  /**
   * Returns a handler that can be used to toggle the row.
   */
  getToggleSelectedHandler: () => (event: unknown) => void

  /**
   * Selects/deselects the row.
   */
  toggleSelected: (value?: boolean, opts?: {selectChildren?: boolean}) => void
}

export interface RowSelectionInstance<TData extends RowData> {
  /**
   * Returns the row model of all rows that are selected after filtering has been
   * applied.
   */
  getFilteredSelectedRowModel: () => RowModel<TData>

  /**
   * Returns the row model of all rows that are selected after grouping has been
   * applied.
   */
  getGroupedSelectedRowModel: () => RowModel<TData>

  /**
   * Returns whether all rows on the current page are selected.
   */
  getIsAllPageRowsSelected: () => boolean

  /**
   * Returns whether all rows in the table are selected.
   */
  getIsAllRowsSelected: () => boolean

  /**
   * Returns whether any rows on the current page are selected.
   */
  getIsSomePageRowsSelected: () => boolean

  /**
   * Returns whether any rows in the table are selected.
   */
  getIsSomeRowsSelected: () => boolean

  /**
   * Returns the core row model of all rows before row selection has been applied.
   */
  getPreSelectedRowModel: () => RowModel<TData>

  /**
   * Returns the row model of all rows that are selected.
   */
  getSelectedRowModel: () => RowModel<TData>

  /**
   * Returns a handler that can be used to toggle all rows on the current page.
   */
  getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void

  /**
   * Returns a handler that can be used to toggle all rows in the table.
   */
  getToggleAllRowsSelectedHandler: () => (event: unknown) => void

  /**
   * Resets the `rowSelection` state to the `initialState.rowSelection`, or `true`
   * can be passed to force a default blank state reset to `{}`.
   */
  resetRowSelection: (defaultState?: boolean) => void

  /**
   * Sets or updates the `state.rowSelection` state.
   */
  setRowSelection: (updater: Updater<RowSelectionState>) => void

  /**
   * Selects/deselects all rows on the current page.
   */
  toggleAllPageRowsSelected: (value?: boolean) => void

  /**
   * Selects/deselects all rows in the table.
   */
  toggleAllRowsSelected: (value?: boolean) => void
}

export const RowSelection: TableFeature = {
  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: TableInstance<TData>,
  ): void => {
    row.toggleSelected = (value, opts) => {
      const isSelected = row.getIsSelected()

      table.setRowSelection((old) => {
        value = typeof value !== "undefined" ? value : !isSelected

        if (row.getCanSelect() && isSelected === value) {
          return old
        }

        const selectedRowIds = {...old}

        mutateRowIsSelected(
          selectedRowIds,
          row.id,
          value,
          opts?.selectChildren ?? true,
          table,
        )

        return syncParentRowSelection(row, selectedRowIds, table)
      })
    }
    row.getIsSelected = () => {
      const {rowSelection} = table.getState()
      return isRowSelected(row, rowSelection)
    }

    row.getIsSomeSelected = () => {
      const {rowSelection} = table.getState()
      return isSubRowSelected(row, rowSelection, table) === "some"
    }

    row.getIsAllSubRowsSelected = () => {
      const {rowSelection} = table.getState()
      return isSubRowSelected(row, rowSelection, table) === "all"
    }

    row.getCanSelect = () => {
      if (typeof table.options.enableRowSelection === "function") {
        return table.options.enableRowSelection(row)
      }

      return table.options.enableRowSelection ?? true
    }

    row.getCanSelectSubRows = () => {
      if (typeof table.options.enableSubRowSelection === "function") {
        return table.options.enableSubRowSelection(row)
      }

      return table.options.enableSubRowSelection ?? true
    }

    row.getCanMultiSelect = () => {
      if (typeof table.options.enableMultiRowSelection === "function") {
        return table.options.enableMultiRowSelection(row)
      }

      return table.options.enableMultiRowSelection ?? true
    }
    row.getToggleSelectedHandler = () => {
      const canSelect = row.getCanSelect()

      return (e: unknown) => {
        if (!canSelect) {
          return
        }
        row.toggleSelected(
          ((e as MouseEvent).target as HTMLInputElement)?.checked,
        )
      }
    }
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    table.setRowSelection = (updater) =>
      table.options.onRowSelectionChange?.(updater)
    table.resetRowSelection = (defaultState) =>
      table.setRowSelection(
        defaultState ? {} : (table.initialState.rowSelection ?? {}),
      )
    table.toggleAllRowsSelected = (value) => {
      table.setRowSelection((old) => {
        value =
          typeof value !== "undefined" ? value : !table.getIsAllRowsSelected()

        const rowSelection = {...old}

        const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

        // We don't use `mutateRowIsSelected` here for performance reasons.
        // All the rows are flat already, so it wouldn't be worth it
        if (value) {
          preGroupedFlatRows.forEach((row) => {
            if (!row.getCanSelect()) {
              return
            }
            rowSelection[row.id] = true
          })
        } else {
          preGroupedFlatRows.forEach((row) => {
            delete rowSelection[row.id]
          })
        }

        return rowSelection
      })
    }
    table.toggleAllPageRowsSelected = (value) =>
      table.setRowSelection((old) => {
        const resolvedValue =
          typeof value !== "undefined"
            ? value
            : !table.getIsAllPageRowsSelected()

        const rowSelection: RowSelectionState = {...old}

        table.getRowModel().rows.forEach((row) => {
          mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table)
        })

        return rowSelection
      })

    table.getPreSelectedRowModel = () => table.getCoreRowModel()
    table.getSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getCoreRowModel()],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            flatRows: [],
            rows: [],
            rowsById: {},
          }
        }

        return selectRowsFn(table, rowModel)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key: process.env.NODE_ENV === "development" && "getSelectedRowModel",
      },
    )

    table.getFilteredSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getFilteredRowModel()],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            flatRows: [],
            rows: [],
            rowsById: {},
          }
        }

        return selectRowsFn(table, rowModel)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key:
          process.env.NODE_ENV === "production" &&
          "getFilteredSelectedRowModel",
      },
    )

    table.getGroupedSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getSortedRowModel()],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            flatRows: [],
            rows: [],
            rowsById: {},
          }
        }

        return selectRowsFn(table, rowModel)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugTable,
        key:
          process.env.NODE_ENV === "production" && "getGroupedSelectedRowModel",
      },
    )

    table.getIsAllRowsSelected = () => {
      const preGroupedFlatRows = table.getFilteredRowModel().flatRows
      const {rowSelection} = table.getState()

      let isAllRowsSelected = Boolean(
        preGroupedFlatRows.length && Object.keys(rowSelection).length,
      )

      if (isAllRowsSelected) {
        if (
          preGroupedFlatRows.some(
            (row) => row.getCanSelect() && !rowSelection[row.id],
          )
        ) {
          isAllRowsSelected = false
        }
      }

      return isAllRowsSelected
    }

    table.getIsAllPageRowsSelected = () => {
      const paginationFlatRows = table
        .getPaginationRowModel()
        .flatRows.filter((row) => row.getCanSelect())
      const {rowSelection} = table.getState()

      let isAllPageRowsSelected = !!paginationFlatRows.length

      if (
        isAllPageRowsSelected &&
        paginationFlatRows.some((row) => !rowSelection[row.id])
      ) {
        isAllPageRowsSelected = false
      }

      return isAllPageRowsSelected
    }

    table.getIsSomeRowsSelected = () => {
      const totalSelected = Object.keys(
        table.getState().rowSelection ?? {},
      ).length
      return (
        totalSelected > 0 &&
        totalSelected < table.getFilteredRowModel().flatRows.length
      )
    }

    table.getIsSomePageRowsSelected = () => {
      const paginationFlatRows = table.getPaginationRowModel().flatRows
      return table.getIsAllPageRowsSelected()
        ? false
        : paginationFlatRows
            .filter((row) => row.getCanSelect())
            .some((d) => d.getIsSelected() || d.getIsSomeSelected())
    }

    table.getToggleAllRowsSelectedHandler = () => {
      return (e: unknown) => {
        table.toggleAllRowsSelected(
          ((e as MouseEvent).target as HTMLInputElement).checked,
        )
      }
    }

    table.getToggleAllPageRowsSelectedHandler = () => {
      return (e: unknown) => {
        table.toggleAllPageRowsSelected(
          ((e as MouseEvent).target as HTMLInputElement).checked,
        )
      }
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): RowSelectionOptions<TData> => {
    return {
      enableMultiRowSelection: true,
      enableRowSelection: true,
      enableSubRowSelection: true,
      onRowSelectionChange: makeStateUpdater("rowSelection", table),
    }
  },

  getInitialState: (state): RowSelectionTableState => {
    return {
      rowSelection: {},
      ...state,
    }
  },
}

const mutateRowIsSelected = <TData extends RowData>(
  selectedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  includeChildren: boolean,
  table: TableInstance<TData>,
) => {
  const row = table.getRow(id, true)

  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key])
    }
    if (row.getCanSelect()) {
      selectedRowIds[id] = true
    }
  } else {
    delete selectedRowIds[id]
  }

  if (includeChildren && row.subRows?.length && row.getCanSelectSubRows()) {
    row.subRows.forEach((row) =>
      mutateRowIsSelected(
        selectedRowIds,
        row.id,
        value,
        includeChildren,
        table,
      ),
    )
  }
}

export function selectRowsFn<TData extends RowData>(
  table: TableInstance<TData>,
  rowModel: RowModel<TData>,
): RowModel<TData> {
  const rowSelection = table.getState().rowSelection

  const newSelectedFlatRows: Row<TData>[] = []
  const newSelectedRowsById: Record<string, Row<TData>> = {}

  // Filters top level and nested rows
  const recurseRows = (rows: Row<TData>[], depth = 0): Row<TData>[] => {
    return rows
      .map((row) => {
        const isSelected = isRowSelected(row, rowSelection)

        if (isSelected) {
          newSelectedFlatRows.push(row)
          newSelectedRowsById[row.id] = row
        }

        if (row.subRows?.length) {
          row = {
            ...row,
            subRows: recurseRows(row.subRows, depth + 1),
          }
        }

        if (isSelected) {
          return row
        }

        return undefined
      })
      .filter(Boolean) as Row<TData>[]
  }

  return {
    flatRows: newSelectedFlatRows,
    rows: recurseRows(rowModel.rows),
    rowsById: newSelectedRowsById,
  }
}

/**
 * When child rows are updated, the parent state is not properly synced.
 * When all children are selected, the parent should be selected.
 * When only some children are selected, the parent should be indeterminate.
 * When no children are selected, the parent should be unselected.
 */
function syncParentRowSelection<TData extends RowData>(
  row: Row<TData>,
  selection: RowSelectionState,
  table: TableInstance<TData>,
): RowSelectionState {
  const parentRow = row.getParentRow()
  if (!parentRow) {
    return selection
  }

  const selected = isRowSelected(parentRow, selection)
  const isAllSubRowsSelected =
    isSubRowSelected(parentRow, selection, table) === "all"

  if (isAllSubRowsSelected && !selected) {
    mutateRowIsSelected(selection, parentRow.id, true, false, table)
  } else if (!isAllSubRowsSelected && selected) {
    mutateRowIsSelected(selection, parentRow.id, false, false, table)
  }

  return syncParentRowSelection(parentRow, selection, table)
}

export function isRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: RowSelectionState,
): boolean {
  return selection[row.id] ?? false
}

export function isSubRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: RowSelectionState,
  table: TableInstance<TData>,
): boolean | "some" | "all" {
  if (!row.subRows?.length) {
    return false
  }

  let allChildrenSelected = true
  let someSelected = false

  row.subRows.forEach((subRow) => {
    // Bail out early if we know both of these
    if (someSelected && !allChildrenSelected) {
      return
    }

    if (subRow.getCanSelect()) {
      if (isRowSelected(subRow, selection)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    }

    // Check row selection of nested subrows
    if (subRow.subRows && subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow, selection, table)
      if (subRowChildrenSelected === "all") {
        someSelected = true
      } else if (subRowChildrenSelected === "some") {
        someSelected = true
        allChildrenSelected = false
      } else {
        allChildrenSelected = false
      }
    }
  })

  return allChildrenSelected ? "all" : someSelected ? "some" : false
}
