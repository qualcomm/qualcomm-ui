// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterPanelApiProps} from "@qualcomm-ui/core/filter-panel"

import type {Column, RowData, TableInstance} from "./types.js"

export type TableFilterPanelProps = Pick<
  FilterPanelApiProps,
  | "getFilterLabel"
  | "getFilterOptionLabel"
  | "isEmptyValue"
  | "onValueChange"
  | "value"
>

/**
 * Returns filter panel props that bind the panel to a table's column filters.
 * Empty-value detection uses each column's filter function `autoRemove`, and
 * labels resolve from the column's `getFilterLabel` and
 * `getFilterOptionLabel`. Filter ids without a matching column fall back to
 * the panel defaults.
 */
export function getTableFilterPanelProps<TData extends RowData>(
  table: TableInstance<TData>,
): TableFilterPanelProps {
  /**
   * `table.getColumn` logs an error for unknown ids, but filter ids are not
   * required to match a column.
   */
  const findColumn = (id: string): Column<TData, unknown> | undefined =>
    table.getAllFlatColumns().find((column) => column.id === id)

  return {
    getFilterLabel: (id) => findColumn(id)?.getFilterLabel(),
    getFilterOptionLabel: (id, value) =>
      findColumn(id)?.getFilterOptionLabel(value),
    isEmptyValue: (id, value) => {
      const column = findColumn(id)
      return !!column?.getFilterFn()?.autoRemove?.(value, column)
    },
    onValueChange: (value) => table.setColumnFilters(value),
    value: table.getState().columnFilters,
  }
}
