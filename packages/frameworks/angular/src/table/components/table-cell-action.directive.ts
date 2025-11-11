// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  selector: "[q-table-cell-action]",
  standalone: false,
  template: `
    <svg
      [q-bind]="inlineIconButtonApi().getIconBindings()"
      [qIcon]="icon()"
    ></svg>
  `,
})
export class TableCellActionDirective implements OnInit {
  /**
   * Lucide icon to display inside the button.
   */
  readonly icon = input.required<LucideIconOrString>()

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getCellActionBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
