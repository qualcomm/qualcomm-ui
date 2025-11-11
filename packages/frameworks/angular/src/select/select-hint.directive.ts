// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useInputHint} from "@qualcomm-ui/angular/input"
import {CoreSelectHintDirective} from "@qualcomm-ui/angular-core/select"

@Directive({
  selector: "[q-select-hint]",
  standalone: false,
})
export class SelectHintDirective extends CoreSelectHintDirective {
  protected readonly hintContext = useInputHint()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.hintContext.getBindings())
  }
}
