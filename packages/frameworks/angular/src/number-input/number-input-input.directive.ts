// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreNumberInputInputDirective} from "@qualcomm-ui/angular-core/number-input"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

@Directive({
  selector: "input[q-number-input-input]",
  standalone: false,
})
export class NumberInputInputDirective extends CoreNumberInputInputDirective {
  protected readonly qdsNumberInputContext = useQdsNumberInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsNumberInputContext().getInputBindings()),
    )
  }
}
