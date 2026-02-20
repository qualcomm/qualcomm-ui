// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type RefObject,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react"

import {useSize} from "./use-sizes"

export interface UseOverflowItemsOptions<T> {
  /**
   * Ref to the container element that items overflow within.
   * The container's `column-gap` and `--indicator-width` CSS properties are used
   * for calculations.
   */
  containerRef: RefObject<HTMLElement | null>
  /**
   * The items to check for overflow.
   */
  items: T[]
}

export interface UseOverflowItemsReturn<T> {
  /**
   * Callback ref to attach to each item element.
   */
  measureRef: (item: T, element: HTMLElement | null) => void
  /**
   * Items that fit within the container.
   */
  visibleItems: T[]
}

/**
 * Hook that calculates which items fit within a container using ResizeObserver.
 */
export function useOverflowItems<T>({
  containerRef,
  items,
}: UseOverflowItemsOptions<T>): UseOverflowItemsReturn<T> {
  const itemWidthsRef = useRef(new Map<T, number>())
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  const containerSize = useSize(containerRef)

  // Clean up stale measurements when items change
  useLayoutEffect(() => {
    const itemSet = new Set(items)
    const widths = itemWidthsRef.current
    for (const key of widths.keys()) {
      if (!itemSet.has(key)) {
        widths.delete(key)
      }
    }
  }, [items])

  const measureRef = useCallback((item: T, element: HTMLElement | null) => {
    if (!element) {
      return
    }

    const widths = itemWidthsRef.current
    const newWidth = element.offsetWidth
    if (widths.get(item) !== newWidth) {
      widths.set(item, newWidth)
      forceUpdate()
    }
  }, [])

  const container = containerRef.current
  const containerWidth = containerSize?.width ?? 0
  if (!container || !containerWidth || items.length === 0) {
    return {measureRef, visibleItems: items}
  }

  const styles = getComputedStyle(container)
  const gap = parseFloat(styles.columnGap) || 0
  const indicatorWidth = parseFloat(
    styles.getPropertyValue("--indicator-width"),
  )
  const itemWidths = itemWidthsRef.current
  let usedWidth = 0
  let count = 0

  for (const item of items) {
    const itemWidth = itemWidths.get(item) ?? 0
    const widthWithGap = count > 0 ? itemWidth + gap : itemWidth
    const remainingItems = items.length - count - 1
    const reservedWidth = remainingItems > 0 ? indicatorWidth + gap : 0

    if (usedWidth + widthWithGap + reservedWidth > containerWidth) {
      break
    }

    usedWidth += widthWithGap
    count++
  }

  return {
    measureRef,
    visibleItems: items.slice(0, count),
  }
}
