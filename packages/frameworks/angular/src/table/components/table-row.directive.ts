// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {QdsTableRowProps} from "@qualcomm-ui/qds-core/table"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-row]",
  standalone: false,
})
export class TableRowDirective
  implements OnInit, SignalifyInput<QdsTableRowProps>
{
  /**
   * If `true`, the row is currently being dragged.
   */
  readonly isDragging = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * If `true`, another row is being dragged over this row.
   */
  readonly isDraggingOver = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * If `true`, the row is currently selected.
   */
  readonly isSelected = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getRowBindings({
      isDragging: this.isDragging(),
      isDraggingOver: this.isDraggingOver(),
      isSelected: this.isSelected(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
