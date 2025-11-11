// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Asterisk} from "lucide-angular"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputLabelDirective} from "@qualcomm-ui/angular-core/password-input"

@Component({
  providers: [provideIcons({Asterisk})],
  selector: "[q-password-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (passwordInputContext().required) {
      <svg
        qIcon="Asterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class PasswordInputLabelDirective extends CorePasswordInputLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsInputContext().getLabelBindings()),
    )
  }
}
