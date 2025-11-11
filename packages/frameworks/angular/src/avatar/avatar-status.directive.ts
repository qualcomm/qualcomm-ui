// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreAvatarStatusDirective} from "@qualcomm-ui/angular-core/avatar"

import {useQdsAvatarContext} from "./qds-avatar-context.service"

@Directive({
  selector: "[q-avatar-status]",
  standalone: false,
})
export class AvatarStatusDirective extends CoreAvatarStatusDirective {
  protected readonly qdsContext = useQdsAvatarContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getStatusBindings()),
    )
  }
}
