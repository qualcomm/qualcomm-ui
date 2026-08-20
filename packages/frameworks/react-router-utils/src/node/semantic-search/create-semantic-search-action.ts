// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  SemanticSearchInvalidRequestError,
  SemanticSearchRequest,
  SemanticSearchResponse,
  SemanticSearchUnavailableError,
} from "@qualcomm-ui/mdx-common"
import type {ActionFunction} from "react-router"

const defaultLimit = 10
const maximumLimit = 20
const maximumQueryLength = 512
const minimumQueryLength = 2
const noStoreHeaders = {"Cache-Control": "no-store"}

export interface SemanticSearchActionService {
  search(query: string, limit: number): Promise<SemanticSearchResponse>
}

/**
 * Lazily resolves the server-local search service for the current docs site.
 *
 * Each docs site provides its own resolver so its action uses that site's
 * artifact and model cache without loading either in the route module.
 */
export type GetSemanticSearchActionService = () => Promise<SemanticSearchActionService>

/**
 * Creates a React Router action for a server-local semantic search endpoint.
 *
 * The returned action validates the JSON request body before initializing the
 * supplied service. This lets multiple docs sites share the endpoint behavior
 * while supplying independent artifacts and lazy service initialization.
 */
export function createSemanticSearchAction(
  getSearchService: GetSemanticSearchActionService,
): ActionFunction {
  return async ({request}): Promise<Response> => {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return Response.json(
        {
          error: "invalid_request",
          message: "Search requests must contain valid JSON.",
        },
        {headers: noStoreHeaders, status: 400},
      )
    }

    const validation = validateSemanticSearchRequest(body)
    if (!validation.ok) {
      return Response.json(validation.error, {
        headers: noStoreHeaders,
        status: 400,
      })
    }

    try {
      const service = await getSearchService()
      const result = await service.search(
        validation.value.query,
        validation.value.limit,
      )

      return Response.json(result, {headers: noStoreHeaders})
    } catch {
      const response: SemanticSearchUnavailableError = {
        error: "search_unavailable",
        message: "Semantic search is unavailable.",
      }

      return Response.json(response, {headers: noStoreHeaders, status: 503})
    }
  }
}

interface ValidSemanticSearchRequest {
  limit: number
  query: string
}

type SemanticSearchRequestValidation =
  | {error: SemanticSearchInvalidRequestError; ok: false}
  | {ok: true; value: ValidSemanticSearchRequest}

function validateSemanticSearchRequest(
  value: unknown,
): SemanticSearchRequestValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return invalidRequest("Search requests must be a JSON object.")
  }

  const {limit, query} = value as Partial<SemanticSearchRequest>
  if (typeof query !== "string") {
    return invalidRequest("Search query must be a string.")
  }

  const trimmedQuery = query.trim()
  if (
    trimmedQuery.length < minimumQueryLength ||
    trimmedQuery.length > maximumQueryLength
  ) {
    return invalidRequest(
      `Search query must contain ${minimumQueryLength}-${maximumQueryLength} characters.`,
    )
  }

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    return invalidRequest("Search limit must be a positive integer.")
  }

  return {
    ok: true,
    value: {
      limit: Math.min(limit ?? defaultLimit, maximumLimit),
      query: trimmedQuery,
    },
  }
}

function invalidRequest(message: string): SemanticSearchRequestValidation {
  return {error: {error: "invalid_request", message}, ok: false}
}
