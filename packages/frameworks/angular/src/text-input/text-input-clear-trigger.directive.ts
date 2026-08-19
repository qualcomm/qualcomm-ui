// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreTextInputClearTriggerDirective} from "@qualcomm-ui/angular-core/text-input"
import {useInputClearTrigger} from "@qualcomm-ui/angular/input"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"

/**
 * Button that clears the input value.
 */
@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({LucideX})],
  selector: "[q-text-input-clear-trigger]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="clearTriggerContext.getIconBindings()"></svg>
  `,
})
export class TextInputClearTriggerDirective extends CoreTextInputClearTriggerDirective {
  protected readonly clearTriggerContext = useInputClearTrigger()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.clearTriggerContext.getRootBindings()),
    )
  }
}
