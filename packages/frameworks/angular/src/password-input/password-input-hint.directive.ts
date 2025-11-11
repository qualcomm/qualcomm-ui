// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useInputHint} from "@qualcomm-ui/angular/input"
import {CorePasswordInputHintDirective} from "@qualcomm-ui/angular-core/password-input"

@Directive({
  selector: "[q-password-input-hint]",
  standalone: false,
})
export class PasswordInputHintDirective extends CorePasswordInputHintDirective {
  protected readonly hintContext = useInputHint()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.hintContext.getBindings())
  }
}
