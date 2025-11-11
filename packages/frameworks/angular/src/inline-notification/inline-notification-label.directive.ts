// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreInlineNotificationLabelDirective} from "@qualcomm-ui/angular-core/inline-notification"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

@Directive({
  selector: "[q-inline-notification-label]",
  standalone: false,
})
export class InlineNotificationLabelDirective extends CoreInlineNotificationLabelDirective {
  protected readonly qdsContext = useQdsInlineNotificationContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHeadingBindings()),
    )
  }
}
