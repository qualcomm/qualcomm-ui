// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideAsterisk} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputLabelDirective} from "@qualcomm-ui/angular-core/password-input"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"

@Component({
  providers: [provideIcons({LucideAsterisk})],
  selector: "[q-password-input-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (passwordInputContext().required) {
      <svg
        qIcon="LucideAsterisk"
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
