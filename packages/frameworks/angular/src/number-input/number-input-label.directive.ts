// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideAsterisk} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreNumberInputLabelDirective} from "@qualcomm-ui/angular-core/number-input"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"

@Component({
  providers: [provideIcons({LucideAsterisk})],
  selector: "[q-number-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (numberInputContext().required) {
      <svg
        qIcon="LucideAsterisk"
        size="xs"
        [q-bind]="qdsContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class NumberInputLabelDirective extends CoreNumberInputLabelDirective {
  protected readonly qdsContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLabelBindings()),
    )
  }
}
