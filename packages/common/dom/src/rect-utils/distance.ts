// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {intersects} from "./intersection"
import type {Point, Rect, RectSide} from "./types"

export interface DistanceValue extends Point {
  value: number
}

export function distance(a: Point, b: Point = {x: 0, y: 0}): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

export function distanceFromPoint(r: Rect, p: Point): DistanceValue {
  let x = 0
  let y = 0

  if (p.x < r.x) {
    x = r.x - p.x
  } else if (p.x > r.maxX) {
    x = p.x - r.maxX
  }

  if (p.y < r.y) {
    y = r.y - p.y
  } else if (p.y > r.maxY) {
    y = p.y - r.maxY
  }
  return {value: distance({x, y}), x, y}
}

export function distanceFromRect(a: Rect, b: Rect): DistanceValue {
  if (intersects(a, b)) {
    return {value: 0, x: 0, y: 0}
  }
  const left = a.x < b.x ? a : b
  const right = b.x < a.x ? a : b
  const upper = a.y < b.y ? a : b
  const lower = b.y < a.y ? a : b
  let x = left.x === right.x ? 0 : right.x - left.maxX
  x = Math.max(0, x)
  let y = upper.y === lower.y ? 0 : lower.y - upper.maxY
  y = Math.max(0, y)
  return {value: distance({x, y}), x, y}
}

export function distanceBtwEdges(a: Rect, b: Rect): Record<RectSide, number> {
  return {
    bottom: a.maxY - b.maxY,
    left: b.x - a.x,
    right: a.maxX - b.maxX,
    top: b.y - a.y,
  }
}
