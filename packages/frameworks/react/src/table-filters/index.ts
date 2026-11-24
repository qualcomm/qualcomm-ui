// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  TableFilterBarClearTrigger,
  type TableFilterBarClearTriggerProps,
} from "./table-filter-bar-clear-trigger.js"
import {
  TableFilterBarExpandTrigger,
  type TableFilterBarExpandTriggerProps,
} from "./table-filter-bar-expand-trigger.js"
import {
  TableFilterBarFilterList,
  type TableFilterBarFilterListProps,
} from "./table-filter-bar-filter-list.js"
import {
  TableFilterBarRoot,
  type TableFilterBarRootProps,
} from "./table-filter-bar-root.js"
import {
  TableFilterBar as SimpleTableFilterBar,
  type TableFilterBarProps,
} from "./table-filter-bar.js"

export {
  TableColumnFilterAction,
  type TableColumnFilterActionProps,
} from "./table-column-filter-action.js"

export type {
  TableFilterBarClearTriggerProps,
  TableFilterBarExpandTriggerProps,
  TableFilterBarFilterListProps,
  TableFilterBarProps,
  TableFilterBarRootProps,
}

type TableFilterBarComponent = typeof SimpleTableFilterBar & {
  /**
   * Removes every applied filter when clicked. Renders a `<button>` element by
   * default.
   */
  ClearTrigger: typeof TableFilterBarClearTrigger
  /**
   * Shows or hides the applied filters that don't fit on one row. Render it
   * within the `TableFilterBar.FilterList` so that it follows the last visible
   * filter. Hidden while every applied filter fits. Renders a `<button>`
   * element by default.
   */
  ExpandTrigger: typeof TableFilterBarExpandTrigger
  /**
   * Lists the applied filters as dismissable tags, followed by its children.
   * Clamped to a single row unless the filter bar is expanded. Renders a
   * `<div>` element by default.
   */
  FilterList: typeof TableFilterBarFilterList
  /**
   * The root element of the filter bar. Must be rendered within a
   * `Table.Root` and a filter set, such as a `FilterSetProvider`. Renders
   * nothing while no filters are applied. Otherwise renders a `<div>` element
   * by default.
   *
   * @example
   * ```tsx
   * <FilterSetProvider value={filterSet}>
   *   <Table.Root>
   *     <TableFilterBar.Root>
   *       <TableFilterBar.FilterList>
   *         <TableFilterBar.ExpandTrigger />
   *       </TableFilterBar.FilterList>
   *       <TableFilterBar.ClearTrigger />
   *     </TableFilterBar.Root>
   *     <Table.ScrollContainer>...</Table.ScrollContainer>
   *   </Table.Root>
   * </FilterSetProvider>
   * ```
   */
  Root: typeof TableFilterBarRoot
}

export const TableFilterBar: TableFilterBarComponent =
  SimpleTableFilterBar as TableFilterBarComponent

TableFilterBar.ClearTrigger = TableFilterBarClearTrigger
TableFilterBar.ExpandTrigger = TableFilterBarExpandTrigger
TableFilterBar.FilterList = TableFilterBarFilterList
TableFilterBar.Root = TableFilterBarRoot
