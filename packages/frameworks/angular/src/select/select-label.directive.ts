// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideAsterisk} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectLabelDirective} from "@qualcomm-ui/angular-core/select"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  providers: [provideIcons({LucideAsterisk})],
  selector: "[q-select-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (selectContext().required) {
      <svg
        qIcon="LucideAsterisk"
        size="xs"
        [q-bind]="qdsInputContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class SelectLabelDirective extends CoreSelectLabelDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getLabelBindings()),
    )
  }
}
