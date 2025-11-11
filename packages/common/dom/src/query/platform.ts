// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function isDom(): boolean {
  return typeof document !== "undefined"
}

interface NavigatorUserAgentData {
  brands: Array<{brand: string; version: string}>
  mobile: boolean
  platform: string
}

export function getPlatform(): string {
  const agent = (navigator as any).userAgentData as
    | NavigatorUserAgentData
    | undefined
  return agent?.platform ?? navigator.platform
}

export function getUserAgent(): string {
  const ua = (navigator as any).userAgentData as
    | NavigatorUserAgentData
    | undefined
  if (ua && Array.isArray(ua.brands)) {
    return ua.brands.map(({brand, version}) => `${brand}/${version}`).join(" ")
  }
  return navigator.userAgent
}

function pt(v: RegExp) {
  return isDom() && v.test(getPlatform())
}

function ua(v: RegExp) {
  return isDom() && v.test(getUserAgent())
}

const vn = (v: RegExp) => isDom() && v.test(navigator.vendor)

export function isTouchDevice(): boolean {
  return isDom() && !!navigator.maxTouchPoints
}

export function isMac(): boolean {
  return pt(/^Mac/)
}

export function isSafari(): boolean {
  return isApple() && vn(/apple/i)
}

export function isFirefox(): boolean {
  return ua(/firefox\//i)
}

export function isApple(): boolean {
  return pt(/mac|iphone|ipad|ipod/i)
}

export function isIos(): boolean {
  return pt(/iP(hone|ad|od)|iOS/)
}

export function isWebKit(): boolean {
  return ua(/AppleWebKit/)
}

export function isAndroid(): boolean {
  const re = /android/i
  return pt(re) || ua(re)
}

/**
 * Returns the keyboard modifier key: CMD if on Mac, Ctrl if on Windows or Linux.
 *
 * @param ssrFallback fallback value to render during SSR.
 */
export function getModifierKey(ssrFallback: string = "Ctrl"): string {
  return isMac() ? "⌘" : ssrFallback
}
