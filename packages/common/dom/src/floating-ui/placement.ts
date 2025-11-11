// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Placement} from "@floating-ui/dom"

import type {PlacementAlign, PlacementSide} from "./types"

export function isValidPlacement(v: string): v is Placement {
  return /^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(v)
}

export function getPlacementDetails(placement: Placement): {
  align: "start" | "center" | "end" | undefined
  hasAlign: boolean
  side: PlacementSide
} {
  const [side, align] = placement.split("-") as [
    PlacementSide,
    PlacementAlign | undefined,
  ]
  return {align, hasAlign: align != null, side}
}

export function getPlacementSide(placement: Placement): PlacementSide {
  return placement.split("-")[0] as PlacementSide
}
