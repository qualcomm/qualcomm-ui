// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getDocument, setStyle, waitForElements} from "@qualcomm-ui/dom/query"

import {layerStack} from "./layer-stack"

let originalBodyPointerEvents: string

export function assignPointerEventToLayers(): void {
  layerStack.layers.forEach(({node}) => {
    node.style.pointerEvents = layerStack.isBelowPointerBlockingLayer(node)
      ? "none"
      : "auto"
  })
}

export function clearPointerEvent(node: HTMLElement): void {
  node.style.pointerEvents = ""
}

export function disablePointerEventsOutside(
  node: HTMLElement,
  persistentElements?: Array<() => Element | null>,
): VoidFunction {
  const doc = getDocument(node)

  const cleanups: VoidFunction[] = []

  if (
    layerStack.hasPointerBlockingLayer() &&
    !doc.body.hasAttribute("data-inert")
  ) {
    originalBodyPointerEvents = document.body.style.pointerEvents
    queueMicrotask(() => {
      doc.body.style.pointerEvents = "none"
      doc.body.setAttribute("data-inert", "")
    })
  }

  if (persistentElements) {
    const persistedCleanup = waitForElements(persistentElements, (el) => {
      cleanups.push(setStyle(el, {pointerEvents: "auto"}))
    })
    cleanups.push(persistedCleanup)
  }

  return () => {
    if (layerStack.hasPointerBlockingLayer()) {
      return
    }
    queueMicrotask(() => {
      doc.body.style.pointerEvents = originalBodyPointerEvents
      doc.body.removeAttribute("data-inert")
      if (doc.body.style.length === 0) {
        doc.body.removeAttribute("style")
      }
    })
    cleanups.forEach((fn) => fn())
  }
}
