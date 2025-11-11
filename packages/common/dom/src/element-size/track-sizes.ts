// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ElementSize, trackElementSize} from "./track-size"

export interface TrackElementsSizeOptions<T extends HTMLElement | null> {
  callback: (size: ElementSize | undefined, index: number) => void
  getNodes: () => T[]
  observeMutation?: boolean | undefined
}

export function trackElementsSize<T extends HTMLElement | null>(
  options: TrackElementsSizeOptions<T>,
): VoidFunction {
  const {callback, getNodes, observeMutation = true} = options

  const cleanups: Array<VoidFunction | undefined> = []

  let firstNode: T | null = null

  function trigger() {
    const elements = getNodes()
    firstNode = elements[0]
    const fns = elements.map((element, index) =>
      trackElementSize(element, (size) => {
        callback(size, index)
      }),
    )
    cleanups.push(...fns)
  }

  trigger()

  if (observeMutation) {
    const fn = trackMutation(firstNode, trigger)
    cleanups.push(fn)
  }

  return () => {
    cleanups.forEach((cleanup) => {
      cleanup?.()
    })
  }
}

export interface TrackMutationOptions extends MutationObserverInit {}

export function trackMutation(
  el: HTMLElement | null,
  cb: () => void,
  options: TrackMutationOptions = {},
): VoidFunction | undefined {
  if (!el || !el.parentElement) {
    return
  }
  const win = el.ownerDocument?.defaultView ?? window
  const observer = new win.MutationObserver(() => {
    cb()
  })
  observer.observe(el.parentElement, {childList: true, ...options})
  return () => {
    observer.disconnect()
  }
}
