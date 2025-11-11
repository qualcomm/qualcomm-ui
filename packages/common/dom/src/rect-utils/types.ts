// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface Point {
  x: number
  y: number
}

export interface Size {
  height: number
  width: number
}

export interface Bounds {
  maxX: number
  maxY: number
  midX: number
  midY: number
  minX: number
  minY: number
}

export interface CenterPoint {
  center: Point
}

export interface RectInit extends Point, Size {}

export interface Rect extends Point, Size, Bounds, CenterPoint {}

/* -----------------------------------------------------------------------------
 * Edge and Side
 * ----------------------------------------------------------------------------- */

export type RectSide = "top" | "right" | "bottom" | "left"

export type RectPoint =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-center"
  | "left-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "center"

export type RectEdge = [Point, Point]

export type RectPoints = [Point, Point, Point, Point]

export type RectEdges = Record<RectSide, RectEdge> & {
  value: RectEdge[]
}

export type RectCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

export type RectCorners = Record<RectCorner, Point> & {
  value: RectPoints
}

export type RectCenter =
  | "topCenter"
  | "rightCenter"
  | "leftCenter"
  | "bottomCenter"

export type RectCenters = Record<RectCenter, Point> & {
  value: RectPoints
}

export type RectInset = Partial<Record<RectSide, number>>

export interface SymmetricRectInset {
  dx?: number | undefined
  dy?: number | undefined
}

export interface ScalingOptions {
  lockAspectRatio: boolean
  scalingOriginMode: "center" | "extent"
}

/* -----------------------------------------------------------------------------
 * Alignment
 * ----------------------------------------------------------------------------- */

export interface AlignOptions {
  h: HAlign
  v: VAlign
}

export type HAlign =
  | "left-inside"
  | "left-outside"
  | "center"
  | "right-inside"
  | "right-outside"

export type VAlign =
  | "top-inside"
  | "top-outside"
  | "center"
  | "bottom-inside"
  | "bottom-outside"
