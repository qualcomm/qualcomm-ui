// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getRectFromPoints} from "./from-points"
import type {Rect} from "./types"

const {max, min} = Math

export function union(...rs: Rect[]): Rect {
  const pMin = {
    x: min(...rs.map((r) => r.minX)),
    y: min(...rs.map((r) => r.minY)),
  }
  const pMax = {
    x: max(...rs.map((r) => r.maxX)),
    y: max(...rs.map((r) => r.maxY)),
  }
  return getRectFromPoints(pMin, pMax)
}
