// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {
  RenderCellDirective,
  RenderFooterDirective,
  RenderHeaderDirective,
} from "./renderers"
import {TableActionBarDirective} from "./table-action-bar.directive"
import {TableBodyDirective} from "./table-body.directive"
import {TableCellActionDirective} from "./table-cell-action.directive"
import {TableCellDirective} from "./table-cell.directive"
import {TableColumnDragHandleDirective} from "./table-column-drag-handle.directive"
import {TableColumnDragPreviewDirective} from "./table-column-drag-preview.directive"
import {TableColumnDropIndicatorDirective} from "./table-column-drop-indicator.directive"
import {TableColumnFilterActionDirective} from "./table-column-filter-action.directive"
import {TableColumnHeaderActionDirective} from "./table-column-header-action.directive"
import {TableColumnResizeHandleDirective} from "./table-column-resize-handle.directive"
import {TableColumnSortActionDirective} from "./table-column-sort-action.directive"
import {TableFooterDirective} from "./table-footer.directive"
import {TableHeaderCellDirective} from "./table-header-cell.directive"
import {TableHeaderDirective} from "./table-header.directive"
import {TablePaginationDirective} from "./table-pagination.directive"
import {TableRootDirective} from "./table-root.directive"
import {TableRowDragHandleDirective} from "./table-row-drag-handle.directive"
import {TableRowDragPreviewDirective} from "./table-row-drag-preview.directive"
import {TableRowDropIndicatorDirective} from "./table-row-drop-indicator.directive"
import {TableRowExpandButtonDirective} from "./table-row-expand-button.directive"
import {TableRowDirective} from "./table-row.directive"
import {TableScrollContainerDirective} from "./table-scroll-container.directive"
import {TableTableDirective} from "./table-table.directive"
import {TableTitleBarDirective} from "./table-title-bar.directive"

@NgModule({
  declarations: [
    TableActionBarDirective,
    TableBodyDirective,
    TableCellActionDirective,
    TableCellDirective,
    TableColumnDragHandleDirective,
    TableColumnDragPreviewDirective,
    TableColumnDropIndicatorDirective,
    TableColumnFilterActionDirective,
    TableColumnHeaderActionDirective,
    TableColumnResizeHandleDirective,
    TableColumnSortActionDirective,
    TableFooterDirective,
    TableHeaderCellDirective,
    TableHeaderDirective,
    TablePaginationDirective,
    TableRootDirective,
    TableRowDirective,
    TableRowDragHandleDirective,
    TableRowDragPreviewDirective,
    TableRowDropIndicatorDirective,
    TableRowExpandButtonDirective,
    TableScrollContainerDirective,
    TableTableDirective,
    TableTitleBarDirective,
    RenderCellDirective,
    RenderHeaderDirective,
    RenderFooterDirective,
  ],
  exports: [
    TableActionBarDirective,
    TableBodyDirective,
    TableCellActionDirective,
    TableCellDirective,
    TableColumnDragHandleDirective,
    TableColumnDragPreviewDirective,
    TableColumnDropIndicatorDirective,
    TableColumnFilterActionDirective,
    TableColumnHeaderActionDirective,
    TableColumnResizeHandleDirective,
    TableColumnSortActionDirective,
    TableFooterDirective,
    TableHeaderCellDirective,
    TableHeaderDirective,
    TablePaginationDirective,
    TableRootDirective,
    TableRowDirective,
    TableRowDragHandleDirective,
    TableRowDragPreviewDirective,
    TableRowDropIndicatorDirective,
    TableRowExpandButtonDirective,
    TableScrollContainerDirective,
    TableTableDirective,
    TableTitleBarDirective,
    RenderCellDirective,
    RenderHeaderDirective,
    RenderFooterDirective,
  ],
  imports: [QBindDirective, IconDirective],
})
export class TableModule {}
