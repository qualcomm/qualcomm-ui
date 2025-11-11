// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point, Rect} from "./types"

export function getPointAngle(
  rect: Rect,
  point: Point,
  reference: Point = rect.center,
): number {
  const x = point.x - reference.x
  const y = point.y - reference.y
  const deg = Math.atan2(x, y) * (180 / Math.PI) + 180
  return 360 - deg
}
