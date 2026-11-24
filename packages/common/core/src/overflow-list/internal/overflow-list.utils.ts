// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {OverflowListFit} from "../overflow-list.types.js"

export interface OverflowFitInput {
  /**
   * The width of a row.
   */
  availableWidth: number

  /**
   * The gap between items on a row.
   */
  gap: number

  /**
   * The width of the indicator that follows the visible items while
   * overflowing.
   */
  indicatorWidth: number

  itemWidths: number[]

  maxRows: number

  /**
   * The width always kept free at the end of the last row.
   */
  reservedWidth: number
}

/**
 * Whether the widths wrap onto no more than `maxRows` rows. Rows break the
 * same way as `flex-wrap`. Widths are rounded up and the row width is rounded
 * down, so that sub-pixel layout never wraps an item the calculation placed.
 * Widths are capped at the row width because items like Tag have
 * `max-width: 100%`.
 */
function fitsInRows(
  widths: number[],
  rowWidth: number,
  gap: number,
  maxRows: number,
): boolean {
  let rows = 1
  let used = 0
  let rowEmpty = true
  for (const width of widths) {
    const itemWidth = Math.min(Math.ceil(width), rowWidth)
    if (rowEmpty) {
      used = itemWidth
      rowEmpty = false
    } else if (used + gap + itemWidth <= rowWidth) {
      used += gap + itemWidth
    } else {
      rows++
      if (rows > maxRows) {
        return false
      }
      used = itemWidth
    }
  }
  return true
}

/**
 * Finds how many leading items fit within `maxRows`. While they all fit
 * alongside the reserved width, nothing overflows. Otherwise the visible items
 * are the most leading items that still leave room for the indicator and the
 * reserved width, which follow them on the last row.
 */
export function getOverflowFit(input: OverflowFitInput): OverflowListFit {
  const {gap, indicatorWidth, itemWidths, maxRows, reservedWidth} = input
  const rowWidth = Math.max(0, Math.floor(input.availableWidth))
  const fits = (count: number, trailingWidth: number) =>
    fitsInRows(
      trailingWidth > 0
        ? [...itemWidths.slice(0, count), trailingWidth]
        : itemWidths.slice(0, count),
      rowWidth,
      gap,
      maxRows,
    )

  if (fits(itemWidths.length, reservedWidth)) {
    return {overflowing: false, visibleCount: itemWidths.length}
  }

  const trailingWidth =
    reservedWidth > 0 ? indicatorWidth + gap + reservedWidth : indicatorWidth
  let visibleCount = itemWidths.length - 1
  while (visibleCount > 0 && !fits(visibleCount, trailingWidth)) {
    visibleCount--
  }
  return {overflowing: true, visibleCount}
}
