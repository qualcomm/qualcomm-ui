// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreProgressBarDirective} from "@qualcomm-ui/angular-core/progress"

import {useQdsProgressContext} from "./qds-progress-context.service"

@Directive({
  selector: "[q-progress-bar]",
  standalone: false,
})
export class ProgressBarDirective extends CoreProgressBarDirective {
  protected qdsContext = useQdsProgressContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBarBindings()),
    )
  }
}
