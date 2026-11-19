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

  test("adds a collapsible section per tag, declared tags first", () => {
    const items = getOpenApiNavItems(
      intro,
      [operation("getUser", ["user"]), operation("getPet", ["pet"])],
      [{name: "pet", "x-displayName": "Pets"}],
    )
    expect(
      items.map((item) => [
        item.title,
        item.pathname,
        item.items?.map((child) => child.pathname),
      ]),
    ).toEqual([
      ["Pet Store API", "/api", undefined],
      ["Pets", undefined, ["/api/getPet"]],
      ["user", undefined, ["/api/getUser"]],
    ])
  })

  test("nests tagged operations one level down", () => {
    const [, section] = getOpenApiNavItems(intro, [
      operation("getPet", ["pet"]),
    ])
    expect(section.depth).toBe(1)
    expect(section.items?.map((item) => item.depth)).toEqual([2])
  })

  test("collapses the sections unless expanded is set", () => {
    const operations = [operation("getPet", ["pet"])]
    expect(getOpenApiNavItems(intro, operations)[1].expanded).toBe(false)
    expect(
      getOpenApiNavItems(intro, operations, [], {expanded: true})[1].expanded,
    ).toBe(true)
  })

  test("lists a multi-tag operation under each tag with unique ids", () => {
    const items = getOpenApiNavItems(intro, [operation("getPet", ["a", "b"])])
    const leaves = items.flatMap((item) => item.items ?? [])
    expect(leaves.map((item) => [item.id, item.pathname])).toEqual([
      ["a/getPet", "/api/getPet"],
      ["b/getPet", "/api/getPet"],
    ])
  })

  test("falls back to the path without a summary", () => {
    const [, item] = getOpenApiNavItems(intro, [operation("pets", [])])
    expect(item.title).toBe("/pets")
  })

  test("carries the HTTP method", () => {
    const [, item] = getOpenApiNavItems(intro, [operation("pets", [])])
    expect(item.method).toBe("get")
  })
})
