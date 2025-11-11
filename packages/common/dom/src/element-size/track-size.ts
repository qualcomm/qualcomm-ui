// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface ElementSize {
  height: number
  width: number
}

export type ElementSizeCallback = (size: ElementSize | undefined) => void

export function trackElementSize(
  element: HTMLElement | null,
  callback: ElementSizeCallback,
): VoidFunction | undefined {
  if (!element) {
    callback(undefined)
    return
  }

  callback({height: element.offsetHeight, width: element.offsetWidth})

  const win = element.ownerDocument.defaultView ?? window

  const observer = new win.ResizeObserver((entries) => {
    if (!Array.isArray(entries) || !entries.length) {
      return
    }

    const [entry] = entries
    let width: number
    let height: number

    if ("borderBoxSize" in entry) {
      const borderSizeEntry = entry["borderBoxSize"]
      const borderSize = Array.isArray(borderSizeEntry)
        ? borderSizeEntry[0]
        : borderSizeEntry
      width = borderSize["inlineSize"]
      height = borderSize["blockSize"]
    } else {
      width = element.offsetWidth
      height = element.offsetHeight
    }

    callback({height, width})
  })

  observer.observe(element, {box: "border-box"})

  return () => observer.unobserve(element)
}
