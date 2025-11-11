// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {provideCheckboxContext} from "@qualcomm-ui/angular-core/checkbox"
import {CoreSegmentedControlItemDirective} from "@qualcomm-ui/angular-core/segmented-control"

import {useQdsSegmentedControlContext} from "./qds-segmented-control-context.service.js"

@Directive({
  providers: [provideCheckboxContext()],
  selector: "[q-segmented-control-item-root]",
  standalone: false,
})
export class SegmentedControlItemRootDirective extends CoreSegmentedControlItemDirective {
  protected readonly qdsSegmentedControlContext =
    useQdsSegmentedControlContext()

  override ngOnInit() {
    super.ngOnInit()

    this.trackBindings.extendWith(
      computed(() => this.qdsSegmentedControlContext().getItemBindings()),
    )
  }
}
