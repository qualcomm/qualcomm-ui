// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  DOCUMENT,
  inject,
  Injectable,
  signal,
  type WritableSignal,
} from "@angular/core"

import {type Brand, type Theme} from "@qualcomm-ui/angular/theme"
import {useOnDestroy} from "@qualcomm-ui/angular-core/common"

/**
 * A service that provides access to the current theme and brand, and ensures that
 * the application's root element is in sync with the selected brand/theme.
 */
@Injectable({providedIn: "root"})
export class MockedThemeService {
  readonly theme: WritableSignal<Theme> = signal("dark")
  readonly brand: WritableSignal<Brand> = signal("qualcomm")
  readonly document = inject(DOCUMENT)
  onDestroy = useOnDestroy()

  constructor() {
    const element = this.document.documentElement
    if (element) {
      const theme =
        element.getAttribute("data-theme") === "light" ? "light" : "dark"
      this.theme.set(theme)

      const observer = new MutationObserver(() => {
        const newTheme =
          element.getAttribute("data-theme") === "light" ? "light" : "dark"
        this.theme.set(newTheme)
      })

      observer.observe(element, {attributes: true})

      this.onDestroy(() => observer.disconnect())
    }
  }

  toggleTheme(): void {
    this.theme.update((theme) => (theme === "dark" ? "light" : "dark"))
  }
}
