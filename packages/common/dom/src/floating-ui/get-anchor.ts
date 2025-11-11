// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {VirtualElement} from "@floating-ui/dom"

import {isHTMLElement} from "@qualcomm-ui/dom/query"

import type {AnchorRect, MaybeRectElement} from "./types"

export function createDOMRect(x = 0, y = 0, width = 0, height = 0): DOMRect {
  if (typeof DOMRect === "function") {
    return new DOMRect(x, y, width, height)
  }
  const rect = {
    bottom: y + height,
    height,
    left: x,
    right: x + width,
    top: y,
    width,
    x,
    y,
  }
  return {...rect, toJSON: () => rect}
}

function getDOMRect(anchorRect?: AnchorRect | null) {
  if (!anchorRect) {
    return createDOMRect()
  }
  const {height, width, x, y} = anchorRect
  return createDOMRect(x, y, width, height)
}

export function getAnchorElement(
  anchorElement: MaybeRectElement,
  getAnchorRect?: (anchor: MaybeRectElement) => AnchorRect | null,
): VirtualElement {
  return {
    contextElement: isHTMLElement(anchorElement) ? anchorElement : undefined,
    getBoundingClientRect: () => {
      const anchor = anchorElement
      const anchorRect = getAnchorRect?.(anchor)
      if (anchorRect || !anchor) {
        return getDOMRect(anchorRect)
      }
      return anchor.getBoundingClientRect()
    },
  } as VirtualElement
}
