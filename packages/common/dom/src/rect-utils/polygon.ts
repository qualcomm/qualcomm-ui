// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRect, getRectCorners} from "./rect"
import type {Point, RectInit} from "./types"

export function getElementPolygon(
  rectValue: RectInit,
  placement: string,
): Point[] | undefined {
  const rect = createRect(rectValue)
  const {bottom, left, right, top} = getRectCorners(rect)
  const [base] = placement.split("-")

  return {
    bottom: [top, left, bottom, right],
    left: [right, top, left, bottom],
    right: [top, right, bottom, left],
    top: [left, top, right, bottom],
  }[base]
}

export function isPointInPolygon(polygon: Point[], point: Point): boolean {
  const {x, y} = point
  let c = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      c = !c
    }
  }
  return c
}

function createPolygonElement() {
  const id = "debug-polygon"
  const existingPolygon = document.getElementById(id)
  if (existingPolygon) {
    return existingPolygon
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  Object.assign(svg.style, {
    fill: "red",
    height: "100%",
    left: "0",
    opacity: "0.15",
    pointerEvents: "none",
    position: "fixed",
    top: "0",
    width: "100%",
  })

  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  )
  polygon.setAttribute("id", id)
  polygon.setAttribute("points", "0,0 0,0")
  svg.appendChild(polygon)
  document.body.appendChild(svg)
  return polygon
}

export function debugPolygon(polygon: Point[]): VoidFunction {
  const el = createPolygonElement()
  const points = polygon.map((point) => `${point.x},${point.y}`).join(" ")
  el.setAttribute("points", points)
  return () => {
    el.remove()
  }
}
