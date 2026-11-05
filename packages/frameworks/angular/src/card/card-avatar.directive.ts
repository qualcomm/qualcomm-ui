// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type OnInit} from "@angular/core"

import {
  CoreAvatarRootDirective,
  provideAvatarContext,
} from "@qualcomm-ui/angular-core/avatar"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  provideQdsAvatarContext,
  QdsAvatarContextService,
} from "@qualcomm-ui/angular/avatar"
import {createQdsAvatarApi} from "@qualcomm-ui/qds-core/avatar"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context.service"

@Directive({
  providers: [provideAvatarContext(), provideQdsAvatarContext()],
  selector: "[q-card-avatar]",
  standalone: false,
})
export class CardAvatarDirective
  extends CoreAvatarRootDirective
  implements OnInit
{
  protected readonly qdsCardContext = useQdsCardContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsAvatarService.context().getRootBindings(),
          this.qdsCardContext().getAvatarBindings(),
        ),
      ),
    )
  }

  protected readonly qdsAvatarService = inject(QdsAvatarContextService)

  override ngOnInit() {
    super.ngOnInit()

    const qdsAvatarApi = computed(() =>
      createQdsAvatarApi(
        {
          emphasis: "neutral",
          size: "xl",
        },
        normalizeProps,
      ),
    )

    this.qdsAvatarService.init(qdsAvatarApi)
  }
}
