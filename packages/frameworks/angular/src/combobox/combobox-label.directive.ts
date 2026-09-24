// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideAsterisk} from "@lucide/angular"

import {CoreComboboxLabelDirective} from "@qualcomm-ui/angular-core/combobox"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  providers: [provideIcons({LucideAsterisk})],
  selector: "[q-combobox-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (comboboxContext().required) {
      <svg
        qIcon="LucideAsterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class ComboboxLabelDirective extends CoreComboboxLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getLabelBindings()),
    )
  }
}
