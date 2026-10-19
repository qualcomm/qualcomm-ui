// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Point, toRad} from "@qualcomm-ui/dom/rect-utils"

import type {FlipState} from "../image-viewer.types.js"

const {cos, sin} = Math

export interface Matrix {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}

interface ImageTransformParams {
  flip: FlipState
  offset: Point
  rotation: number
  zoom: number
}

export function getImageTransform(params: ImageTransformParams): Matrix {
  const {flip, offset, rotation, zoom} = params
  const theta = toRad(rotation)
  const safeZoom = zoom > 0 ? zoom : 1
  const scaleX = safeZoom * (flip.horizontal ? -1 : 1)
  const scaleY = safeZoom * (flip.vertical ? -1 : 1)

  return {
    a: cos(theta) * scaleX,
    b: sin(theta) * scaleX,
    c: -sin(theta) * scaleY,
    d: cos(theta) * scaleY,
    e: offset.x,
    f: offset.y,
  }
}

export function getImageTransformCss(params: ImageTransformParams): string {
  const {a, b, c, d, e, f} = getImageTransform(params)
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
}
