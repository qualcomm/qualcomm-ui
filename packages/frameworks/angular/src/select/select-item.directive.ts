// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreSelectItemDirective,
  provideSelectItemContext,
} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Directive({
  providers: [provideSelectItemContext()],
  selector: "[q-select-item]",
  standalone: false,
})
export class SelectItemDirective extends CoreSelectItemDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getItemBindings()),
    )
  }
}
