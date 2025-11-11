// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {BellRing, CircleAlert, CircleCheck, TriangleAlert} from "lucide-angular"

import {CoreInlineNotificationIconDirective} from "@qualcomm-ui/angular-core/inline-notification"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

const icons: Partial<Record<QdsNotificationEmphasis, LucideIcon>> = {
  danger: CircleAlert,
  info: CircleAlert,
  neutral: BellRing,
  success: CircleCheck,
  warning: TriangleAlert,
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
  protected readonly qdsContext = useQdsInlineNotificationContext()

  protected readonly resolvedIcon = computed(() => {
    return icons[this.qdsContext().emphasis]
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getIconBindings()),
    )
  }
}
