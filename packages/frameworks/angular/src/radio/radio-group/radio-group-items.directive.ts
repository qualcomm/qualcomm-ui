// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreRadioGroupItemsDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "../qds-radio-context.service"

@Directive({
  selector: "[q-radio-group-items]",
  standalone: false,
})
export class RadioGroupItemsDirective extends CoreRadioGroupItemsDirective {
  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getGroupItemsBindings()),
    )
  }
}
