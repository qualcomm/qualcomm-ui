// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  type OnInit,
} from "@angular/core"
import {Funnel} from "lucide-angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {Header} from "@qualcomm-ui/core/table"
import type {QdsTableColumnFilterProps} from "@qualcomm-ui/qds-core/table"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({Funnel})],
  selector: "[q-table-column-filter-action]",
  standalone: false,
  template: `
    @if (filterable()) {
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
   * Whether the column can be filtered. Pass in the state from the column:
   *
   * @example
   * ```angular-html
   * <button
   *   q-table-column-filter-action
   *   [canFilter]="header.column.getCanFilter()"
   * ></button>
   * ```
   */
  readonly canFilter = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the column is filtered. Pass in the state from the column:
   *
   * @example
   * ```angular-html
   * <button
   *   q-table-column-filter-action
   *   [isFiltered]="header.column.getIsFiltered()"
   * ></button>
   * ```
   */
  readonly isFiltered = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The column header associated with the filter.
   */
  readonly header = input<Header<any>>()

  /**
   * Lucide icon to display inside the button.
   *
   * @default "Funnel"
   */
  readonly icon = input<LucideIconOrString>("Funnel")

  protected readonly filterable = computed(
    () => this.canFilter() || this.header()?.column.getCanFilter(),
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
        canFilter: this.canFilter(),
        header: this.header(),
        isFiltered: this.isFiltered(),
      }),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
