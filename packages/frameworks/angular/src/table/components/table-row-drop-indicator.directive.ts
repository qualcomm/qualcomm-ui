// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, numberAttribute, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {QdsTableRowDropIndicatorProps} from "@qualcomm-ui/qds-core/table"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-row-drop-indicator]",
  standalone: false,
})
export class TableRowDropIndicatorDirective
  implements OnInit, SignalifyInput<QdsTableRowDropIndicatorProps>
{
  /**
   * The closest edge of the row that the indicator is being dragged over.
   */
  readonly closestEdge = input<
    "top" | "bottom" | "left" | "right" | undefined
  >()

  /**
   * The index of the row that the indicator belongs to.
   */
  readonly rowIndex = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * The index of the row being dragged.
   */
  readonly sourceIndex = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getRowDropIndicatorBindings({
      closestEdge: this.closestEdge(),
      rowIndex: this.rowIndex(),
      sourceIndex: this.sourceIndex(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
