// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken, type Provider, REQUEST} from "@angular/core"

import type {Brand, QdsThemeProviderOptions, Theme} from "./qds-theme.types"

export const THEME_COOKIE_NAME = "app-qds-theme"
export const BRAND_COOKIE_NAME = "app-qds-brand"

/**
 * Concrete values are provided at bootstrap, but we attach a
 * factory so injection works even if the caller forgets to register them,
 * falling back to the light theme / first brand.
 */
export const THEME_COOKIE = new InjectionToken<Theme>("THEME_COOKIE")

export const BRAND_COOKIE = new InjectionToken<Brand>("BRAND_COOKIE")

/**
 * Reads the cookie in both the browser (document.cookie) and during SSR
 * (Fetch Request.headers) and makes it available through THEME_COOKIE.
 */
function provideThemeCookie(opts?: QdsThemeProviderOptions): Provider {
  return {
    provide: THEME_COOKIE,
    useFactory: () => {
      return (
        opts?.themeOverride ||
        readCookie<Theme>(THEME_COOKIE_NAME) ||
        opts?.defaultTheme ||
        "dark"
      )
    },
  }
}

/**
 * Same helper for the brand cookie.
 */
function provideBrandCookie(opts?: QdsThemeProviderOptions): Provider {
  return {
    provide: BRAND_COOKIE,
    useFactory: () => {
      return (
        opts?.brandOverride ||
        readCookie<Brand>(BRAND_COOKIE_NAME) ||
        opts?.defaultBrand ||
        "qualcomm"
      )
    },
  }
}

export const QDS_THEME_OPTIONS = new InjectionToken<
  Partial<QdsThemeProviderOptions>
>("QDS_THEME_OPTIONS")

function provideQdsThemeOptions(opts?: QdsThemeProviderOptions): Provider {
  return {
    provide: QDS_THEME_OPTIONS,
    useValue: opts || {
      skipAttributes: false,
    },
  }
}

export function provideQdsTheme(opts?: QdsThemeProviderOptions) {
  return [
    provideQdsThemeOptions(opts),
    provideThemeCookie(opts),
    provideBrandCookie(opts),
  ]
}

export function readCookie<T extends string>(name: string): string | undefined {
  // Browser path
  // eslint-disable-next-line no-restricted-globals
  if (typeof document !== "undefined") {
    // eslint-disable-next-line no-restricted-globals
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match?.[1] || undefined
  }

  // Server path – Fetch Request is registered in the injector
  const request = inject(REQUEST, {optional: true})
  if (request) {
    const cookieHeader = request.headers.get("cookie") ?? ""
    const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match?.[1] as T | undefined
  }

  return undefined
}
