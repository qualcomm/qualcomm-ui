// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {CoreComboboxControlDirective} from "@qualcomm-ui/angular-core/combobox"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  selector: "[q-combobox-control]",
  standalone: false,
  template: `
    <ng-content select="[q-combobox-icon]">
      @if (qdsInputContext().startIcon) {
        <svg
          [q-bind]="qdsComboboxContext().getIconBindings()"
          [qIcon]="qdsInputContext().startIcon!"
        />
      }
    </ng-content>
    <ng-content />
  `,
})
export class ComboboxControlDirective extends CoreComboboxControlDirective {
  protected readonly qdsInputContext = useQdsInputContext()
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxContext().getControlBindings()),
    )
  }
}
