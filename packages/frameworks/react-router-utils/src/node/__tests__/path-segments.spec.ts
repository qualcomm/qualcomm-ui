// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {
  convertParam,
  createRoutingStrategy,
  getPathSegments,
  normalizeSlashes,
  stripExtension,
} from "../path-segments"

describe("getPathSegments", () => {
  test("returns segments for simple route", () => {
    expect(getPathSegments("routes/about.tsx")).toEqual(["about"])
  })

  test("returns segments for nested route", () => {
    expect(getPathSegments("routes/posts/recent.tsx")).toEqual([
      "posts",
      "recent",
    ])
  })

  test("handles index files", () => {
    expect(getPathSegments("routes/index.tsx")).toEqual([])
    expect(getPathSegments("routes/posts/index.tsx")).toEqual(["posts"])
  })

  test("handles route.tsx files", () => {
    expect(getPathSegments("routes/account/route.tsx")).toEqual(["account"])
  })

  test("handles _folder.tsx pattern", () => {
    expect(getPathSegments("routes/about/_about.tsx")).toEqual(["about"])
  })

  test("handles dynamic params", () => {
    expect(getPathSegments("routes/posts/$postId.tsx")).toEqual([
      "posts",
      ":postId",
    ])
  })

  test("handles splat routes", () => {
    expect(getPathSegments("routes/files/$.tsx")).toEqual(["files", "*"])
  })

  test("handles pathless layouts", () => {
    expect(getPathSegments("routes/_auth/login.tsx")).toEqual(["login"])
    expect(getPathSegments("routes/_layout/page.tsx")).toEqual(["page"])
  })

  test("handles layout escaping", () => {
    expect(getPathSegments("routes/posts_/$postId/edit.tsx")).toEqual([
      "posts",
      ":postId",
      "edit",
    ])
  })

  test("handles optional segments", () => {
    expect(getPathSegments("routes/docs/(lang).tsx")).toEqual(["docs", "lang?"])
  })

  test("handles optional params", () => {
    expect(getPathSegments("routes/users/($userId).tsx")).toEqual([
      "users",
      ":userId?",
    ])
  })

  test("skips __root files", () => {
    expect(getPathSegments("routes/__root.tsx")).toEqual([])
  })

  test("handles deeply nested routes", () => {
    expect(getPathSegments("routes/a/b/c/d.tsx")).toEqual(["a", "b", "c", "d"])
  })

  test("handles files without routes prefix", () => {
    expect(getPathSegments("about.tsx")).toEqual(["about"])
    expect(getPathSegments("posts/$postId.tsx")).toEqual(["posts", ":postId"])
  })
})

describe("createRoutingStrategy", () => {
  test("creates strategy with default routes dir", () => {
    const strategy = createRoutingStrategy()
    expect(strategy("routes/about.tsx")).toEqual(["about"])
  })

  test("creates strategy with custom routes dir", () => {
    const strategy = createRoutingStrategy({routeDir: "pages"})
    expect(strategy("pages/about.tsx")).toEqual(["about"])
    expect(strategy("src/pages/about.tsx")).toEqual(["about"])
  })

  test("handles nested paths with custom routes dir", () => {
    const strategy = createRoutingStrategy({routeDir: "views"})
    expect(strategy("app/views/posts/$postId.tsx")).toEqual([
      "posts",
      ":postId",
    ])
  })
})

describe("convertParam", () => {
  test("converts splat", () => {
    expect(convertParam("$")).toBe("*")
  })

  test("converts named param", () => {
    expect(convertParam("$postId")).toBe(":postId")
  })

  test("converts optional param", () => {
    expect(convertParam("($userId)")).toBe(":userId?")
  })

  test("converts optional segment", () => {
    expect(convertParam("(lang)")).toBe("lang?")
  })

  test("returns regular segments unchanged", () => {
    expect(convertParam("about")).toBe("about")
  })
})

describe("normalizeSlashes", () => {
  test("normalizes forward slashes", () => {
    expect(normalizeSlashes("a/b/c")).toBe("a/b/c")
  })
})

describe("stripExtension", () => {
  test("strips .tsx extension", () => {
    expect(stripExtension("file.tsx")).toBe("file")
  })

  test("strips .ts extension", () => {
    expect(stripExtension("file.ts")).toBe("file")
  })

  test("strips .mdx extension", () => {
    expect(stripExtension("file.mdx")).toBe("file")
  })

  test("handles paths with multiple dots", () => {
    expect(stripExtension("file.spec.ts")).toBe("file.spec")
  })
})
