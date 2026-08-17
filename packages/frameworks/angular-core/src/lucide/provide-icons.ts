// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken, type StaticProvider} from "@angular/core"
import type {LucideIcon} from "@lucide/angular"

export type LucideIconProviderValue = Record<string, LucideIcon>

/**
 * Note: This token is used to provide Lucide icons to the application. We
 * implemented this approach before Lucide updated to v1 and did something similar.
 * They also export a LUCIDE_ICONS token but it is different from this one.
 */
export const LUCIDE_ICONS = new InjectionToken<LucideIconProviderValue>(
  "LUCIDE_ICONS",
)

export function provideIcons(icons: Record<string, LucideIcon>) {
  return {
    provide: LUCIDE_ICONS,
    useFactory: () => {
      const parent: LucideIconProviderValue | null = inject(LUCIDE_ICONS, {
        optional: true,
        skipSelf: true,
      })
      if (!parent) {
        return icons
      }
      return {...parent, ...icons}
    },
  } satisfies StaticProvider
}
