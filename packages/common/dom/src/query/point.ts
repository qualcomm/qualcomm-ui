// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {clamp} from "./shared"
import type {Point} from "./types"

export interface PercentValueOptions {
  dir?: "ltr" | "rtl" | undefined
  inverted?: boolean | {x?: boolean; y?: boolean} | undefined
  orientation?: "vertical" | "horizontal" | undefined
}

export function getRelativePoint(
  point: Point,
  element: HTMLElement,
): {
  getPercentValue: (options?: PercentValueOptions) => number
  offset: {x: number; y: number}
  percent: {x: number; y: number}
} {
  const {height, left, top, width} = element.getBoundingClientRect()
  const offset = {x: point.x - left, y: point.y - top}
  const percent = {x: clamp(offset.x / width), y: clamp(offset.y / height)}

  function getPercentValue(options: PercentValueOptions = {}): number {
    const {dir = "ltr", inverted, orientation = "horizontal"} = options
    const invertX = typeof inverted === "object" ? inverted.x : inverted
    const invertY = typeof inverted === "object" ? inverted.y : inverted
    if (orientation === "horizontal") {
      return dir === "rtl" || invertX ? 1 - percent.x : percent.x
    }
    return invertY ? 1 - percent.y : percent.y
  }
  return {getPercentValue, offset, percent}
}
