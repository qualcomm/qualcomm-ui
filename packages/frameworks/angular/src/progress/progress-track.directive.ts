// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreProgressTrackDirective} from "@qualcomm-ui/angular-core/progress"

import {useQdsProgressContext} from "./qds-progress-context.service"

@Component({
  selector: "[q-progress-track]",
  standalone: false,
  template: `
    <ng-content>
      <div q-progress-bar></div>
    </ng-content>
  `,
})
export class ProgressTrackDirective extends CoreProgressTrackDirective {
  protected qdsContext = useQdsProgressContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTrackBindings()),
    )
  }
}
