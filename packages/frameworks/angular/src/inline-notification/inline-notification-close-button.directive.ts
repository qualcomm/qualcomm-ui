// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {CoreInlineNotificationCloseTriggerDirective} from "@qualcomm-ui/angular-core/inline-notification"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({X})],
  selector: "[q-inline-notification-close-button]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="inlineIconButtonApi().getIconBindings()"></svg>
    </ng-content>
  `,
})
export class InlineNotificationCloseButtonDirective extends CoreInlineNotificationCloseTriggerDirective {
  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "md",
    variant: "fixed",
  })
  protected readonly qdsContext = useQdsInlineNotificationContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getCloseButtonBindings(),
          this.inlineIconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
