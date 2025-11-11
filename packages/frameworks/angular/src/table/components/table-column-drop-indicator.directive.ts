// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, numberAttribute, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {QdsTableColumnDropIndicatorProps} from "@qualcomm-ui/qds-core/table"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-column-drop-indicator]",
  standalone: false,
})
export class TableColumnDropIndicatorDirective
  implements OnInit, SignalifyInput<QdsTableColumnDropIndicatorProps>
{
  /**
   * The closest edge of the column that the indicator is being dragged over.
   */
  readonly closestEdge = input<
    "top" | "bottom" | "left" | "right" | undefined
  >()

  /**
   * The index of the column that the indicator belongs to.
   */
  readonly columnIndex = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * The index of the column being dragged.
   */
  readonly sourceColumnIndex = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getColumnDropIndicatorBindings({
      closestEdge: this.closestEdge(),
      columnIndex: this.columnIndex(),
      sourceColumnIndex: this.sourceColumnIndex(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
