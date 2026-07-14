// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getWindow} from "@qualcomm-ui/dom/query"

export interface Point {
  x: number
  y: number
}

export interface Size {
  height: number
  width: number
}

export interface Rect extends Point, Size {}

function getFrameElement(win: Window): Element | null {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null
}

function normalizeEventPoint(event: PointerEvent) {
  let clientX = event.clientX
  let clientY = event.clientY
  let win = event.view || window
  let frame = getFrameElement(win)

  while (frame) {
    const iframeRect = frame.getBoundingClientRect()
    const css = getComputedStyle(frame)
    clientX += iframeRect.left + frame.clientLeft + parseFloat(css.paddingLeft)
    clientY += iframeRect.top + frame.clientTop + parseFloat(css.paddingTop)
    win = getWindow(frame)
    frame = getFrameElement(win)
  }

  return {clientX, clientY}
}

export function isEventInRect(rect: Rect, event: PointerEvent): boolean {
  const {clientX, clientY} = normalizeEventPoint(event)
  return (
    rect.y <= clientY &&
    clientY <= rect.y + rect.height &&
    rect.x <= clientX &&
    clientX <= rect.x + rect.width
  )
}

export function offset(rect: Rect, point: Point): Rect {
  const dx = point.x || 0
  const dy = point.y || 0
  return {
    height: rect.height + dy + dy,
    width: rect.width + dx + dx,
    x: rect.x - dx,
    y: rect.y - dy,
  }
}
