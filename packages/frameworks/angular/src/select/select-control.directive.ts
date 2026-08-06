// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreSelectControlDirective} from "@qualcomm-ui/angular-core/select"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "[q-select-control]",
  standalone: false,
  template: `
    @if (qdsInputContext().startIcon) {
      <svg
        [q-bind]="qdsSelectContext().getIconBindings()"
        [qIcon]="qdsInputContext().startIcon!"
        [size]="qdsInputContext().size"
      />
    }
    <ng-content />
  `,
})
export class SelectControlDirective extends CoreSelectControlDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getControlBindings()),
    )
  }
}
