// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreComboboxItemGroupLabelDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Directive({
  selector: "[q-combobox-item-group-label]",
  standalone: false,
})
export class ComboboxItemGroupLabelDirective extends CoreComboboxItemGroupLabelDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getItemGroupLabelBindings()),
    )
  }
}
