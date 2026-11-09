// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreToastCloseTriggerDirective} from "@qualcomm-ui/angular-core/toast"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context.service"

@Component({
  providers: [provideIcons({LucideX})],
  selector: "[q-toast-close-button]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="iconButtonApi().getIconBindings()"></svg>
    </ng-content>
  `,
})
export class ToastCloseButtonDirective extends CoreToastCloseTriggerDirective {
  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    emphasis: "neutral",
    size: "md",
    variant: "ghost",
  })

  protected readonly qdsContext = useQdsToastContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getCloseButtonBindings(),
          this.iconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
