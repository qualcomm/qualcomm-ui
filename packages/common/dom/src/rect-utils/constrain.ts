// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RectInit} from "./types"

// given a rect and a boundary, return a new rect that is constrained within the
// boundary resize or reposition the rect so that it fits within the boundary
export function constrainRect(rect: RectInit, boundary: RectInit): RectInit {
  const left = Math.max(
    boundary.x,
    Math.min(rect.x, boundary.x + boundary.width - rect.width),
  )
  const top = Math.max(
    boundary.y,
    Math.min(rect.y, boundary.y + boundary.height - rect.height),
  )

  return {
    height: Math.min(rect.height, boundary.height),
    width: Math.min(rect.width, boundary.width),
    x: left,
    y: top,
  }
}
