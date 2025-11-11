// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {highlightFirst} from "./highlight-first"
import {highlightMultiple} from "./highlight-multiple"
import type {HighlightChunk, HighlightWordProps} from "./types"

export function highlightWord(props: HighlightWordProps): HighlightChunk[] {
  if (props.matchAll == null) {
    props.matchAll = Array.isArray(props.query)
  }

  if (!props.matchAll && Array.isArray(props.query)) {
    throw new Error("matchAll must be true when using multiple queries")
  }

  return props.matchAll ? highlightMultiple(props) : highlightFirst(props)
}
