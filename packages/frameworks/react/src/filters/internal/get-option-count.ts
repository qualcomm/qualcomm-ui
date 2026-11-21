// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterSetOptionCounts} from "@qualcomm-ui/core/filter-set"

/**
 * Returns an option's result count, or `undefined` when the filter has no
 * counts. Options missing from the counts count 0. Own-property lookups keep
 * values such as `constructor` from matching inherited properties.
 */
export function getOptionCount(
  counts: FilterSetOptionCounts | undefined,
  value: string,
): number | undefined {
  if (!counts) {
    return undefined
  }
  return Object.hasOwn(counts, value) ? counts[value] : 0
}
