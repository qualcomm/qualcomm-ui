// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSelectItemGroupLabelDirective} from "@qualcomm-ui/angular-core/select"

import {useQdsSelectContext} from "./qds-select-context.service"

/**
 * @since next-release
 */
@Directive({
  selector: "[q-select-item-group-label]",
  standalone: false,
})
export class SelectItemGroupLabelDirective extends CoreSelectItemGroupLabelDirective {
  protected readonly qdsSelectContext = useQdsSelectContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectContext().getItemGroupLabelBindings()),
    )
  }
}
