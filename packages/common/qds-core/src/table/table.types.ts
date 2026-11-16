// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Cell, Header, Row, SortDirection} from "@qualcomm-ui/core/table"
import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {QdsTagApiProps} from "@qualcomm-ui/qds-core/tag"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {JSX} from "@qualcomm-ui/utils/machine"

import type {tableClasses} from "./table.classes.js"

export type QdsTableSize = "sm" | "md" | "lg"

export type QdsTableSortDirection = "asc" | "desc" | "none"

export interface QdsTableApiProps {
  /**
   * If `true`, the table will render a vertical divider between columns.
   */
  showColumnDivider?: boolean

  /**
   * Governs the size and padding of table elements and text.
   *
   * @default 'md'
   */
  size?: QdsTableSize
}

export interface QdsTableCellProps {
  /**
   * The data model for this cell.
   */
  cell?: Cell<any>
}

export interface QdsTableHeaderCellProps {
  /**
   * The order of this column header in the table.
   */
  columnIndex?: number | undefined

  /**
   * If `true`, the column header is currently being dragged.
   */
  isDragging?: boolean

  /**
   * If `true`, another column header is being dragged over this header.
   */
  isDraggingOver?: boolean

  /**
   * If `true`, the header is currently being resized.
   */
  isResizing?: boolean
}

export interface QdsTableRowProps {
  /**
   * If `true`, the row is currently being dragged.
   */
  isDragging?: boolean

  /**
   * If `true`, another row is being dragged over this row.
   */
  isDraggingOver?: boolean

  /**
   * If `true`, the row is currently selected.
   *
   * @remarks
   *
   * This will not enable selection on the row. Its impact is merely
   * presentational. To enable row selection, you will need to pass in the
   * corresponding options to the table component. Refer to the
   * {@link https://react-table.qui.qualcomm.com/features/row-selection row selection}
   * documentation for an example.
   */
  isSelected?: boolean
}

export interface QdsTableRowDropIndicatorProps {
  /**
   * The closest edge of the row that the indicator is being dragged over.
   */
  closestEdge?: "top" | "bottom" | "left" | "right" | undefined
  /**
   * The index of the row that the indicator belongs to.
   */
  rowIndex?: number | undefined
  /**
   * The index of the row being dragged.
   */
  sourceIndex?: number | undefined
}

export interface QdsTableColumnDropIndicatorProps {
  /**
   * The closest edge of the column that the indicator is being dragged over.
   */
  closestEdge?: "top" | "bottom" | "left" | "right" | undefined
  /**
   * The index of the column that the indicator belongs to.
   */
  columnIndex?: number | undefined
  /**
   * The index of the column being dragged.
   */
  sourceColumnIndex?: number | undefined
}

export interface QdsTableColumnSortActionProps {
  /**
   * The column header associated with the sort action.
   */
  header: Header<any>
  isSorted?: false | SortDirection
}

/**
 * @deprecated will be removed in the next major version.
 */
export interface QdsTableColumnFilterProps {
  canFilter?: boolean | undefined
  /**
   * The column header associated with the filter.
   */
  header?: Header<any>
  isFiltered?: boolean | undefined
}

type TableClasses = typeof tableClasses

export interface QdsTableRootBindings {
  className: TableClasses["root"]
  "data-show-column-divider": BooleanDataAttr
  "data-size": QdsTableSize
}

export interface QdsTableTableBindings {
  className: TableClasses["table"]
}

export interface QdsTableHeaderBindings {
  className: TableClasses["header"]
}

export interface QdsTableRowBindings {
  className: TableClasses["row"]
  "data-dragging": BooleanDataAttr
  "data-dragging-over": BooleanDataAttr
  "data-selected": BooleanDataAttr
}

export interface QdsTableHeaderCellBindings {
  className: TableClasses["headerCell"]
  "data-dragging": BooleanDataAttr
  "data-dragging-over": BooleanDataAttr
  "data-resizing": BooleanDataAttr
}

export interface QdsTableCellBindings {
  className: TableClasses["cell"]
  "data-aggregated": BooleanDataAttr
  "data-grouped": BooleanDataAttr
}

export interface QdsTableBodyBindings {
  className: TableClasses["body"]
}

export interface QdsTableFooterBindings {
  className: TableClasses["footer"]
}

export interface QdsTableScrollContainerBindings {
  className: TableClasses["scrollContainer"]
}

/**
 * @deprecated in next-release, replaced by {@link QdsTableToolbarRootBindings}.
 * Will be removed in the next major version.
 */
export interface QdsTableActionBarBindings {
  className: TableClasses["actionBar"]
}

export interface QdsTableTitleBarBindings {
  className: TableClasses["titleBar"]
}

export interface QdsTableColumnHeaderActionBindings {
  className: TableClasses["columnHeaderAction"]
}

export interface QdsTableColumnSortActionBindings {
  "aria-label": "Sort descending" | "Sort ascending" | "Remove sort"
  className: TableClasses["columnSortAction"]
  "data-sort-direction": SortDirection | undefined
  onClick: JSX.MouseEventHandler
}

/**
 * @deprecated will be removed in the next major version.
 */
export interface QdsTableColumnFilterActionBindings {
  className: TableClasses["columnFilterAction"]
  "data-is-filtered": BooleanDataAttr
}

export interface QdsTableRowDragPreviewBindings {
  className: TableClasses["dragPreview"]
}

export interface QdsTableRowDropIndicatorBindings {
  className: TableClasses["rowDropIndicator"]
  "data-closest-edge": "top" | "bottom" | "left" | "right" | undefined
  "data-drag-direction": "down" | "up"
  "data-is-over-source": BooleanDataAttr
}

export interface QdsTableColumnDropIndicatorBindings {
  className: TableClasses["columnDropIndicator"]
  "data-closest-edge": "top" | "bottom" | "left" | "right" | undefined
  "data-drag-direction": "left" | "right"
  "data-is-over-source": BooleanDataAttr
}

export interface QdsTableColumnDragPreviewBindings {
  className: TableClasses["dragPreview"]
}

export interface QdsTableDragHandleBindings {
  className: TableClasses["dragHandle"]
}

export interface QdsTablePaginationBindings {
  className: TableClasses["pagination"]
}

export interface QdsTableColumnResizerBindings {
  className: TableClasses["columnResizer"]
  "data-resizing": BooleanDataAttr
  onDoubleClick: JSX.MouseEventHandler<any>
  onMouseDown: JSX.MouseEventHandler<any>
  onTouchStart: JSX.TouchEventHandler<any>
}

export interface QdsTableColumnResizerProps {
  header: Header<any>
}

export interface QdsTableCellActionBindings {
  className: TableClasses["cellAction"]
}

export interface QdsTableRowExpandButtonBindings {
  "aria-label": "Expand row" | "Collapse row"
  className: TableClasses["rowExpandButton"]
  "data-expanded": BooleanDataAttr
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
}

export interface QdsTableRowExpandButtonProps {
  isExpanded?: boolean
  row: Row<any>
}

export interface QdsTableApi {
  /**
   * @deprecated in next-release, replaced by
   * {@link QdsTableRootApi.getToolbarBindings}. Will be removed in the next major
   * version.
   */
  getActionBarBindings(): QdsTableActionBarBindings
  getBodyBindings(): QdsTableBodyBindings
  getCellActionBindings(): QdsTableCellActionBindings
  getCellBindings(props: QdsTableCellProps): QdsTableCellBindings
  getColumnDragPreviewBindings(): QdsTableColumnDragPreviewBindings
  getColumnDropIndicatorBindings(
    props: QdsTableColumnDropIndicatorProps,
  ): QdsTableColumnDropIndicatorBindings
  /**
   * @deprecated will be removed in the next major version.
   */
  getColumnFilterActionBindings(
    props: QdsTableColumnFilterProps,
  ): QdsTableColumnFilterActionBindings
  getColumnHeaderActionBindings(): QdsTableColumnHeaderActionBindings
  getColumnResizerBindings(
    props: QdsTableColumnResizerProps,
  ): QdsTableColumnResizerBindings
  getColumnSortActionBindings(
    props: QdsTableColumnSortActionProps,
  ): QdsTableColumnSortActionBindings
  getDragHandleBindings(): QdsTableDragHandleBindings
  getFooterBindings(): QdsTableFooterBindings
  getHeaderBindings(): QdsTableHeaderBindings
  getHeaderCellBindings(
    props: QdsTableHeaderCellProps,
  ): QdsTableHeaderCellBindings
  getPaginationBindings(): QdsTablePaginationBindings
  /** @deprecated since next-release. No longer used, migrate to {@link QdsTableRootApi} */
  getRootBindings(props: QdsTableApiProps): QdsTableRootBindings
  getRowBindings(props: QdsTableRowProps): QdsTableRowBindings
  getRowDragPreviewBindings(): QdsTableRowDragPreviewBindings
  getRowDropIndicatorBindings(
    props: QdsTableRowDropIndicatorProps,
  ): QdsTableRowDropIndicatorBindings
  getRowExpandButtonBindings(
    props: QdsTableRowExpandButtonProps,
  ): QdsTableRowExpandButtonBindings
  getScrollContainerBindings(): QdsTableScrollContainerBindings
  getTableBindings(): QdsTableTableBindings
  getTitleBarBindings(): QdsTableTitleBarBindings
}

export interface QdsTableToolbarRootBindings {
  className: TableClasses["toolbarRoot"]
  "data-size": QdsTableSize
}

export interface QdsTableToolbarStartBindings {
  className: TableClasses["toolbarStart"]
}

export interface QdsTableToolbarEndBindings {
  className: TableClasses["toolbarEnd"]
}

export interface QdsTableFilterPanelRootBindings {
  className: TableClasses["filterPanelRoot"]
  "data-size": QdsTableSize
}

export interface QdsTableFilterPanelHeaderBindings {
  className: TableClasses["filterPanelHeader"]
}

export interface QdsTableFilterPanelHeadingBindings {
  className: TableClasses["filterPanelHeading"]
}

export interface QdsTableFilterPanelSectionBindings {
  className: TableClasses["filterPanelSection"]
}

export interface QdsTablePlaceholderRootBindings {
  className: TableClasses["placeholderRoot"]
  "data-size": QdsTableSize
}

export interface QdsTablePlaceholderActionBindings {
  className: TableClasses["placeholderAction"]
}

export interface QdsTablePlaceholderDescriptionBindings {
  className: TableClasses["placeholderDescription"]
}

export interface QdsTablePlaceholderHeadingBindings {
  className: TableClasses["placeholderHeading"]
}

export interface QdsTableAppliedFilterBarRootBindings {
  className: TableClasses["appliedFilterBarRoot"]
  "data-size": QdsTableSize
}

export interface QdsTableAppliedFilterBarFilterListProps {
  /**
   * Whether every applied filter is visible. When `false`, the list is clamped
   * to a single row.
   */
  expanded?: boolean
}

export interface QdsTableAppliedFilterBarFilterListBindings {
  className: TableClasses["appliedFilterBarFilterList"]
  "data-expanded": BooleanDataAttr
}

export interface QdsTableAppliedFilterBarFilterChipBindings {
  className: TableClasses["appliedFilterBarFilterChip"]
}

export interface QdsTableAppliedFilterBarClearTriggerBindings {
  className: TableClasses["appliedFilterBarClearTrigger"]
}

export interface QdsTableAppliedFilterBarExpandTriggerProps {
  /**
   * Whether every applied filter is visible. Toggles between the "Show more"
   * and "Show less" states.
   */
  expanded?: boolean
}

export interface QdsTableAppliedFilterBarExpandTriggerBindings {
  className: TableClasses["appliedFilterBarExpandTrigger"]
  "data-expanded": BooleanDataAttr
}

export interface QdsTableRootApi {
  getAppliedFilterBarBindings(): QdsTableAppliedFilterBarRootBindings
  getAppliedFilterBarButtonProps(): QdsButtonApiProps
  getAppliedFilterBarClearTriggerBindings(): QdsTableAppliedFilterBarClearTriggerBindings
  getAppliedFilterBarExpandTriggerBindings(
    props: QdsTableAppliedFilterBarExpandTriggerProps,
  ): QdsTableAppliedFilterBarExpandTriggerBindings
  getAppliedFilterBarFilterChipBindings(): QdsTableAppliedFilterBarFilterChipBindings
  getAppliedFilterBarFilterChipTagProps(): QdsTagApiProps
  getAppliedFilterBarFilterListBindings(
    props: QdsTableAppliedFilterBarFilterListProps,
  ): QdsTableAppliedFilterBarFilterListBindings
  getFilterPanelBindings(): QdsTableFilterPanelRootBindings
  getFilterPanelButtonProps(): QdsButtonApiProps
  getFilterPanelHeaderBindings(): QdsTableFilterPanelHeaderBindings
  getFilterPanelHeadingBindings(): QdsTableFilterPanelHeadingBindings
  getFilterPanelSectionBindings(): QdsTableFilterPanelSectionBindings
  getPlaceholderActionBindings(): QdsTablePlaceholderActionBindings
  getPlaceholderBindings(): QdsTablePlaceholderRootBindings
  getPlaceholderButtonProps(): QdsButtonApiProps
  getPlaceholderDescriptionBindings(): QdsTablePlaceholderDescriptionBindings
  getPlaceholderHeadingBindings(): QdsTablePlaceholderHeadingBindings
  getRootBindings(): QdsTableRootBindings
  getToolbarBindings(): QdsTableToolbarRootBindings
  getToolbarButtonProps(): QdsButtonApiProps
  getToolbarEndBindings(): QdsTableToolbarEndBindings
  getToolbarStartBindings(): QdsTableToolbarStartBindings
}
