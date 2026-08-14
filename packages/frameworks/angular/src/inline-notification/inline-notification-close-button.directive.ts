// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {CoreInlineNotificationCloseTriggerDirective} from "@qualcomm-ui/angular-core/inline-notification"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({LucideX})],
  selector: "[q-inline-notification-close-button]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="iconButtonApi().getIconBindings()"></svg>
    </ng-content>
  `,
})
export class InlineNotificationCloseButtonDirective extends CoreInlineNotificationCloseTriggerDirective {
  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    size: "md",
    variant: "ghost",
  })
  protected readonly qdsContext = useQdsInlineNotificationContext()

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
