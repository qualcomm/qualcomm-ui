// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreComboboxItemGroupDirective,
  provideComboboxItemGroupContext,
} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

/**
 * @since 3.3.0
 */
@Directive({
  providers: [provideComboboxItemGroupContext()],
  selector: "[q-combobox-item-group]",
  standalone: false,
})
export class ComboboxItemGroupDirective extends CoreComboboxItemGroupDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getItemGroupBindings()),
    )
  }
}
