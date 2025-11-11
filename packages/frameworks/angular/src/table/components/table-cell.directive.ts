// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {Cell} from "@qualcomm-ui/core/table"
import type {QdsTableCellProps} from "@qualcomm-ui/qds-core/table"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-cell]",
  standalone: false,
})
export class TableCellDirective
  implements OnInit, SignalifyInput<QdsTableCellProps>
{
  /**
   * The data model for this cell.
   */
  readonly cell = input<Cell<any>>()

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getCellBindings({
      cell: this.cell(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
