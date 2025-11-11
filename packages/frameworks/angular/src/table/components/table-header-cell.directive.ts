// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Directive,
  input,
  numberAttribute,
  type OnInit,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {QdsTableHeaderCellProps} from "@qualcomm-ui/qds-core/table"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-header-cell]",
  standalone: false,
})
export class TableHeaderCellDirective
  implements OnInit, SignalifyInput<QdsTableHeaderCellProps>
{
  /**
   * The order of this column header in the table.
   */
  readonly columnIndex = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * If `true`, the column header is currently being dragged.
   */
  readonly isDragging = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * If `true`, another column header is being dragged over this header.
   */
  readonly isDraggingOver = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * If `true`, the header is currently being resized.
   */
  readonly isResizing = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getHeaderCellBindings({
      columnIndex: this.columnIndex(),
      isDragging: this.isDragging(),
      isDraggingOver: this.isDraggingOver(),
      isResizing: this.isResizing(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
