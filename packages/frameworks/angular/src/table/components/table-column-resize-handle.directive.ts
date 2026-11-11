// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"
import {LucideUnfoldHorizontal} from "@lucide/angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import type {Header} from "@qualcomm-ui/core/table"
import type {QdsTableColumnResizerProps} from "@qualcomm-ui/qds-core/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({LucideUnfoldHorizontal})],
  selector: "[q-table-column-resize-handle]",
  standalone: false,
  template: `
    <svg
      [q-bind]="inlineIconButtonApi().getIconBindings()"
      [qIcon]="icon()!"
      [size]="inlineIconButtonApi().size"
    ></svg>
  `,
})
export class TableColumnResizeHandleDirective
  implements OnInit, SignalifyInput<QdsTableColumnResizerProps>
{
  /**
   * The column header associated with the resize handle.
   */
  readonly header = input.required<Header<any>>()

  /**
   * Lucide icon to display inside the button.
   *
   * @default "UnfoldHorizontal"
   */
  readonly icon = input<LucideIconOrString>("UnfoldHorizontal")

  protected readonly inlineIconButtonApi = useIconButtonApi({
    density: "compact",
    emphasis: "neutral",
    size: "sm",
    variant: "ghost",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getColumnResizerBindings({
        header: this.header(),
      }),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
