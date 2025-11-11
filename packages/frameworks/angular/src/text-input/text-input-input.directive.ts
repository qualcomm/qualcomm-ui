// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useInputInput} from "@qualcomm-ui/angular/input"
import {useForbiddenFormControlWarning} from "@qualcomm-ui/angular-core/forms"
import {CoreTextInputInputDirective} from "@qualcomm-ui/angular-core/text-input"

/**
 * The text input element. Note: do not apply form control bindings like `ngModel`
 * or `formControl` to this element. Apply them to the root element instead.
 */
@Directive({
  selector: "[q-text-input-input]",
  standalone: false,
})
export class TextInputInputDirective extends CoreTextInputInputDirective {
  protected readonly inputContext = useInputInput()

  constructor() {
    super()
    useForbiddenFormControlWarning({
      directive: "q-text-input-input",
      rootDirective: "q-text-input",
    })
    this.trackBindings.extendWith(() => this.inputContext.getBindings())
  }
}
