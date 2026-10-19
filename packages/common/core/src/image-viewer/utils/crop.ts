// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Point,
  type RectInit as Rect,
  type Size,
  toRad,
} from "@qualcomm-ui/dom/rect-utils"
import {isBoolean} from "@qualcomm-ui/utils/guard"
import type {PropFn} from "@qualcomm-ui/utils/machine"
import {clampValue} from "@qualcomm-ui/utils/number"

import type {FlipState, ImageViewerSchema} from "../image-viewer.types.js"

const {abs, cos, max, sin} = Math

export const MIN_PINCH_DISTANCE = 1

interface ClampOffsetParams {
  crop?: Rect
  fixedCropArea?: boolean
  offset: Point
  rotation: number
  viewportSize: Size
  zoom: number
}

export function clampOffset(params: ClampOffsetParams): Point {
  const {crop, fixedCropArea, offset, rotation, viewportSize, zoom} = params

  const {cos, sin} = getRotationTransform(rotation)

  if (fixedCropArea && crop) {
    const aabb = computeAabb(viewportSize, zoom, cos, sin)
    const center = getViewportCenter(viewportSize)

    const cropRight = crop.x + crop.width
    const cropBottom = crop.y + crop.height

    const minPoint = {
      x: cropRight - center.x - aabb.width / 2,
      y: cropBottom - center.y - aabb.height / 2,
    }

    const maxPoint = {
      x: crop.x - center.x + aabb.width / 2,
      y: crop.y - center.y + aabb.height / 2,
    }

    return clampPoint(offset, minPoint, maxPoint)
  }

  const aabb = computeAabb(viewportSize, zoom, cos, sin)

  const extraWidth = max(0, aabb.width - viewportSize.width)
  const extraHeight = max(0, aabb.height - viewportSize.height)

  const minPoint = {x: -extraWidth / 2, y: -extraHeight / 2}
  const maxPoint = {x: extraWidth / 2, y: extraHeight / 2}

  return clampPoint(offset, minPoint, maxPoint)
}

export function getKeyboardMoveDelta(key: string, step: number): Point {
  switch (key) {
    case "ArrowLeft":
      return {x: -step, y: 0}
    case "ArrowRight":
      return {x: step, y: 0}
    case "ArrowUp":
      return {x: 0, y: -step}
    case "ArrowDown":
      return {x: 0, y: step}
    default:
      return ZERO_POINT
  }
}

export function getNudgeStep(
  prop: PropFn<ImageViewerSchema>,
  modifiers: {ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean},
): number {
  if (modifiers.ctrlKey || modifiers.metaKey) {
    return prop("nudgeStepCtrl")
  }
  if (modifiers.shiftKey) {
    return prop("nudgeStepShift")
  }
  return prop("nudgeStep")
}

export function normalizeFlipState(
  nextFlip: Partial<FlipState> | undefined,
  currentFlip: FlipState,
): FlipState {
  if (!nextFlip) {
    return currentFlip
  }
  return {
    horizontal: isBoolean(nextFlip.horizontal)
      ? nextFlip.horizontal
      : currentFlip.horizontal,
    vertical: isBoolean(nextFlip.vertical)
      ? nextFlip.vertical
      : currentFlip.vertical,
  }
}

export function isEqualFlip(a: FlipState, b: FlipState): boolean {
  return a.horizontal === b.horizontal && a.vertical === b.vertical
}

export function isVisibleRect(rect: Size): boolean {
  return rect.width > 0 && rect.height > 0
}

export function getViewportCenter(size: Size): Point {
  return {
    x: size.width / 2,
    y: size.height / 2,
  }
}

export function getMidpoint(
  p1: Point,
  p2: Point,
  offset: Point = ZERO_POINT,
): Point {
  return {
    x: (p1.x + p2.x) / 2 - offset.x,
    y: (p1.y + p2.y) / 2 - offset.y,
  }
}

export const ZERO_POINT: Point = {x: 0, y: 0}

export function clampPoint(point: Point, min: Point, max: Point): Point {
  return {
    x: clampValue(point.x, min.x, max.x),
    y: clampValue(point.y, min.y, max.y),
  }
}

export function getRotationTransform(rotation: number): {
  cos: number
  sin: number
} {
  const theta = toRad(rotation)
  return {
    cos: abs(cos(theta)),
    sin: abs(sin(theta)),
  }
}

export function computeAabb(
  size: Size,
  zoom: number,
  cos: number,
  sin: number,
): Size {
  const w = size.width * zoom
  const h = size.height * zoom
  return {
    height: w * sin + h * cos,
    width: w * cos + h * sin,
  }
}

export function scaleSize(size: Size, scale: number): Size {
  return {
    height: size.height * scale,
    width: size.width * scale,
  }
}
