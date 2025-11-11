// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback} from "react"

import Fuzzysort from "fuzzysort"

import {
  formatSearchResults,
  type PageSection,
  type SearchResult,
} from "@qualcomm-ui/mdx-common"

type UseSiteSearch = (input: string) => SearchResult[]

export function doSiteSearch(
  input: string,
  searchIndex: PageSection[],
): SearchResult[] {
  const allResults = formatSearchResults(
    Fuzzysort.go(input, searchIndex, {
      keys: ["title", "heading", "content"],
      limit: 50,
      threshold: 0.2,
    }),
  )

  const pageContentMap = new Map<string, SearchResult[]>()

  for (const result of allResults) {
    const basePath = result.href.split("#")[0]
    if (!pageContentMap.has(basePath)) {
      pageContentMap.set(basePath, [])
    }
    pageContentMap.get(basePath)!.push(result)
  }

  const filtered: SearchResult[] = []

  for (const [, pageResults] of pageContentMap) {
    const contentResults = pageResults.filter((r) => r.type === "content")
    const headingResults = pageResults.filter((r) => r.type !== "content")

    if (contentResults.length > 0) {
      filtered.push(...contentResults)
    } else {
      filtered.push(headingResults[0])
    }
  }

  return filtered
}

export function useSiteSearch(searchIndex: PageSection[]): UseSiteSearch {
  return useCallback(
    (input: string) => doSiteSearch(input, searchIndex),
    [searchIndex],
  )
}
