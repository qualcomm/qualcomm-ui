// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useCallback, useEffect, useState} from "react"

export type ShapeType = {
  height: number
  width: number
}

export const getRealShape = (el: HTMLElement | null): ShapeType => {
  const defaultShape: ShapeType = {height: 0, width: 0}
  if (!el || typeof window === "undefined") {
    return defaultShape
  }

  const rect = el.getBoundingClientRect()
  const {height, width} = window.getComputedStyle(el)

  const getCSSStyleVal = (str: string, parentNum: number) => {
    if (!str) {
      return 0
    }
    const strVal = str.includes("px")
      ? +str.split("px")[0]
      : str.includes("%")
        ? +str.split("%")[0] * parentNum * 0.01
        : str

    return Number.isNaN(+strVal) ? 0 : +strVal
  }

  return {
    height: getCSSStyleVal(`${height}`, rect.height),
    width: getCSSStyleVal(`${width}`, rect.width),
  }
}

export type ShapeResult = [ShapeType, () => void]

export const useRealShape = <T extends HTMLElement>(
  ref: RefObject<T | null>,
): ShapeResult => {
  const [state, setState] = useState<ShapeType>({
    height: 0,
    width: 0,
  })
  const update = useCallback(() => {
    const {height, width} = getRealShape(ref.current)
    setState({height, width})
  }, [ref])
  useEffect(() => update(), [update])

  return [state, update]
}
