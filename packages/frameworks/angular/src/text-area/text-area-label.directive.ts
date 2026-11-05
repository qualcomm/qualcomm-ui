// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideAsterisk} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreTextAreaLabelDirective} from "@qualcomm-ui/angular-core/text-area"

import {useQdsTextAreaContext} from "./qds-text-area-context.service"

/**
 * An accessible label that is automatically associated with the input.
 */
@Component({
  providers: [provideIcons({LucideAsterisk})],
  selector: "[q-text-area-label]",
  standalone: false,
  template: `
    <ng-content />
    @if (textAreaContext().required) {
      <svg
        qIcon="LucideAsterisk"
        size="xs"
        [q-bind]="qdsTextAreaContext().getRequiredIndicatorBindings()"
      ></svg>
    }
  `,
})
export class TextAreaLabelDirective extends CoreTextAreaLabelDirective {
  protected readonly qdsTextAreaContext = useQdsTextAreaContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsTextAreaContext().getLabelBindings()),
    )
  }
}
