// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PageSection} from "../docs-plugin.types.js"

export interface FormattedContent {
  content: string
  highlight?: boolean
}

export interface SearchResultFields extends Pick<
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

/**
 * Documentation section returned by semantic search.
 */
export interface SemanticSearchResult {
  /**
   * Raw markdown for the matched documentation section.
   */
  content: string

  /**
   * ISO timestamp for when the section was created.
   */
  createdAt: string

  /**
   * URL hash that links directly to the section.
   */
  hash: string

  /**
   * Breadcrumb path of headings leading to this section.
   */
  headerPath: string[]

  /**
   * Stable section identifier.
   */
  id: string

  /**
   * URL pathname for the page that contains the section.
   */
  pathname: string

  /**
   * Display title for the matched section.
   */
  title: string

  /**
   * ISO timestamp for when the section was last updated.
   */
  updatedAt: string
}
