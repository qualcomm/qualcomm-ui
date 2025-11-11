// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreRadioGroupLabelDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "../qds-radio-context.service"

@Directive({
  selector: "[q-radio-group-label]",
  standalone: false,
})
export class RadioGroupLabelDirective extends CoreRadioGroupLabelDirective {
  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getGroupLabelBindings()),
    )
  }
}
