import {inject, InjectionToken, type StaticProvider} from "@angular/core"

import type {LucideIcon} from "./lucide.types"

export type LucideIconProviderValue = Record<string, LucideIcon>

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
