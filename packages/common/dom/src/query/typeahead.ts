// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ItemToId} from "./query"
import {getByText, type SearchableItem} from "./searchable"

export interface TypeaheadState {
  keysSoFar: string
  timer: number
}

export interface TypeaheadOptions<T> {
  activeId: string | null
  itemToId?: ItemToId<T> | undefined
  key: string
  state: TypeaheadState
  timeout?: number | undefined
}

function getByTypeaheadImpl<T extends SearchableItem>(
  baseItems: T[],
  options: TypeaheadOptions<T>,
): T | undefined {
  const {activeId, itemToId, key, state, timeout = 350} = options

  const search = state.keysSoFar + key
  const isRepeated =
    search.length > 1 && Array.from(search).every((char) => char === search[0])

  const query = isRepeated ? search[0] : search

  const items = baseItems.slice()

  const next = getByText(items, query, activeId, itemToId)

  function cleanup() {
    clearTimeout(state.timer)
    state.timer = -1
  }

  function update(value: string) {
    state.keysSoFar = value
    cleanup()

    if (value !== "") {
      state.timer = +setTimeout(() => {
        update("")
        cleanup()
      }, timeout)
    }
  }

  update(search)

  return next
}

export const getByTypeahead: typeof getByTypeaheadImpl & {
  defaultOptions: {
    keysSoFar: string
    timer: number
  }
  isValidEvent: typeof isValidTypeaheadEvent
} = /* #__PURE__ */ Object.assign(getByTypeaheadImpl, {
  defaultOptions: {keysSoFar: "", timer: -1},
  isValidEvent: isValidTypeaheadEvent,
})

function isValidTypeaheadEvent(
  event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey">,
): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey
}
