// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useMemo} from "react"

import {useSiteContext} from "@qualcomm-ui/mdx-docs/context"
import type {SearchResult} from "@qualcomm-ui/mdx-docs-common"

import {useSiteSearch} from "./use-site-search"

export interface GroupedSearchResult {
  categoryId: string
  id: string
  index: number
  items: SearchResult[]
  pathname: string
  title: string
}

export function useGroupedResults(query: string): GroupedSearchResult[] {
  const {searchIndex} = useSiteContext()
  const search = useSiteSearch(searchIndex)

  return useMemo(() => {
    if (!query.trim()) {
      return []
    }

    const results = search(query)
    const groups = new Map<string, SearchResult[]>()
    const groupOrder: string[] = []

    for (const result of results) {
      const basePath = result.href.split("#")[0]
      const key = `${basePath}::${result.title}`

      if (!groups.has(key)) {
        groups.set(key, [])
        groupOrder.push(key)
      }
      groups.get(key)!.push(result)
    }

    let currentIndex = 0
    const grouped: GroupedSearchResult[] = []

    for (const key of groupOrder) {
      const items = groups.get(key)!
      const firstItem = items[0]
      const basePath = firstItem.href.split("#")[0]
      const categoryId = firstItem.categories[0] || "Other"

      grouped.push({
        categoryId,
        id: `${basePath}-${firstItem.title}`,
        index: currentIndex++,
        items: items.map((item) => ({
          ...item,
          index: currentIndex++,
        })),
        pathname: basePath,
        title: firstItem.title,
      })
    }

    return grouped
  }, [query, search])
}
