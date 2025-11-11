// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreTextInputLabelDirective} from "@qualcomm-ui/angular-core/text-input"

/**
 * An accessible label that is automatically associated with the input.
 */
@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-text-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (textInputContext().required) {
      <svg
        qIcon="Asterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class TextInputLabelDirective extends CoreTextInputLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsInputContext().getLabelBindings()),
    )
  }
}
