// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getElementRect} from "./from-element.js"
import {createRect} from "./rect.js"
import type {Rect} from "./types.js"
import {union} from "./union.js"

export function fromRange(range: Range): Rect {
  let rs: Rect[] = []
  const rects = Array.from(range.getClientRects())

  if (rects.length) {
    rs = rs.concat(rects.map(createRect))
    return union(...rs)
  }

  let start: Node | ParentNode | null = range.startContainer

  if (start.nodeType === Node.TEXT_NODE) {
    start = start.parentNode
  }

  if (start instanceof HTMLElement) {
    const r = getElementRect(start)
    rs.push({...r, width: 0, x: r.maxX})
  }

  return union(...rs)
}
