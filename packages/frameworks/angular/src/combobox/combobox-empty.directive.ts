// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreComboboxEmptyDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  selector: "[q-combobox-empty]",
  standalone: false,
})
export class ComboboxEmptyDirective extends CoreComboboxEmptyDirective {
  protected readonly qdsContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getItemBindings()),
    )
  }
}
