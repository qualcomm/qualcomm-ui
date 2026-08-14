// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"
import {LucideCircleAlert, LucideCircleCheck, LucideTriangleAlert} from "@lucide/angular"

import {CoreDialogBodyDirective} from "@qualcomm-ui/angular-core/dialog"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * The main content of the dialog. Container for the heading, description,
 * indicator, and primary content of the dialog.
 */
@Component({
  selector: "[q-dialog-body]",
  standalone: false,
  template: `
    <ng-content select="[q-dialog-indicator-icon]" />
    <ng-content />
  `,
})
export class DialogBodyComponent extends CoreDialogBodyDirective {
  protected readonly qdsContext = useQdsDialogContext()

  /**
   * Hides the indicator icon.
   *
   * @deprecated no longer used.
   */
  readonly hideIndicatorIcon = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * @deprecated no longer used
   */
  readonly indicatorIcon = computed(() => {
    switch (this.qdsContext().emphasis) {
      case "neutral":
        return LucideCircleAlert
      case "info":
        return LucideCircleAlert
      case "success":
        return LucideCircleCheck
      case "warning":
        return LucideTriangleAlert
      case "danger":
        return LucideCircleAlert
    }
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBodyBindings()),
    )
  }
}
