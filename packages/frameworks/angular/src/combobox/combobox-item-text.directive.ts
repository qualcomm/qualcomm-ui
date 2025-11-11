// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreComboboxItemTextDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  selector: "[q-combobox-item-text]",
  standalone: false,
})
export class ComboboxItemTextDirective extends CoreComboboxItemTextDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getItemTextBindings()),
    )
  }
}
