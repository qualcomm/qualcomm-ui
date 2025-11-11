// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreRadioItemHiddenInputDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "./qds-radio-context.service"

@Directive({
  selector: "input[q-radio-hidden-input]",
  standalone: false,
})
export class RadioHiddenInputDirective extends CoreRadioItemHiddenInputDirective {
  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getItemHiddenInputBindings()),
    )
  }
}
