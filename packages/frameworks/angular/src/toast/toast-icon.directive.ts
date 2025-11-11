// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, type OnInit} from "@angular/core"
import {BellRing, CircleAlert, CircleCheck, TriangleAlert} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"

import {useQdsToastContext} from "./qds-toast-context.service"

@Component({
  selector: "[q-toast-icon]",
  standalone: false,
  template: `
    <ng-content>
      @if (showLoadingSpinner()) {
        <div q-progress-ring size="xs"></div>
      } @else if (icon()) {
        <svg size="lg" [qIcon]="icon()!" />
      }
    </ng-content>
  `,
})
export class ToastIconDirective implements OnInit {
  protected readonly qdsContext = useQdsToastContext()

  readonly icon = computed(() => {
    const emphasis = this.qdsContext().emphasis
    if (emphasis === "loading") {
      return undefined
    }
    return this.icons[emphasis]
  })

  readonly showLoadingSpinner = computed(
    () => this.qdsContext().emphasis === "loading",
  )

  protected readonly icons: Omit<
    Record<QdsNotificationEmphasis, LucideIconOrString>,
    "loading"
  > = {
    danger: CircleAlert,
    info: CircleAlert,
    neutral: BellRing,
    success: CircleCheck,
    warning: TriangleAlert,
  }

  protected readonly trackBindings = useTrackBindings(() => {
    return this.qdsContext().getIconBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
