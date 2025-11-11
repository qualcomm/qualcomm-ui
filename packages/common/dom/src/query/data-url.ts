// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getWindow} from "./node"

export type DataUrlType = "image/png" | "image/jpeg" | "image/svg+xml"

export interface DataUrlOptions {
  /**
   * The background color of the canvas.
   * Useful when type is `image/jpeg`
   */
  background?: string | undefined
  /**
   * The quality of the image
   * @default 0.92
   */
  quality?: number | undefined
  /**
   * The type of the image
   */
  type: DataUrlType
}

export function getDataUrl(
  svg: SVGSVGElement | undefined | null,
  opts: DataUrlOptions,
): Promise<string> {
  const {background, quality = 0.92, type} = opts

  if (!svg) {
    throw new Error("[@qualcomm-ui/dom/query]: Could not find the svg element")
  }

  const win = getWindow(svg)
  const doc = win.document

  const svgBounds = svg.getBoundingClientRect()

  const svgClone = svg.cloneNode(true) as SVGSVGElement
  if (!svgClone.hasAttribute("viewBox")) {
    svgClone.setAttribute(
      "viewBox",
      `0 0 ${svgBounds.width} ${svgBounds.height}`,
    )
  }

  const serializer = new win.XMLSerializer()
  const source = `<?xml version="1.0" standalone="no"?>\r\n${serializer.serializeToString(
    svgClone,
  )}`
  const svgString = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`

  if (type === "image/svg+xml") {
    return Promise.resolve(svgString).then((str) => {
      svgClone.remove()
      return str
    })
  }

  const dpr = win.devicePixelRatio || 1

  const canvas = doc.createElement("canvas")
  const image = new win.Image()
  image.src = svgString

  canvas.width = svgBounds.width * dpr
  canvas.height = svgBounds.height * dpr

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("[getDataUrl]: Could not get the canvas context")
  }

  if (type === "image/jpeg" || background) {
    context.fillStyle = background || "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  return new Promise((resolve) => {
    image.onload = () => {
      context?.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL(type, quality))
      svgClone.remove()
    }
  })
}
