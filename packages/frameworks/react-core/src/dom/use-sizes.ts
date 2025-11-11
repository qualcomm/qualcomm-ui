// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useState} from "react"

import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"

interface ElementSize {
  height: number
  width: number
}

export type ElementSizeCallback = (size: ElementSize | undefined) => void

export function trackElementSize(
  element: HTMLElement | null,
  callback: ElementSizeCallback,
): undefined | (() => void) {
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

function trackMutation(el: HTMLElement | null, cb: () => void) {
  if (!el || !el.parentElement) {
    return
  }
  const win = el.ownerDocument?.defaultView ?? window
  const observer = new win.MutationObserver(() => {
    cb()
  })
  observer.observe(el.parentElement, {childList: true})
  return () => {
    observer.disconnect()
  }
}

/**
 * Hook for tracking the sizes of multiple elements.
 */
export function useSizes<T extends HTMLElement | null>({
  getNodes,
  observeMutation = true,
}: {
  getNodes: () => T[]
  observeMutation?: boolean
}) {
  const [sizes, setSizes] = useState<ElementSize[]>([])
  const [count, setCount] = useState(0)

  useSafeLayoutEffect(() => {
    const elements = getNodes()

    const cleanups = elements.map((element, index) =>
      trackElementSize(element, (size) => {
        setSizes((sizes) => {
          return [
            ...sizes.slice(0, index),
            size,
            ...sizes.slice(index + 1),
          ] as ElementSize[]
        })
      }),
    )

    if (observeMutation) {
      const firstNode = elements[0]
      cleanups.push(
        trackMutation(firstNode, () => {
          setCount((count) => count + 1)
        }),
      )
    }

    return () => {
      cleanups.forEach((cleanup) => {
        cleanup?.()
      })
    }
  }, [count])

  return sizes as Array<ElementSize | undefined>
}

function isRef(ref: any): ref is RefObject<any> {
  return typeof ref === "object" && ref !== null && "current" in ref
}

/**
 * Hook for tracking the size of an element.
 */
export function useSize<T extends HTMLElement | null>(
  subject: T | RefObject<T>,
) {
  const [size] = useSizes({
    getNodes() {
      const node = isRef(subject) ? subject.current : subject
      return [node]
    },
    observeMutation: false,
  })
  return size
}
