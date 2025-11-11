// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreProgressRingLabelDirective} from "@qualcomm-ui/angular-core/progress-ring"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Directive({
  selector: "[q-progress-ring-label]",
  standalone: false,
})
export class ProgressRingLabelDirective extends CoreProgressRingLabelDirective {
  protected readonly qdsContext = useQdsProgressRingContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLabelBindings()),
    )
  }
}
