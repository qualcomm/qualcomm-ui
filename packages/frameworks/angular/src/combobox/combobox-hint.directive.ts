// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useInputHint} from "@qualcomm-ui/angular/input"
import {CoreComboboxHintDirective} from "@qualcomm-ui/angular-core/combobox"

@Directive({
  selector: "[q-combobox-hint]",
  standalone: false,
})
export class ComboboxHintDirective extends CoreComboboxHintDirective {
  protected readonly hintContext = useInputHint()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.hintContext.getBindings())
  }
}
