// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreCheckboxHiddenInputDirective} from "@qualcomm-ui/angular-core/checkbox"
import {useForbiddenFormControlWarning} from "@qualcomm-ui/angular-core/forms"

import {useQdsCheckboxContext} from "./qds-checkbox-context.service"

/**
 * Hidden input element used for accessibility and form submissions. Note: do not
 * apply form control bindings like `ngModel` or `formControl` to this element.
 * Apply them to the root element instead.
 */
@Directive({
  selector: "input[q-checkbox-hidden-input]",
  standalone: false,
})
export class CheckboxHiddenInputDirective extends CoreCheckboxHiddenInputDirective {
  protected readonly qdsCheckboxContext = useQdsCheckboxContext()

  constructor() {
    super()
    useForbiddenFormControlWarning({
      directive: "q-checkbox-hidden-input",
    })
    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxContext().getHiddenInputBindings()),
    )
  }
}
