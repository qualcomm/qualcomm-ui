// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"
import {LucideArrowDownUp, LucideArrowUp} from "@lucide/angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {Header, SortDirection} from "@qualcomm-ui/core/table"
import type {QdsTableColumnSortActionProps} from "@qualcomm-ui/qds-core/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({LucideArrowDownUp, LucideArrowUp})],
  selector: "[q-table-column-sort-action]",
  standalone: false,
  template: `
    @if (canSort()) {
      <svg
        [q-bind]="inlineIconButtonApi().getIconBindings()"
        [qIcon]="sortIcon()"
        [size]="inlineIconButtonApi().size"
      ></svg>
    }
  `,
})
export class TableColumnSortActionDirective
  implements OnInit, SignalifyInput<QdsTableColumnSortActionProps>
{
  /**
   * Whether the column is sorted. Pass in the state from the column:
   *
   * @example
   * ```angular-html
   * <button
   *   q-table-column-sort-action
   *   [isSorted]="column.getIsSorted()">
   * </button>
   * ```
   */
  readonly isSorted = input<false | SortDirection>(false)

  /**
   * The column header associated with the sort action.
   */
  readonly header = input.required<Header<any>>()

  protected readonly canSort = computed(() => this.header().column.getCanSort())

  protected readonly sortIcon = computed((): LucideIconOrString => {
    const sortDirection = this.isSorted() || this.header().column.getIsSorted()
    return sortDirection ? "ArrowUp" : "ArrowDownUp"
  })

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getColumnSortActionBindings({
        header: this.header(),
        isSorted: this.isSorted() || this.header().column.getIsSorted(),
      }),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
