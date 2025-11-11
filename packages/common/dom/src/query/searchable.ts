// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defaultItemToId, indexOfId, type ItemToId} from "./query"
import {sanitize, wrap} from "./shared"

function getValueText<T extends SearchableItem>(el: T): string {
  return sanitize(el.dataset?.valuetext ?? el.textContent ?? "")
}

function match(valueText: string, query: string): boolean {
  return valueText.trim().toLowerCase().startsWith(query.toLowerCase())
}

export interface SearchableItem {
  dataset?: any
  id: string
  textContent: string | null
}

export function getByText<T extends SearchableItem>(
  v: T[],
  text: string,
  currentId?: string | null,
  itemToId: ItemToId<T> = defaultItemToId,
): T | undefined {
  const index = currentId ? indexOfId(v, currentId, itemToId) : -1
  let items = currentId ? wrap(v, index) : v
  const isSingleKey = text.length === 1
  if (isSingleKey) {
    items = items.filter((item) => itemToId(item) !== currentId)
  }
  return items.find((item) => match(getValueText(item), text))
}
