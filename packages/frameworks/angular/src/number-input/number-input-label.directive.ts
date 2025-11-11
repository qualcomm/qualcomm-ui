// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreNumberInputLabelDirective} from "@qualcomm-ui/angular-core/number-input"

@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-number-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (numberInputContext().required) {
      <svg
        qIcon="Asterisk"
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
