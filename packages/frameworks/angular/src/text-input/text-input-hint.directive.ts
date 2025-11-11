// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useInputHint} from "@qualcomm-ui/angular/input"
import {CoreTextInputHintDirective} from "@qualcomm-ui/angular-core/text-input"

/**
 * Helper text displayed below the input.
 */
@Directive({
  selector: "[q-text-input-hint]",
  standalone: false,
})
export class TextInputHintDirective extends CoreTextInputHintDirective {
  protected readonly hintContext = useInputHint()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.hintContext.getBindings())
  }
}
