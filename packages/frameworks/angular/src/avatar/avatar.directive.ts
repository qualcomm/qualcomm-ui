// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {
  CoreAvatarRootDirective,
  provideAvatarContext,
} from "@qualcomm-ui/angular-core/avatar"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsAvatarApi,
  type QdsAvatarApiProps,
  type QdsAvatarSize,
  type QdsAvatarStatus,
  type QdsAvatarVariant,
} from "@qualcomm-ui/qds-core/avatar"

import {
  provideQdsAvatarContext,
  QdsAvatarContextService,
} from "./qds-avatar-context.service"

@Directive({
  providers: [provideAvatarContext(), provideQdsAvatarContext()],
  selector: "[q-avatar]",
  standalone: false,
})
export class AvatarDirective
  extends CoreAvatarRootDirective
  implements SignalifyInput<QdsAvatarApiProps>
{
  /**
   * Governs the width and height of the avatar as well as the font size of its
   * content.
   */
  readonly size = input<QdsAvatarSize | undefined>()

  /**
   * Optional status for the avatar, renders a dot indicator next to the avatar.
   */
  readonly status = input<QdsAvatarStatus | undefined>()

  /**
   * The style variant of the avatar. Test
   */
  readonly variant = input<QdsAvatarVariant | undefined>()

  protected readonly qdsAvatarService = inject(QdsAvatarContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsAvatarService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    const qdsAvatarApi = computed(() =>
      createQdsAvatarApi(
        {
          size: this.size(),
          status: this.status(),
          variant: this.variant(),
        },
        normalizeProps,
      ),
    )

    this.qdsAvatarService.init(qdsAvatarApi)
  }
}
