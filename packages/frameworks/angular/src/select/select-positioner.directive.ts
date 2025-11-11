// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSelectPositionerDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

@Directive({
  selector: "[q-select-positioner]",
  standalone: false,
})
export class SelectPositionerDirective extends CoreSelectPositionerDirective {
  protected readonly qdsContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPositionerBindings()),
    )
  }
}
