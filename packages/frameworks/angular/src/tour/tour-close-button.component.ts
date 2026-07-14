// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreTourCloseTriggerDirective} from "@qualcomm-ui/angular-core/tour"
import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.service"

@Component({
  providers: [provideIcons({X})],
  selector: "[q-tour-close-button]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="buttonApi().getIconBindings()"></svg>
  `,
})
export class TourCloseButtonComponent extends CoreTourCloseTriggerDirective {
  protected readonly buttonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })
  protected readonly qdsContext = useQdsTourContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.buttonApi().getRootBindings(),
          this.qdsContext().getCloseButtonBindings(),
        ),
      ),
    )
  }
}
