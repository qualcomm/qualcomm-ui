// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreSelectItemGroupDirective,
  provideSelectItemGroupContext,
} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

/**
 * @since 3.3.0
 */
@Directive({
  providers: [provideSelectItemGroupContext()],
  selector: "[q-select-item-group]",
  standalone: false,
})
export class SelectItemGroupDirective extends CoreSelectItemGroupDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getItemGroupBindings()),
    )
  }
}
