// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {CoreSelectValueTextDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "[q-select-value-text]",
  standalone: false,
  template: `
    @if (!value().length) {
      {{ placeholder() }}
    } @else if (!selectContext().multiple) {
      {{ valueAsString() }}
    } @else {
      @for (itemId of value(); track itemId) {
        @let label = selectContext().collection.stringifyItem(itemId) ?? "";
        <button
          emphasis="neutral"
          q-tag
          variant="dismissable"
          [dismissLabel]="dismissLabel()(label)"
          (click)="selectContext().selectValue(itemId)"
        >
          {{ label }}
        </button>
      }
    }
  `,
})
export class SelectValueTextDirective extends CoreSelectValueTextDirective {
  /**
   * Returns the accessible label for a selected item's remove button.
   *
   * @default (itemText) => `Remove ${itemText}`
   */
  readonly dismissLabel = input<(itemText: string) => string>(
    (itemText) => `Remove ${itemText}`,
  )

  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getValueTextBindings()),
    )
  }
}
