// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tableClasses} from "./table.classes"
import type {
  QdsTableActionBarBindings,
  QdsTableApi,
  QdsTableApiProps,
  QdsTableBodyBindings,
  QdsTableCellActionBindings,
  QdsTableCellBindings,
  QdsTableCellProps,
  QdsTableColumnDragPreviewBindings,
  QdsTableColumnDropIndicatorBindings,
  QdsTableColumnDropIndicatorProps,
  QdsTableColumnFilterActionBindings,
  QdsTableColumnFilterProps,
  QdsTableColumnHeaderActionBindings,
  QdsTableColumnResizerBindings,
  QdsTableColumnResizerProps,
  QdsTableColumnSortActionBindings,
  QdsTableColumnSortActionProps,
  QdsTableDragHandleBindings,
  QdsTableFooterBindings,
  QdsTableHeaderBindings,
  QdsTableHeaderCellBindings,
  QdsTableHeaderCellProps,
  QdsTablePaginationBindings,
  QdsTableRootBindings,
  QdsTableRowBindings,
  QdsTableRowDragPreviewBindings,
  QdsTableRowDropIndicatorBindings,
  QdsTableRowDropIndicatorProps,
  QdsTableRowExpandButtonBindings,
  QdsTableRowExpandButtonProps,
  QdsTableRowProps,
  QdsTableScrollContainerBindings,
  QdsTableTableBindings,
  QdsTableTitleBarBindings,
} from "./table.types"

export function createQdsTableApi(normalize: PropNormalizer): QdsTableApi {
  return {
    getActionBarBindings(): QdsTableActionBarBindings {
      return normalize.element({className: tableClasses.actionBar})
    },
    getBodyBindings(): QdsTableBodyBindings {
      return normalize.element({className: tableClasses.body})
    },
    getCellActionBindings(): QdsTableCellActionBindings {
      return normalize.element({className: tableClasses.cellAction})
    },
    getCellBindings(props: QdsTableCellProps): QdsTableCellBindings {
      return normalize.element({
        className: tableClasses.cell,
        "data-aggregated": booleanDataAttr(props.cell?.getIsAggregated?.()),
        "data-grouped": booleanDataAttr(props.cell?.getIsGrouped?.()),
      })
    },
    getColumnDragPreviewBindings(): QdsTableColumnDragPreviewBindings {
      return normalize.element({className: tableClasses.dragPreview})
    },
    getColumnDropIndicatorBindings(
      props: QdsTableColumnDropIndicatorProps,
    ): QdsTableColumnDropIndicatorBindings {
      const index = props.columnIndex ?? -1
      const sourceIndex = props.sourceColumnIndex ?? -1

      return normalize.element({
        className: tableClasses.columnDropIndicator,
        "data-closest-edge": props.closestEdge,
        "data-drag-direction":
          index > -1 && sourceIndex > -1 && index > sourceIndex
            ? "right"
            : "left",
        "data-is-over-source": booleanDataAttr(sourceIndex === index),
      })
    },
    getColumnFilterActionBindings(
      props: QdsTableColumnFilterProps,
    ): QdsTableColumnFilterActionBindings {
      return normalize.button({
        className: tableClasses.columnFilterAction,
        "data-filter-active": booleanDataAttr(
          props.header.column.getIsFiltered(),
        ),
      })
    },
    getColumnHeaderActionBindings(): QdsTableColumnHeaderActionBindings {
      return normalize.button({className: tableClasses.columnHeaderAction})
    },
    getColumnResizerBindings(
      props: QdsTableColumnResizerProps,
    ): QdsTableColumnResizerBindings {
      const header = props.header
      const isResizing = header.column.getIsResizing()
      return normalize.button({
        className: tableClasses.columnResizer,
        "data-resizing": booleanDataAttr(isResizing),
        onDoubleClick: () => header.column.resetSize(),
        onMouseDown: (event) => header.getResizeHandler()(event),
        onTouchStart: (event) => header.getResizeHandler()(event),
      })
    },
    getColumnSortActionBindings(
      props: QdsTableColumnSortActionProps,
    ): QdsTableColumnSortActionBindings {
      const sortDirection = props.header.column.getIsSorted()
      const nextOrder = props.header.column.getNextSortingOrder()
      // TODO: validate with regression test
      return normalize.element({
        "aria-label":
          nextOrder === "asc"
            ? "Sort ascending"
            : nextOrder === "desc"
              ? "Sort descending"
              : "Remove sort",
        className: tableClasses.columnSortAction,
        "data-sort-direction": sortDirection || undefined,
        onClick: (event) => {
          if (!event.defaultPrevented) {
            return props.header.column.getToggleSortingHandler()?.(event)
          }
        },
      })
    },
    getDragHandleBindings(): QdsTableDragHandleBindings {
      return normalize.element({className: tableClasses.dragHandle})
    },
    getFooterBindings(): QdsTableFooterBindings {
      return normalize.element({className: tableClasses.footer})
    },
    getHeaderBindings(): QdsTableHeaderBindings {
      return normalize.element({className: tableClasses.header})
    },
    getHeaderCellBindings(
      props: QdsTableHeaderCellProps,
    ): QdsTableHeaderCellBindings {
      return normalize.element({
        className: tableClasses.headerCell,
        "data-dragging": booleanDataAttr(props.isDragging),
        "data-dragging-over": booleanDataAttr(props.isDraggingOver),
        "data-resizing": booleanDataAttr(props.isResizing),
      })
    },
    getPaginationBindings(): QdsTablePaginationBindings {
      return normalize.element({className: tableClasses.pagination})
    },
    getRootBindings(props: QdsTableApiProps): QdsTableRootBindings {
      const size = props.size || "md"
      return normalize.element({
        className: tableClasses.root,
        "data-show-column-divider": booleanDataAttr(props.showColumnDivider),
        "data-size": size,
      })
    },
    getRowBindings(props: QdsTableRowProps): QdsTableRowBindings {
      return normalize.element({
        className: tableClasses.row,
        "data-dragging": booleanDataAttr(props.isDragging),
        "data-dragging-over": booleanDataAttr(props.isDraggingOver),
        "data-selected": booleanDataAttr(props.isSelected),
      })
    },
    getRowDragPreviewBindings(): QdsTableRowDragPreviewBindings {
      return normalize.element({className: tableClasses.dragPreview})
    },
    getRowDropIndicatorBindings(
      props: QdsTableRowDropIndicatorProps,
    ): QdsTableRowDropIndicatorBindings {
      const rowIndex = props.rowIndex ?? -1
      const sourceIndex = props.sourceIndex ?? -1

      return normalize.element({
        className: tableClasses.rowDropIndicator,
        "data-closest-edge": props.closestEdge,
        "data-drag-direction":
          rowIndex > -1 && sourceIndex > -1 && rowIndex > sourceIndex
            ? "down"
            : "up",
        "data-is-over-source": booleanDataAttr(sourceIndex === rowIndex),
      })
    },
    getRowExpandButtonBindings(
      props: QdsTableRowExpandButtonProps,
    ): QdsTableRowExpandButtonBindings {
      return normalize.button({
        "aria-label":
          (props.isExpanded ?? props.row.getIsExpanded())
            ? "Collapse row"
            : "Expand row",
        className: tableClasses.rowExpandButton,
        "data-expanded": booleanDataAttr(props.row.getIsExpanded()),
        disabled: !props.row.getCanExpand(),
        onClick: props.row.getToggleExpandedHandler(),
      })
    },
    getScrollContainerBindings(): QdsTableScrollContainerBindings {
      return normalize.element({className: tableClasses.scrollContainer})
    },
    getTableBindings(): QdsTableTableBindings {
      return normalize.element({className: tableClasses.table})
    },
    getTitleBarBindings(): QdsTableTitleBarBindings {
      return normalize.element({className: tableClasses.titleBar})
    },
  }
}
