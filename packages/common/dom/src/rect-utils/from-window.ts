// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRect} from "./rect"
import type {Rect} from "./types"

export type WindowRectOptions = {
  /**
   * Whether to exclude the element's scrollbar size from the calculation.
   */
  excludeScrollbar?: boolean
}

/**
 * Creates a rectangle from window object
 */
export function getWindowRect(win: Window, opts: WindowRectOptions = {}): Rect {
  return createRect(getViewportRect(win, opts))
}

/**
 * Get the rect of the window with the option to exclude the scrollbar
 */
export function getViewportRect(
  win: Window,
  opts: WindowRectOptions,
): {
  height: number
  width: number
  x: number
  y: number
} {
  const {excludeScrollbar = false} = opts
  const {document: doc, innerHeight, innerWidth, visualViewport} = win
  const width = visualViewport?.width || innerWidth
  const height = visualViewport?.height || innerHeight
  const rect = {height, width, x: 0, y: 0}
  if (excludeScrollbar) {
    const scrollbarWidth = innerWidth - doc.documentElement.clientWidth
    const scrollbarHeight = innerHeight - doc.documentElement.clientHeight
    rect.width -= scrollbarWidth
    rect.height -= scrollbarHeight
  }
  return rect
}
