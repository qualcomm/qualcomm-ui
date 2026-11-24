// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {useQdsFilterControlContext} from "../qds-filter-control-context.service"

/**
 * An option's label, followed by its result count when it has one. Applied to
 * the label element of an option, such as `q-checkbox-label`, so that the
 * label's styles reach the count.
 */
@Component({
  imports: [QBindDirective],
  selector: "[q-filter-option-label]",
  template: `
    @if (count() === undefined) {
      {{ label() }}
    } @else {
      <span [q-bind]="optionLabelBindings()">
        <span>{{ label() }}</span>
        <!--
          The leading space separates the count in the accessible name. It
          collapses visually because the count is a flex item.
        -->
        <span [q-bind]="optionCountBindings()">&ngsp;{{ count() }}</span>
      </span>
    }
  `,
})
export class FilterOptionLabelComponent {
  /**
   * The option's result count. Omitted when the filter has no counts.
   */
  readonly count = input<number | undefined>()

  readonly label = input.required<string>()

  protected readonly qdsContext = useQdsFilterControlContext()

  protected readonly optionLabelBindings = computed(() =>
    this.qdsContext().getOptionLabelBindings(),
  )

  protected readonly optionCountBindings = computed(() =>
    this.qdsContext().getOptionCountBindings(),
  )
}
