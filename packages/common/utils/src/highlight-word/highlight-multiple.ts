// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {escapeRegex} from "./escape-regex"
import {normalizeSpan} from "./normalize-span"
import type {HighlightChunk, HighlightWordProps} from "./types"

function buildRegex(
  queryProp: string[],
  flags: string,
  exactMatch: boolean | undefined,
): RegExp {
  const query = queryProp.filter(Boolean).map((text) => escapeRegex(text))
  const pattern = exactMatch
    ? `\\b(${query.join("|")})\\b`
    : `(${query.join("|")})`

  return new RegExp(pattern, flags)
}

function getRegexFlags(
  ignoreCase: boolean | undefined,
  matchAll = true,
): string {
  return `${ignoreCase ? "i" : ""}${matchAll ? "g" : ""}`
}

export function highlightMultiple(props: HighlightWordProps): HighlightChunk[] {
  const {exactMatch, ignoreCase, matchAll, query, text} = props

  if (query.length === 0) {
    return [{match: false, text}]
  }

  const flags = getRegexFlags(ignoreCase, matchAll)
  const regex = buildRegex(
    Array.isArray(query) ? query : [query],
    flags,
    exactMatch,
  )

  const spans = [...text.matchAll(regex)].map((match) => ({
    end: (match.index || 0) + match[0].length,
    start: match.index || 0,
  }))

  return normalizeSpan(spans, props.text.length).map((chunk) => ({
    match: !!chunk.match,
    text: props.text.slice(chunk.start, chunk.end),
  }))
}
