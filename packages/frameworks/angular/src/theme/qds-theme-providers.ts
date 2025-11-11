import {
  type EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  type Provider,
  REQUEST,
} from "@angular/core"

import type {Brand, QdsThemeProviderOptions, Theme} from "./qds-theme.types"

export const THEME_COOKIE_NAME = "qds-theme"
export const BRAND_COOKIE_NAME = "qds-brand"

/**
 * Concrete values are provided at bootstrap, but we attach a
 * factory so injection works even if the caller forgets to register them,
 * falling back to the light theme / first brand.
 */
export const THEME_COOKIE = new InjectionToken<Theme>("THEME_COOKIE", {
  factory: () => "dark",
})

export const BRAND_COOKIE = new InjectionToken<Brand>("BRAND_COOKIE", {
  factory: () => "qualcomm",
})

/**
 * Reads the cookie in both the browser (document.cookie) and during SSR
 * (Fetch Request.headers) and makes it available through THEME_COOKIE.
 */
export function provideThemeCookie(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: THEME_COOKIE,
      useFactory: () => {
        const opts = inject(QDS_THEME_OPTIONS, {optional: true})
        return (
          opts?.themeOverride || readCookie<Theme>(THEME_COOKIE_NAME, "dark")
        )
      },
    },
  ])
}

/**
 * Same helper for the brand cookie.
 */
export function provideBrandCookie(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: BRAND_COOKIE,
      useFactory: () => {
        const opts = inject(QDS_THEME_OPTIONS, {optional: true})
        return (
          opts?.brandOverride ||
          readCookie<Brand>(BRAND_COOKIE_NAME, "qualcomm")
        )
      },
    },
  ])
}

export const QDS_THEME_OPTIONS = new InjectionToken<
  Partial<QdsThemeProviderOptions>
>("QDS_THEME_OPTIONS")

export function provideQdsTheme(opts?: QdsThemeProviderOptions): Provider {
  return {
    provide: QDS_THEME_OPTIONS,
    useValue: opts || {
      skipAttributes: false,
    },
  }
}

function readCookie<T extends string>(name: string, fallback: T): T {
  // Browser path
  // eslint-disable-next-line no-restricted-globals
  if (typeof document !== "undefined") {
    // eslint-disable-next-line no-restricted-globals
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return (match?.[1] as T | undefined) ?? fallback
  }

  // Server path – Fetch Request is registered in the injector
  const request = inject(REQUEST, {optional: true})
  if (request) {
    const cookieHeader = request.headers.get("cookie") ?? ""
    const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return (match?.[1] as T | undefined) ?? fallback
  }

  return fallback
}
