// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getWindow, isHTMLElement} from "@qualcomm-ui/dom/query"

type MaybeElement = HTMLElement | null | undefined

export interface ElementRect {
  height: number
  left: number
  top: number
  width: number
}

export interface RectEntryDetails {
  entries: ResizeObserverEntry[]
  rects: ElementRect[]
}

export interface ElementRectOptions extends ResizeObserverOptions {
  /**
   * The function to call to get the element's rect.
   */
  measure: (el: HTMLElement) => ElementRect
  /**
   * The callback to call when the element's rect changes.
   */
  onEntry: (details: RectEntryDetails) => void
}

export function trackElementRect(
  elements: MaybeElement[],
  options: ElementRectOptions,
): () => void {
  const {box = "border-box", measure, onEntry} = options
  const elems = (Array.isArray(elements) ? elements : [elements]).filter(
    isHTMLElement,
  )
  const win = getWindow(elems[0])
  const trigger = (entries: ResizeObserverEntry[]) => {
    const rects = elems.map((el) => measure(el))
    onEntry({entries, rects})
  }
  trigger([])
  const obs = new win.ResizeObserver(trigger)
  elems.forEach((el) => obs.observe(el, {box}))
  return () => obs.disconnect()
}
