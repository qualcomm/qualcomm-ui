// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRect} from "./rect"
import type {Point, Rect} from "./types"

export function getRectFromPoints(...pts: Point[]): Rect {
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)

  const x = Math.min(...xs)
  const y = Math.min(...ys)

  const width = Math.max(...xs) - x
  const height = Math.max(...ys) - y

  return createRect({height, width, x, y})
}
