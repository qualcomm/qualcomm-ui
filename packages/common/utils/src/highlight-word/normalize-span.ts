// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HighlightSpan} from "./types"

export function normalizeSpan(
  spans: HighlightSpan[],
  len: number,
): HighlightSpan[] {
  const result: HighlightSpan[] = []
  const append = (start: number, end: number, match: boolean) => {
    if (end - start > 0) {
      result.push({end, match, start})
    }
  }

  if (spans.length === 0) {
    append(0, len, false)
  } else {
    let lastIndex = 0
    for (const chunk of spans) {
      append(lastIndex, chunk.start, false)
      append(chunk.start, chunk.end, true)
      lastIndex = chunk.end
    }

    append(lastIndex, len, false)
  }

  return result
}
