// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PageSection} from "../docs-plugin.types"

export interface FormattedContent {
  content: string
  highlight?: boolean
}

export interface SearchResultFields
  extends Pick<
    PageSection,
    "heading" | "title" | "categories" | "id" | "isDocProp"
  > {
  content?: FormattedContent[]
  headingLevel?: number
  href: string
}

export type SearchResultType = "heading" | "title" | "content"

export interface SearchResult extends SearchResultFields {
  fragment?: string
  index: number
  score: number
  type: SearchResultType
}

export interface GroupedSearchResult<ResultType = SearchResult> {
  categoryId: string
  fragment?: string
  id: string
  index: number
  items: ResultType[]
  pathname: string
  title: string
}
