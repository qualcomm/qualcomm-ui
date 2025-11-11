// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point} from "./types"

export type CompassDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

export const compassDirectionMap: Record<CompassDirection, Point> = {
  e: {x: 1, y: 0.5},
  n: {x: 0.5, y: 0},
  ne: {x: 1, y: 0},
  nw: {x: 0, y: 0},
  s: {x: 0.5, y: 1},
  se: {x: 1, y: 1},
  sw: {x: 0, y: 1},
  w: {x: 0, y: 0.5},
} as const

export const oppositeDirectionMap: Record<CompassDirection, CompassDirection> =
  {
    e: "w",
    n: "s",
    ne: "sw",
    nw: "se",
    s: "n",
    se: "nw",
    sw: "ne",
    w: "e",
  } as const
