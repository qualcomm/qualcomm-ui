// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useMemo} from "react"

import {
  type HighlightChunk,
  highlightWord,
  type HighlightWordProps,
} from "@qualcomm-ui/utils/highlight-word"

export interface UseHighlightProps extends HighlightWordProps {}

export function useHighlight(props: UseHighlightProps): HighlightChunk[] {
  return useMemo(() => highlightWord(props), [props])
}

export type {HighlightChunk}
