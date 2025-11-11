// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {escapeRegex} from "./escape-regex"
import {normalizeSpan} from "./normalize-span"
import type {HighlightChunk, HighlightWordProps} from "./types"

export function highlightFirst(props: HighlightWordProps): HighlightChunk[] {
  const {exactMatch, ignoreCase, query, text} = props

  if (exactMatch) {
    const escapedQuery = escapeRegex(query as string)
    const regex = new RegExp(`\\b(${escapedQuery})\\b`, ignoreCase ? "i" : "")

    const match = text.match(regex)
    if (!match || match.index === undefined) {
      return [{match: false, text}]
    }

    const start = match.index
    const end = start + match[0].length
    const spans = [{end, start}]

    return normalizeSpan(spans, text.length).map((chunk) => ({
      match: !!chunk.match,
      text: text.slice(chunk.start, chunk.end),
    }))
  }

  const searchText = ignoreCase ? text.toLowerCase() : text
  const searchQuery = ignoreCase
    ? typeof query === "string"
      ? query.toLowerCase()
      : query
    : query

  const start =
    typeof searchText === "string"
      ? searchText.indexOf(searchQuery as string)
      : -1

  if (start === -1) {
    return [{match: false, text}]
  }

  const end = start + (searchQuery as string).length
  const spans = [{end, start}]

  return normalizeSpan(spans, text.length).map((chunk) => ({
    match: !!chunk.match,
    text: text.slice(chunk.start, chunk.end),
  }))
}
