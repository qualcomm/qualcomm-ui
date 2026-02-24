// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface CalculateVisibleTagsInput {
  availableWidth: number
  gap: number
  indicatorWidth: number
  minInputWidth: number
  tagWidths: number[]
}

export interface CalculateVisibleTagsResult {
  overflowCount: number
  visibleCount: number
}

/**
 * Determines how many tags fit in the container, reserving space for the
 * "+N" indicator when overflow occurs.
 *
 * When tags overflow, the indicator takes `indicatorWidth + gap` of reserved
 * space. If even 0 tags + indicator don't fit, visibleCount is 0 and the
 * indicator shows the total count.
 */
export function calculateVisibleTags(
  input: CalculateVisibleTagsInput,
): CalculateVisibleTagsResult {
  const {availableWidth, gap, indicatorWidth, minInputWidth, tagWidths} = input
  const total = tagWidths.length

  if (total === 0) {
    return {overflowCount: 0, visibleCount: 0}
  }

  // Check if all tags fit without an indicator
  let totalWidth = 0
  for (let i = 0; i < total; i++) {
    if (i > 0) {
      totalWidth += gap
    }
    totalWidth += tagWidths[i]
  }

  if (totalWidth <= availableWidth) {
    return {overflowCount: 0, visibleCount: total}
  }

  // Tags overflow — reserve space for the indicator and input field
  const reservedSpace = indicatorWidth + gap + minInputWidth
  const remainingWidth = availableWidth - reservedSpace

  if (remainingWidth <= 0) {
    return {overflowCount: total, visibleCount: 0}
  }

  let usedWidth = 0
  let visibleCount = 0

  for (let i = 0; i < total; i++) {
    const nextWidth = i > 0 ? tagWidths[i] + gap : tagWidths[i]
    if (usedWidth + nextWidth > remainingWidth) {
      break
    }
    usedWidth += nextWidth
    visibleCount++
  }

  return {overflowCount: total - visibleCount, visibleCount}
}
