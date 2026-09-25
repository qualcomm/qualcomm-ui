// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, inject, type Provider} from "@angular/core"

import {
  BADGE_CONTEXT_TOKEN,
  type BadgeTokenContext,
} from "@qualcomm-ui/angular/badge"

import {QdsButtonContextService} from "./qds-button-context.service"

export function provideQdsButtonBadgeContext(): Provider {
  return {
    provide: BADGE_CONTEXT_TOKEN,
    useFactory: (): BadgeTokenContext => {
      const button = inject(QdsButtonContextService)
      const disabled = computed(
        () => button.context().getRootBindings().disabled,
      )
      return {
        numberBadge: computed(() => ({
          disabled: disabled(),
          emphasis: button.context().numberBadgeEmphasis,
          size: button.context().numberBadgeSize,
        })),
        statusBadge: computed(() => ({
          disabled: disabled(),
          size: button.context().statusBadgeSize,
        })),
      }
    },
  }
}
