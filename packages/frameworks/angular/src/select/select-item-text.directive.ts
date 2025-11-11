// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSelectItemTextDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Directive({
  selector: "[q-select-item-text]",
  standalone: false,
})
export class SelectItemTextDirective extends CoreSelectItemTextDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getItemTextBindings()),
    )
  }
}
