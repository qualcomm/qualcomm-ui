// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"
import {LucideGripHorizontal} from "@lucide/angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({LucideGripHorizontal})],
  selector: "[q-table-row-drag-handle]",
  standalone: false,
  template: `
    <svg
      [q-bind]="inlineIconButtonApi().getIconBindings()"
      [qIcon]="icon()!"
      [size]="inlineIconButtonApi().size"
    ></svg>
  `,
})
export class TableRowDragHandleDirective implements OnInit {
  /**
   * Lucide icon to display inside the button.
   *
   * @default "GripHorizontal"
   */
  readonly icon = input<LucideIconOrString>("GripHorizontal")

  protected readonly inlineIconButtonApi = useIconButtonApi({
    density: "compact",
    emphasis: "neutral",
    size: "sm",
    variant: "ghost",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getDragHandleBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
