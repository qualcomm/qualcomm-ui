// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {
  LucideBellRing,
  LucideCircleAlert,
  LucideCircleCheck,
  type LucideIcon,
  LucideInfo,
  LucideTriangleAlert,
} from "@lucide/angular"

import {CoreInlineNotificationIconDirective} from "@qualcomm-ui/angular-core/inline-notification"
import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

const icons: Partial<Record<QdsNotificationEmphasis, LucideIcon>> = {
  danger: LucideCircleAlert,
  info: LucideInfo,
  neutral: LucideBellRing,
  success: LucideCircleCheck,
  warning: LucideTriangleAlert,
}

@Component({
  selector: "[q-inline-notification-icon]",
  standalone: false,
  template: `
    @if (qdsContext().emphasis === "loading") {
      <div q-progress-ring></div>
    } @else if (resolvedIcon()) {
      <svg size="lg" [qIcon]="resolvedIcon()!"></svg>
    } @else {
      <ng-content />
    }
  `,
})
export class InlineNotificationIconDirective extends CoreInlineNotificationIconDirective {
  /**
   * Override the icon displayed in the notification. When this input is omitted,
   * the icon is determined by the emphasis prop.
   */
  readonly icon = input<LucideIcon>()

  protected readonly qdsContext = useQdsInlineNotificationContext()

  protected readonly resolvedIcon = computed(() => {
    return this.icon() || icons[this.qdsContext().emphasis]
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getIconBindings()),
    )
  }
}
