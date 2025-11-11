// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isIos} from "@qualcomm-ui/dom/query"

const LOCK_CLASSNAME = "data-scroll-lock"

function assignStyle(
  el: HTMLElement | null | undefined,
  style: Partial<CSSStyleDeclaration>,
) {
  if (!el) {
    return
  }
  const previousStyle = Object.keys(style).reduce(
    (acc, key) => {
      acc[key] = el.style.getPropertyValue(key)
      return acc
    },
    {} as Record<string, string>,
  )

  Object.assign(el.style, style)
  return () => {
    Object.assign(el.style, previousStyle)
  }
}

function setCssProperty(
  el: HTMLElement | null | undefined,
  property: string,
  value: string,
) {
  if (!el) {
    return
  }
  const previousValue = el.style.getPropertyValue(property)
  el.style.setProperty(property, value)
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue)
    } else {
      el.style.removeProperty(property)
    }
  }
}

/**
 * Determines which body-padding side must be adjusted to compensate for the
 * vertical scrollbar.  In RTL documents the scrollbar sits on the *left*,
 * hence `paddingLeft` is used instead of `paddingRight`.
 */
function getPaddingProperty(documentElement: HTMLElement) {
  const documentLeft = documentElement.getBoundingClientRect().left
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft
  return scrollbarX ? "paddingLeft" : "paddingRight"
}

/**
 * Prevents document-body scrolling while a modal, drawer, or any other
 * overlay is open.
 *
 * The function:
 * - Adds `overflow: hidden` to the `<body>` (with iOS fallback).
 * - Adds padding equal to the scrollbar width so content doesn't "jump".
 * - Exposes the scrollbar width via the CSS custom property
 *   `--scrollbar-width`.
 * - Handles both LTR and RTL layouts.
 * - Ignores subsequent calls while the body is already locked.
 *
 * Call the returned function to restore the previous state. Always do so when
 * the overlay closes to avoid broken page layout or stuck scroll-position.
 *
 * @param ownerDocument The `Document` to operate on.  Defaults to the global
 *        `document` object—pass an explicit value when working in
 *        iframes or testing environments.
 *
 * @returns A cleanup (`VoidFunction`) that re-enables scrolling, or
 *          `undefined` when scrolling was already locked.
 */
export function preventBodyScroll(
  ownerDocument?: Document,
): VoidFunction | undefined {
  const doc = ownerDocument ?? document
  const win = doc.defaultView ?? window

  const {body, documentElement} = doc

  const locked = body.hasAttribute(LOCK_CLASSNAME)
  if (locked) {
    return
  }

  body.setAttribute(LOCK_CLASSNAME, "")

  const scrollbarWidth = win.innerWidth - documentElement.clientWidth
  const setScrollbarWidthProperty = () =>
    setCssProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`)
  const paddingProperty = getPaddingProperty(documentElement)

  const setStyle = () =>
    assignStyle(body, {
      overflow: "hidden",
      [paddingProperty]: `${scrollbarWidth}px`,
    })

  // Only iOS doesn't respect `overflow: hidden` on document.body
  const setIOSStyle = () => {
    const {scrollX, scrollY, visualViewport} = win

    // iOS 12 does not support `visualViewport`.
    const offsetLeft = visualViewport?.offsetLeft ?? 0
    const offsetTop = visualViewport?.offsetTop ?? 0

    const restoreStyle = assignStyle(body, {
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      overflow: "hidden",
      [paddingProperty]: `${scrollbarWidth}px`,
      position: "fixed",
      right: "0",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
    })

    return () => {
      restoreStyle?.()
      win.scrollTo({behavior: "instant", left: scrollX, top: scrollY})
    }
  }

  const cleanups = [
    setScrollbarWidthProperty(),
    isIos() ? setIOSStyle() : setStyle(),
  ]

  return () => {
    cleanups.forEach((fn) => fn?.())
    body.removeAttribute(LOCK_CLASSNAME)
  }
}
