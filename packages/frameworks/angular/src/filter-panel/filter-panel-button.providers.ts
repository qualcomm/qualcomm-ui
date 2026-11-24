// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, inject, type Provider} from "@angular/core"

import {
  provideQdsButtonBadgeContext,
  provideQdsButtonContext,
  QdsButtonContextService,
} from "@qualcomm-ui/angular/button"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"

/**
 * The contexts of a text button and its icons and badges.
 */
export function provideFilterPanelButtonContexts(): Provider[] {
  return [
    provideQdsButtonContext(),
    provideQdsButtonBadgeContext(),
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(QdsButtonContextService)
        return {
          getBindings: computed(() => button.context().getStartIconBindings()),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(QdsButtonContextService)
        return {
          getBindings: computed(() => button.context().getEndIconBindings()),
        }
      },
    },
  ]
}
