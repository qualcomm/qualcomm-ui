// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MouseEvent} from "react"

import {afterEach, describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import type {SemanticSearchResult} from "@qualcomm-ui/mdx-common"

import {MdxDocsProvider} from "../context/use-mdx-docs-context.js"

import {
  SemanticSiteSearch,
  type SemanticSiteSearchProps,
} from "./semantic-site-search.js"

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("SemanticSiteSearch", () => {
  test("debounces queries and ignores a stale aborted response", async () => {
    let resolveFirstResponse: (response: Response) => void
    const firstResponse = new Promise<Response>((resolve) => {
      resolveFirstResponse = resolve
    })
    const fetch = vi.fn(() =>
      fetch.mock.calls.length === 1
        ? firstResponse
        : Promise.resolve(searchResponse([currentResult])),
    )
    vi.stubGlobal("fetch", fetch)

    const input = await renderSearch()
    await input.fill("routing")

    expect(fetch).not.toHaveBeenCalled()
    await expect.poll(() => fetch).toHaveBeenCalledOnce()
    const firstRequest = fetch.mock.calls[0]?.[1] as RequestInit

    await input.fill("routing configuration")

    expect(firstRequest.signal?.aborted).toBe(true)
    await expect.poll(() => fetch).toHaveBeenCalledTimes(2)
    await expect.element(page.getByText(currentResult.heading)).toBeVisible()

    resolveFirstResponse!(searchResponse([staleResult]))
    await new Promise((resolve) => setTimeout(resolve, 0))

    await expect
      .element(page.getByText(staleResult.heading))
      .not.toBeInTheDocument()
  })

  test("renders a flat result list and navigates through the supplied link", async () => {
    const onNavigate = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(searchResponse([currentResult, secondResult])),
      ),
    )

    const input = await renderSearch({onNavigate})
    await input.fill("routing")

    const result = page.getByRole("link", {name: /routing configuration/i})
    await expect.element(result).toBeVisible()
    await expect.poll(() => page.getByRole("link").length).toBe(2)
    expect(
      document.querySelectorAll(".qui-site-search__result-group-wrapper"),
    ).toHaveLength(0)

    await result.click()

    expect(onNavigate).toHaveBeenCalledWith("/routing#configuration")
  })

  test("renders the empty and unavailable states", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(searchResponse([]))
      .mockRejectedValueOnce(new Error("server unavailable"))
    vi.stubGlobal("fetch", fetch)

    const input = await renderSearch()
    await input.fill("routing")
    await expect.element(page.getByText("No results found...")).toBeVisible()

    await input.fill("routing unavailable")
    await expect.element(page.getByText("Search is unavailable.")).toBeVisible()
  })
})

const currentResult: SemanticSearchResult = {
  excerpt: "Configure routing for the docs site.",
  heading: "Routing configuration",
  highlights: [{end: 9, start: 0}],
  href: "/routing#configuration",
  sectionId: "routing-configuration",
  title: "Routing",
}

const secondResult: SemanticSearchResult = {
  excerpt: "Create routes with local links.",
  heading: "Nested pages",
  href: "/pages#nested-pages",
  sectionId: "nested-pages",
  title: "Pages",
}

const staleResult: SemanticSearchResult = {
  excerpt: "A stale result must not replace the current query.",
  heading: "Stale routing result",
  href: "/routing#stale",
  sectionId: "stale-routing",
  title: "Routing",
}

async function renderSearch({
  onNavigate,
  ...props
}: SemanticSiteSearchProps & {onNavigate?: (href: string) => void} = {}) {
  await render(
    <MdxDocsProvider
      value={{
        demoState: {},
        renderLink: ({href, onClick, ...linkProps}) => (
          <a
            {...linkProps}
            href={href}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              onClick?.(event)
              event.preventDefault()
              onNavigate?.(href)
            }}
          />
        ),
        updateDemoState: () => {},
      }}
    >
      <SemanticSiteSearch {...props} />
    </MdxDocsProvider>,
  )

  await page.getByRole("searchbox", {name: "Search the documentation"}).click()
  const input = page.getByRole("textbox", {name: "Search the docs"}).last()
  await expect.element(input).toBeVisible()

  return input
}

function searchResponse(results: SemanticSearchResult[]): Response {
  return new Response(JSON.stringify({results}), {
    headers: {"Content-Type": "application/json"},
  })
}
