// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point, Rect, RectEdge, RectInit, RectSide} from "./types"

/* -----------------------------------------------------------------------------
 * Point
 * ----------------------------------------------------------------------------- */

export function createPoint(x: number, y: number): Point {
  return {x, y}
}

export function subtractPoints(a: Point, b: Point | null): Point {
  if (!b) {
    return a
  }
  return createPoint(a.x - b.x, a.y - b.y)
}

export function addPoints(a: Point, b: Point): Point {
  return createPoint(a.x + b.x, a.y + b.y)
}

export function isPoint(v: any): v is Point {
  return Reflect.has(v, "x") && Reflect.has(v, "y")
}

/* -----------------------------------------------------------------------------
 * Rect
 * ----------------------------------------------------------------------------- */

export function createRect(r: RectInit): Rect {
  const {height, width, x, y} = r
  const midX = x + width / 2
  const midY = y + height / 2
  return {
    center: createPoint(midX, midY),
    height,
    maxX: x + width,
    maxY: y + height,
    midX,
    midY,
    minX: x,
    minY: y,
    width,
    x,
    y,
  }
}

export function isRect(v: any): v is Rect {
  return (
    Reflect.has(v, "x") &&
    Reflect.has(v, "y") &&
    Reflect.has(v, "width") &&
    Reflect.has(v, "height")
  )
}

export function getRectCenters(v: Rect): Record<RectSide, Point> {
  const top = createPoint(v.midX, v.minY)
  const right = createPoint(v.maxX, v.midY)
  const bottom = createPoint(v.midX, v.maxY)
  const left = createPoint(v.minX, v.midY)
  return {bottom, left, right, top}
}

export function getRectCorners(v: Rect): Record<RectSide, Point> {
  const top = createPoint(v.minX, v.minY)
  const right = createPoint(v.maxX, v.minY)
  const bottom = createPoint(v.maxX, v.maxY)
  const left = createPoint(v.minX, v.maxY)
  return {bottom, left, right, top}
}

export function getRectEdges(v: Rect): Record<RectSide, RectEdge> {
  const c = getRectCorners(v)
  const top: RectEdge = [c.top, c.right]
  const right: RectEdge = [c.right, c.bottom]
  const bottom: RectEdge = [c.left, c.bottom]
  const left: RectEdge = [c.top, c.left]
  return {bottom, left, right, top}
}
