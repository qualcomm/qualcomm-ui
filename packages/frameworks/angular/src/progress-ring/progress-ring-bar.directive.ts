// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreProgressRingBarDirective} from "@qualcomm-ui/angular-core/progress-ring"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Directive({
  selector: "circle[q-progress-ring-bar]",
  standalone: false,
})
export class ProgressRingBarDirective extends CoreProgressRingBarDirective {
  protected readonly qdsContext = useQdsProgressRingContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBarBindings()),
    )
  }
}
