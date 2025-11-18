// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  effect,
  inject,
  Injectable,
  Renderer2,
  signal,
  type WritableSignal,
} from "@angular/core"

import {useCsrCheck} from "@qualcomm-ui/angular-core/common"

import {
  BRAND_COOKIE,
  BRAND_COOKIE_NAME,
  QDS_THEME_OPTIONS,
  readCookie,
  THEME_COOKIE,
  THEME_COOKIE_NAME,
} from "./qds-theme-providers"
import type {Brand, QdsThemeProviderOptions, Theme} from "./qds-theme.types"

/**
 * A service that provides access to the current theme and brand, and ensures that
 * the application's root element is in sync with the selected brand/theme.
 */
@Injectable({providedIn: "root"})
export class QdsThemeService {
  private readonly document = inject(DOCUMENT)
  private readonly response = inject(Response, {optional: true})
  private readonly renderer = inject(Renderer2, {optional: true})
  protected readonly isCsr = useCsrCheck()

  readonly theme: WritableSignal<Theme> = signal(inject(THEME_COOKIE))
  readonly brand: WritableSignal<Brand> = signal(inject(BRAND_COOKIE))

  private readonly themeOpts: QdsThemeProviderOptions =
    inject(QDS_THEME_OPTIONS)

  get themeOptions(): Required<
    Omit<
      QdsThemeProviderOptions,
      "brandOverride" | "themeOverride" | "defaultTheme" | "defaultBrand"
    >
  > {
    const opts = this.themeOpts
    const rootElement = opts.rootElement || this.document.documentElement
    return {
      rootElement,
      skipAttributes:
        typeof opts.skipAttributes === "object"
          ? {
              brand: opts.skipAttributes.brand || false,
              theme: opts.skipAttributes.theme || false,
            }
          : opts.skipAttributes || false,
      skipColorSchemeStyle: opts.skipColorSchemeStyle || false,
    }
  }

  get rootElement(): HTMLElement {
    const elementOrFn = this.themeOptions.rootElement
    return typeof elementOrFn === "function" ? elementOrFn() : elementOrFn
  }

  get skipBrandAttribute(): boolean {
    const skipAttributes = this.themeOptions.skipAttributes
    return typeof skipAttributes === "object"
      ? skipAttributes.brand || false
      : skipAttributes || false
  }

  get skipThemeAttribute(): boolean {
    const skipAttributes = this.themeOptions.skipAttributes
    return typeof skipAttributes === "object"
      ? skipAttributes.theme || false
      : skipAttributes || false
  }

  constructor() {
    effect(() => {
      const theme = this.theme()
      const brand = this.brand()
      this.syncAttributes(theme, brand)
      this.syncCookie(theme, brand)
    })

    const theme = readCookie(THEME_COOKIE_NAME) || this.themeOpts?.defaultTheme
    if (theme === "dark" || theme === "light") {
      this.theme.set(theme)
      this.syncAttributes(theme, this.brand())
    }
  }

  toggleTheme(): void {
    this.theme.update((theme) => (theme === "dark" ? "light" : "dark"))
  }

  private syncAttributes(theme: Theme, brand: Brand): void {
    if (!this.skipBrandAttribute) {
      this.updateAttribute("data-brand", brand)
    }
    if (!this.skipThemeAttribute) {
      this.updateAttribute("data-theme", theme)
    }
    if (!this.themeOptions.skipColorSchemeStyle) {
      this.updateColorScheme(theme)
    }
  }

  private syncCookie(theme: Theme, brand: Brand): void {
    if (this.isCsr()) {
      const maxAge = 60 * 60 * 24 * 365 // 1 year

      this.document.cookie = `${THEME_COOKIE_NAME}=${theme}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
      this.document.cookie = `${BRAND_COOKIE_NAME}=${brand}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
    } else if (this.response) {
      // Persist cookies by appending headers to the Fetch Response
      this.appendSetCookieHeader(THEME_COOKIE_NAME, theme)
      this.appendSetCookieHeader(BRAND_COOKIE_NAME, brand)
    }
  }

  private updateAttribute(name: string, value: string): void {
    if (this.renderer) {
      this.renderer.setAttribute(this.rootElement, name, value)
    } else {
      this.rootElement?.setAttribute?.(name, value)
    }
  }

  private updateColorScheme(theme: Theme): void {
    if (this.renderer) {
      this.renderer.setStyle(this.rootElement, "color-scheme", theme)
    } else {
      this.rootElement?.style?.setProperty?.("color-scheme", theme)
    }
  }

  private appendSetCookieHeader(name: string, value: string): void {
    this.response!.headers.append(
      "Set-Cookie",
      `${name}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`,
    )
  }
}
