// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ListCollection} from "@qualcomm-ui/utils/collection"

/**
 * Labels the selected values from the collection, falling back to the
 * selected items for values the collection no longer contains (for example,
 * after a server-side search narrowed it).
 */
export function getSelectedLabels(
  collection: ListCollection<any>,
  values: string[],
  items: unknown[],
): Record<string, string> {
  const labels: Record<string, string> = {}
  for (const item of items) {
    const value = collection.getItemValue(item)
    const label = collection.stringifyItem(item)
    if (value !== null && label !== null) {
      labels[value] = label
    }
  }
  for (const value of values) {
    const label = collection.stringify(value)
    if (label !== null) {
      labels[value] = label
    }
  }
  return labels
}
