// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getOpenApiNavItems} from "../open-api/get-nav-items.js"
import type {OpenApiOperation} from "../open-api/get-operations.js"

const intro = {pathname: "/api", title: "Pet Store API"}

function operation(
  slug: string,
  tags: string[],
  summary?: string,
): OpenApiOperation {
  return {method: "get", path: `/${slug}`, slug, summary, tags}
}

describe("getOpenApiNavItems", () => {
  test("starts with the intro page, then untagged operations", () => {
    const items = getOpenApiNavItems(intro, [operation("getMe", [], "Me")])
    expect(items.map((item) => [item.title, item.pathname])).toEqual([
      ["Pet Store API", "/api"],
      ["Me", "/api/getMe"],
    ])
  })

  test("adds a section per tag, declared tags first", () => {
    const items = getOpenApiNavItems(
      intro,
      [operation("getUser", ["user"]), operation("getPet", ["pet"])],
      [{name: "pet", "x-displayName": "Pets"}],
    )
    expect(items.map((item) => item.sectionTitle ?? item.pathname)).toEqual([
      "/api",
      "Pets",
      "/api/getPet",
      "user",
      "/api/getUser",
    ])
  })

  test("lists a multi-tag operation under each tag with unique ids", () => {
    const items = getOpenApiNavItems(intro, [operation("getPet", ["a", "b"])])
    const leaves = items.filter((item) => item.pathname === "/api/getPet")
    expect(leaves.map((item) => item.id)).toEqual(["a/getPet", "b/getPet"])
  })

  test("falls back to method and path without a summary", () => {
    const [, item] = getOpenApiNavItems(intro, [operation("pets", [])])
    expect(item.title).toBe("GET /pets")
  })

  test("adds the HTTP method as a badge", () => {
    const [, item] = getOpenApiNavItems(intro, [operation("pets", [])])
    expect(item.badges).toEqual([{id: "get", label: "GET"}])
  })
})
