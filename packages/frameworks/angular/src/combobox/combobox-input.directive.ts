// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {CoreComboboxInputDirective} from "@qualcomm-ui/angular-core/combobox"

@Directive({
  selector: "[q-combobox-input]",
  standalone: false,
})
export class ComboboxInputDirective extends CoreComboboxInputDirective {
  protected readonly qdsInputContext = useQdsInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.qdsInputContext().getInputBindings(),
    )
  }
}
