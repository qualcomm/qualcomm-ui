// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreAvatarImageDirective} from "@qualcomm-ui/angular-core/avatar"

import {useQdsAvatarContext} from "./qds-avatar-context.service"

@Directive({
  selector: "[q-avatar-image]",
  standalone: false,
})
export class AvatarImageDirective extends CoreAvatarImageDirective {
  protected readonly qdsContext = useQdsAvatarContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getImageBindings()),
    )
  }
}
