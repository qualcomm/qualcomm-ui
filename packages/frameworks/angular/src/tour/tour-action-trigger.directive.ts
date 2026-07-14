// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTourActionTriggerDirective} from "@qualcomm-ui/angular-core/tour"
import {useButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.service"

@Directive({selector: "[q-tour-action-trigger]", standalone: false})
export class TourActionTriggerDirective extends CoreTourActionTriggerDirective {
  protected readonly qdsContext = useQdsTourContext()
  protected readonly buttonApi = useButtonApi({
    emphasis: computed(() =>
      this.action().action === "next" ? "primary" : "neutral",
    ),
    size: "sm",
    variant: computed(() =>
      this.action().action === "next" ? "fill" : "outline",
    ),
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        const buttonBindings = {
          ...this.buttonApi().getRootBindings(),
        } as Record<string, unknown>
        delete buttonBindings["data-disabled"]
        delete buttonBindings.disabled
        return mergeProps(
          buttonBindings,
          this.qdsContext().getActionTriggerBindings(),
        )
      }),
    )
  }
}
