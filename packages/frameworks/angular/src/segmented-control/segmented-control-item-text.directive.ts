// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSegmentedControlItemTextDirective} from "@qualcomm-ui/angular-core/segmented-control"

import {useQdsSegmentedControlContext} from "./qds-segmented-control-context.service.js"

/**
 * The text of the segmented control item.
 */
@Directive({
  selector: "[q-segmented-control-item-text]",
  standalone: false,
})
export class SegmentedControlItemTextDirective extends CoreSegmentedControlItemTextDirective {
  protected readonly qdsSegmentedControlContext =
    useQdsSegmentedControlContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSegmentedControlContext().getItemTextBindings()),
    )
  }
}
