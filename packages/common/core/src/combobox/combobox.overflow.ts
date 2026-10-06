// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface CalculateVisibleTagsInput {
  availableWidth: number
  gap: number
  showAllButtonWidth: number
  tagWidths: number[]
}

export interface CalculateVisibleTagsResult {
  overflowCount: number
  visibleCount: number
  visibleIndices: number[]
}

/**
 * Determines which tags fit in the container by iterating in order
 * and skipping any tag that doesn't fit, so smaller tags after an
 * oversized one are still shown.
 *
 * Gap model: with CSS flex `gap`, K visible tags + indicator + input
 * = K+2 children and K+1 gaps. Base overhead accounts for 1 gap
 * (indicator-to-input); each tag adds its width + 1 gap.
 */
export function calculateVisibleTags(
  input: CalculateVisibleTagsInput,
): CalculateVisibleTagsResult {
  const {availableWidth, gap, showAllButtonWidth, tagWidths} = input
  const total = tagWidths.length
  // TODO: account for dropdown padding?

  if (total === 0) {
    return {overflowCount: 0, visibleCount: 0, visibleIndices: []}
  }

  // Check if all tags fit without an indicator.
  // Layout: [tag0] gap [tag1] ... [tagN-1] gap [input]
  // = sum(tagWidths) + total * gap + minInputWidth
  let allTagsWidth = 0
  for (let i = 0; i < total; i++) {
    allTagsWidth += tagWidths[i]
  }
  const allFitWidth = allTagsWidth + total * gap + showAllButtonWidth

  if (allFitWidth <= availableWidth) {
    return {
      overflowCount: 0,
      visibleCount: total,
      visibleIndices: Array.from({length: total}, (_, i) => i),
    }
  }

  // Overflow — iterate in order, skipping tags that don't fit.
  // Base overhead: showAllButtonWidth + gap (indicator-to-input) + minInputWidth
  // Each tag costs: tagWidth + gap
  const baseOverhead = showAllButtonWidth + gap
  const remaining = availableWidth - baseOverhead

  if (remaining <= 0) {
    return {overflowCount: total, visibleCount: 0, visibleIndices: []}
  }

  const visibleIndices: number[] = []
  let usedWidth = 0

  for (let i = 0; i < total; i++) {
    const cost = tagWidths[i] + gap
    if (usedWidth + cost <= remaining) {
      usedWidth += cost
      visibleIndices.push(i)
    }
  }

  return {
    overflowCount: total - visibleIndices.length,
    visibleCount: visibleIndices.length,
    visibleIndices,
  }
}
