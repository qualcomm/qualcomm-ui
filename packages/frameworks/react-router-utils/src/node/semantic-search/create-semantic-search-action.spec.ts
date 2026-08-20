// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ActionFunction, ActionFunctionArgs} from "react-router"
import {describe, expect, test, vi} from "vitest"

import {
  createSemanticSearchAction,
  type SemanticSearchActionService,
} from "./create-semantic-search-action.js"

describe("createSemanticSearchAction", () => {
  test("validates and normalizes a request before searching", async () => {
    const search = vi.fn().mockResolvedValue({results: []})
    const service: SemanticSearchActionService = {search}
    const getSearchService = vi.fn(async () => service)
    const action = createSemanticSearchAction(getSearchService)

    const response = await callAction(action, {limit: 50, query: "  button  "})

    expect(response.status).toBe(200)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(getSearchService).toHaveBeenCalledOnce()
    expect(search).toHaveBeenCalledWith("button", 20)
    await expect(response.json()).resolves.toEqual({results: []})
  })

  test("rejects malformed JSON without initializing the service", async () => {
    const getSearchService = vi.fn()
    const action = createSemanticSearchAction(getSearchService)
    const request = new Request("http://localhost/api/search", {
      body: "{",
      headers: {"Content-Type": "application/json"},
      method: "POST",
    })

    const response = await callAction(action, request)

    expect(response.status).toBe(400)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(getSearchService).not.toHaveBeenCalled()
    await expect(response.json()).resolves.toEqual({
      error: "invalid_request",
      message: "Search requests must contain valid JSON.",
    })
  })

  test("returns search_unavailable when the service cannot initialize", async () => {
    const action = createSemanticSearchAction(async () => {
      throw new Error("missing artifact")
    })

    const response = await callAction(action, {query: "button"})

    expect(response.status).toBe(503)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    await expect(response.json()).resolves.toEqual({
      error: "search_unavailable",
      message: "Semantic search is unavailable.",
    })
  })
})

async function callAction(
  action: ActionFunction,
  body: Request | Record<string, unknown>,
): Promise<Response> {
  const request =
    body instanceof Request
      ? body
      : new Request("http://localhost/api/search", {
          body: JSON.stringify(body),
          headers: {"Content-Type": "application/json"},
          method: "POST",
        })
  const result = await action({request} as ActionFunctionArgs)

  if (!(result instanceof Response)) {
    throw new Error("Semantic search action did not return a Response.")
  }

  return result
}
