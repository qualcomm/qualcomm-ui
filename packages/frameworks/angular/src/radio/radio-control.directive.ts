// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreRadioItemControlDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "./qds-radio-context.service"

@Directive({
  selector: "[q-radio-control]",
  standalone: false,
})
export class RadioControlDirective extends CoreRadioItemControlDirective {
  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getItemControlBindings()),
    )
  }
}
