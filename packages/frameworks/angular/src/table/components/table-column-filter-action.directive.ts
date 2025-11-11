// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"
import {Filter} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {Header} from "@qualcomm-ui/core/table"
import type {QdsTableColumnFilterProps} from "@qualcomm-ui/qds-core/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({Filter})],
  selector: "[q-table-column-filter-action]",
  standalone: false,
  template: `
    @if (canFilter()) {
      <svg
        [q-bind]="inlineIconButtonApi().getIconBindings()"
        [qIcon]="icon()"
      ></svg>
    }
  `,
})
export class TableColumnFilterActionDirective
  implements OnInit, SignalifyInput<QdsTableColumnFilterProps>
{
  /**
   * The column header associated with the filter.
   */
  readonly header = input.required<Header<any>>()

  /**
   * Lucide icon to display inside the button.
   *
   * @default "Filter"
   */
  readonly icon = input<LucideIconOrString>("Filter")

  protected readonly canFilter = computed(() =>
    this.header().column.getCanFilter(),
  )

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getColumnFilterActionBindings({
        header: this.header(),
      }),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
