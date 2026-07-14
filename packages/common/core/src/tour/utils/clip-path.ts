// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Rect, Size} from "./rect.js"

interface CompositeRadius {
  bottomLeft: number
  bottomRight: number
  topLeft: number
  topRight: number
}

interface ClipPathOptions {
  enabled: boolean
  radius: CompositeRadius | number
  rect: Rect
  rootSize: Size
}

export function getClipPath(options: ClipPathOptions): string {
  const {
    enabled = true,
    radius = 0,
    rect: {height, width, x, y},
    rootSize: {height: rootHeight, width: rootWidth},
  } = options
  if (!enabled) {
    return ""
  }
  const {bottomLeft, bottomRight, topLeft, topRight} =
    typeof radius === "number"
      ? {
          bottomLeft: radius,
          bottomRight: radius,
          topLeft: radius,
          topRight: radius,
        }
      : radius

  return `M${rootWidth},${rootHeight} H0 V0 H${rootWidth} V${rootHeight} Z M${x + topLeft},${y} a${topLeft},${topLeft},0,0,0-${topLeft},${topLeft} V${height + y - bottomLeft} a${bottomLeft},${bottomLeft},0,0,0,${bottomLeft},${bottomLeft} H${width + x - bottomRight} a${bottomRight},${bottomRight},0,0,0,${bottomRight}-${bottomRight} V${y + topRight} a${topRight},${topRight},0,0,0-${topRight}-${topRight} Z`
}
