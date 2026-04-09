// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsBreadcrumbsItemSegments} from "./breadcrumbs.types"

export interface BreadcrumbsMeasurement {
  containerWidth: number
  gap: number
  itemWidths: number[]
}

export function getItemSegments<T>(
  items: T[],
  maxItems: number | undefined,
  startItems: number,
  endItems: number,
): QdsBreadcrumbsItemSegments<T> {
  if (
    maxItems === undefined ||
    items.length <= maxItems ||
    startItems + endItems >= items.length
  ) {
    return {after: items, before: [], collapsed: []}
  }

  const end = items.length - endItems

  return {
    after: items.slice(end),
    before: items.slice(0, startItems),
    collapsed: items.slice(startItems, end),
  }
}

/**
 * Measures the breadcrumbs list element and its children to determine widths
 * for auto-overflow computation.
 */
export function measureBreadcrumbsList(
  listEl: HTMLElement,
): BreadcrumbsMeasurement | undefined {
  const containerWidth = listEl.clientWidth
  if (containerWidth === 0) {
    return undefined
  }

  const gap = parseFloat(getComputedStyle(listEl).columnGap) || 0

  const items = listEl.querySelectorAll(":scope > li")
  const itemWidths: number[] = []
  for (let i = 0; i < items.length; i++) {
    itemWidths.push((items[i] as HTMLElement).offsetWidth)
  }

  return {containerWidth, gap, itemWidths}
}

/**
 * Determines how many items fit in the container when `maxItems="auto"`.
 * @returns `undefined` when all items fit (no overflow needed).
 */
export function computeAutoMaxItems(
  containerWidth: number,
  triggerWidth: number,
  itemWidths: number[],
  gap: number,
  startItems: number,
  endItems: number,
): number | undefined {
  if (containerWidth === 0 || itemWidths.length === 0) {
    return undefined
  }

  const totalItems = itemWidths.length
  const totalWidth =
    itemWidths.reduce((sum, w) => sum + w, 0) + gap * (totalItems - 1)

  if (totalWidth <= containerWidth) {
    return undefined
  }

  if (startItems + endItems >= totalItems) {
    return undefined
  }

  // remaining space (negative when overflow needed)
  let remaining = containerWidth - totalWidth - triggerWidth - gap

  // collapse middle items from the end until everything fits
  let collapsed = 0
  for (let i = totalItems - endItems - 1; i >= startItems; i--) {
    if (remaining >= 0) {
      break
    }
    remaining += itemWidths[i] + gap
    collapsed++
  }

  return Math.max(startItems + endItems, totalItems - collapsed)
}

/**
 * Observes resize events on the breadcrumbs list and recomputes auto-overflow
 * from cached measurement data. Returns a cleanup function that disconnects
 * the observer.
 */
export function observeBreadcrumbsResize(
  listEl: HTMLElement,
  measurement: BreadcrumbsMeasurement,
  triggerWidth: number,
  opts: {endItems: number; startItems: number},
  onChange: (maxItems: number | undefined) => void,
): () => void {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) {
      return
    }

    const width = entry.borderBoxSize[0].inlineSize

    const result = computeAutoMaxItems(
      width,
      triggerWidth,
      measurement.itemWidths,
      measurement.gap,
      opts.startItems,
      opts.endItems,
    )
    onChange(result)
  })

  observer.observe(listEl, {box: "border-box"})

  return () => observer.disconnect()
}
