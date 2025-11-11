// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {levenshteinDistance} from "@qualcomm-ui/utils/search"

import {i18nCache} from "./cache"

export interface FilterReturn {
  /**
   * Checks if string contains substring using locale-aware exact matching
   */
  contains(string: string, substring: string): boolean

  /**
   * Checks if string ends with substring using locale-aware exact matching
   */
  endsWith(string: string, substring: string): boolean

  /**
   * Checks if string contains substring within Levenshtein distance threshold
   */
  fuzzyContains(string: string, substring: string): boolean

  /**
   * Checks if string starts with substring using locale-aware exact matching
   */
  startsWith(string: string, substring: string): boolean
}

export interface FilterOptions extends Intl.CollatorOptions {
  /**
   * The number of single-character edits (insertions, deletions, substitutions)
   * tolerated for a match.
   *
   * Examples with fuzzyThreshold: 2:
   *
   * "hello" → "helo" (1 deletion) ✓
   * "hello" → "hallo" (1 substitution) ✓
   * "hello" → "helo" → "hlo" (2 deletions) ✓
   * "hello" → "xyz" (5 substitutions) ✗
   */
  fuzzyThreshold?: number
  locale?: string | undefined
}

const collatorCache = i18nCache(Intl.Collator)

export function createFilter(options?: FilterOptions): FilterReturn {
  const {fuzzyThreshold = 2, locale, ...rest} = options || {}
  const collator = collatorCache(locale || "en-US", {usage: "search", ...rest})

  function normalize(string: string) {
    string = string.normalize("NFC")
    if (collator.resolvedOptions().ignorePunctuation) {
      string = string.replace(/\p{P}/gu, "")
    }
    return string
  }

  function startsWith(string: string, substring: string) {
    if (substring.length === 0) {
      return true
    }
    string = normalize(string)
    substring = normalize(substring)
    return collator.compare(string.slice(0, substring.length), substring) === 0
  }

  function endsWith(string: string, substring: string) {
    if (substring.length === 0) {
      return true
    }
    string = normalize(string)
    substring = normalize(substring)
    return collator.compare(string.slice(-substring.length), substring) === 0
  }

  function contains(string: string, substring: string) {
    if (substring.length === 0) {
      return true
    }
    string = normalize(string)
    substring = normalize(substring)
    let scan = 0
    const sliceLen = substring.length
    for (; scan + sliceLen <= string.length; scan++) {
      const slice = string.slice(scan, scan + sliceLen)
      if (collator.compare(substring, slice) === 0) {
        return true
      }
    }
    return false
  }

  function fuzzyContains(string: string, substring: string): boolean {
    if (substring.length === 0) {
      return true
    }
    string = normalize(string)
    substring = normalize(substring)

    const textWindowSize = substring.length + fuzzyThreshold
    for (
      let i = 0;
      i <= string.length - substring.length + fuzzyThreshold;
      i++
    ) {
      const textWindow = string.slice(i, i + textWindowSize)
      if (levenshteinDistance(textWindow, substring) <= fuzzyThreshold) {
        return true
      }
    }
    return false
  }

  return {
    contains,
    endsWith,
    fuzzyContains,
    startsWith,
  }
}
