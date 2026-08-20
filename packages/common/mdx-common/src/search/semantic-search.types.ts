// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * JSON request body accepted by a semantic documentation search endpoint.
 */
export interface SemanticSearchRequest {
  /** Search text supplied by the reader. */
  query: string

  /** Maximum number of ranked sections to return. */
  limit?: number
}

/**
 * A half-open character range in a result excerpt.
 */
export interface SemanticSearchHighlight {
  /** Zero-based start offset in the excerpt. */
  start: number

  /** Exclusive end offset in the excerpt. */
  end: number
}

/**
 * A navigable documentation section returned by semantic search.
 */
export interface SemanticSearchResult {
  /** Local route and optional section fragment. */
  href: string

  /** Excerpt-relative ranges matching the query, when available. */
  highlights?: SemanticSearchHighlight[]

  /** Section heading. */
  heading: string

  /** Plain-text excerpt from the matching section. */
  excerpt: string

  /** Stable identifier from the knowledge section export. */
  sectionId: string

  /** Documentation page title. */
  title: string
}

/**
 * JSON response returned for a successful semantic documentation search.
 */
export interface SemanticSearchResponse {
  results: SemanticSearchResult[]
}

/**
 * JSON response returned when a semantic search request is invalid.
 */
export interface SemanticSearchInvalidRequestError {
  error: "invalid_request"
  message: string
}

/**
 * JSON response returned when the server-local search index is unavailable.
 */
export interface SemanticSearchUnavailableError {
  error: "search_unavailable"
  message: string
}

/**
 * JSON error response returned by a semantic documentation search endpoint.
 */
export type SemanticSearchErrorResponse =
  | SemanticSearchInvalidRequestError
  | SemanticSearchUnavailableError
