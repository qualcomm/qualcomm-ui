// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRect} from "./rect"
import type {Point, Rect, RectInset, SymmetricRectInset} from "./types"

export function isSymmetric(v: any): v is SymmetricRectInset {
  return "dx" in v || "dy" in v
}

export function inset(r: Rect, i: RectInset | SymmetricRectInset): Rect {
  const v = isSymmetric(i)
    ? {bottom: i.dy, left: i.dx, right: i.dx, top: i.dy}
    : i
  const {bottom = 0, left = 0, right = 0, top = 0} = v
  return createRect({
    height: r.height - top - bottom,
    width: r.width - left - right,
    x: r.x + left,
    y: r.y + top,
  })
}

export function expand(r: Rect, v: number | SymmetricRectInset): Rect {
  const value = typeof v === "number" ? {dx: -v, dy: -v} : v
  return inset(r, value)
}

export function shrink(r: Rect, v: number | SymmetricRectInset): Rect {
  const value = typeof v === "number" ? {dx: -v, dy: -v} : v
  return inset(r, value)
}

export function shift(r: Rect, o: Partial<Point>): Rect {
  const {x = 0, y = 0} = o
  return createRect({
    height: r.height,
    width: r.width,
    x: r.x + x,
    y: r.y + y,
  })
}
