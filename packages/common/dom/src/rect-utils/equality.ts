// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point, RectInit, Size} from "./types"

export function isSizeEqual(a: Size, b: Size | undefined): boolean {
  return a.width === b?.width && a.height === b?.height
}

export function isPointEqual(a: Point, b: Point | undefined): boolean {
  return a.x === b?.x && a.y === b?.y
}

export function isRectEqual(a: RectInit, b: RectInit | undefined): boolean {
  return isPointEqual(a, b) && isSizeEqual(a, b)
}
