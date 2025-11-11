// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point, RectInit, Size} from "./types"

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function clampPoint(
  position: Point,
  size: Size,
  boundaryRect: RectInit,
): {x: number; y: number} {
  const x = clamp(
    position.x,
    boundaryRect.x,
    boundaryRect.x + boundaryRect.width - size.width,
  )
  const y = clamp(
    position.y,
    boundaryRect.y,
    boundaryRect.y + boundaryRect.height - size.height,
  )
  return {x, y}
}

const defaultMinSize: Size = {
  height: 0,
  width: 0,
}

const defaultMaxSize: Size = {
  height: Infinity,
  width: Infinity,
}

export function clampSize(
  size: Size,
  minSize: Size = defaultMinSize,
  maxSize: Size = defaultMaxSize,
): {height: number; width: number} {
  return {
    height: Math.min(Math.max(size.height, minSize.height), maxSize.height),
    width: Math.min(Math.max(size.width, minSize.width), maxSize.width),
  }
}
