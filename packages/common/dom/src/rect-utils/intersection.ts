// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRect} from "./rect"
import type {Rect, RectSide} from "./types"

/**
 * Checks if a Rect intersects another Rect
 */
export function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.maxX && a.y < b.maxY && a.maxX > b.x && a.maxY > b.y
}

/**
 * Returns a new Rect that represents the intersection between two Rects
 */
export function intersection(a: Rect, b: Rect): Rect {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const x2 = Math.min(a.x + a.width, b.x + b.width)
  const y2 = Math.min(a.y + a.height, b.y + b.height)
  return createRect({height: y2 - y, width: x2 - x, x, y})
}

/**
 * Returns whether two rects collide along each edge
 */
export function collisions(a: Rect, b: Rect): Record<RectSide, boolean> {
  return {
    bottom: a.maxY >= b.maxY,
    left: a.minX <= b.minX,
    right: a.maxX >= b.maxX,
    top: a.minY <= b.minY,
  }
}
