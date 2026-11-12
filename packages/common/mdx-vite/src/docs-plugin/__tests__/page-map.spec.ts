// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {
  filterFileGlob,
  getFolderPathSegments,
  getPathSegmentsFromFileName,
} from "../nav-builder/page-map"

describe("getPathSegmentsFromFileName", () => {
  describe("default (plus) strategy", () => {
    test("flattens +/ folders into nested URL segments", () => {
      const segments = getPathSegmentsFromFileName(
        "src/routes/components+/button+/_button.mdx",
        "routes",
      )
      expect(segments).toEqual(["components", "button"])
    })

    test("treats plain folder + file as a flat-folder route", () => {
      const segments = getPathSegmentsFromFileName(
        "src/routes/guide/page.mdx",
        "routes",
      )
      expect(segments).toEqual(["guide"])
    })

    test("treats _index as the index route segment", () => {
      const segments = getPathSegmentsFromFileName(
        "src/routes/_index.mdx",
        "routes",
      )
      expect(segments).toEqual([])
    })
  })

  describe("react-router-directory-groups strategy", () => {
    test("flattens plain folders into nested URL segments", () => {
      const segments = getPathSegmentsFromFileName(
        "src/routes/guide/page.mdx",
        "routes",
        "react-router-directory-groups",
      )
      expect(segments).toEqual(["guide", "page"])
    })

    test("flattens + folders the same way as plain folders", () => {
      const plus = getPathSegmentsFromFileName(
        "src/routes/components+/button+/_button.mdx",
        "routes",
        "react-router-directory-groups",
      )
      const plain = getPathSegmentsFromFileName(
        "src/routes/components/button/_button.mdx",
        "routes",
        "react-router-directory-groups",
      )
      expect(plus).toEqual(plain)
    })

    test("excludes files inside private (_) folders entirely", () => {
      const segments = getPathSegmentsFromFileName(
        "src/routes/components/button/_demos/click-me.mdx",
        "routes",
        "react-router-directory-groups",
      )
      expect(segments).toEqual([])
    })

    test("preserves underscore-prefixed filenames as pathless segments", () => {
      const segments = getPathSegmentsFromFileName(
        "src/routes/components/button/_button.mdx",
        "routes",
        "react-router-directory-groups",
      )
      expect(segments).toEqual(["components", "button"])
    })
  })

  test("explicit function strategy takes precedence over routing modes", () => {
    const segments = getPathSegmentsFromFileName(
      "src/routes/anything.mdx",
      "routes",
      () => ["custom", "segments"],
    )
    expect(segments).toEqual(["custom", "segments"])
  })
})

describe("filterFileGlob", () => {
  test("default strategy: keeps all matching files including _folder children", () => {
    const files = [
      "/src/routes/guide/page.mdx",
      "/src/routes/components/button/_demos/click.mdx",
      "/src/routes/$id.mdx",
    ]
    const result = filterFileGlob(files, ".mdx", "/src/routes")
    expect(result).toEqual([
      "/src/routes/guide/page.mdx",
      "/src/routes/components/button/_demos/click.mdx",
    ])
  })

  test("react-router-directory-groups strategy: drops files inside _folders", () => {
    const files = [
      "/src/routes/guide/page.mdx",
      "/src/routes/components/button/_demos/click.mdx",
      "/src/routes/components/button/_button.mdx",
    ]
    const result = filterFileGlob(
      files,
      ".mdx",
      "/src/routes",
      "react-router-directory-groups",
    )
    expect(result).toEqual([
      "/src/routes/guide/page.mdx",
      "/src/routes/components/button/_button.mdx",
    ])
  })
})

describe("getFolderPathSegments", () => {
  const srcDir = "/app/src"

  test("default strategy: resolves nested + folders", () => {
    expect(
      getFolderPathSegments(
        "/app/src/routes/components+/button+",
        srcDir,
        "routes",
      ),
    ).toEqual(["components", "button"])
  })

  test("default strategy: resolves a plain folder as a single route", () => {
    expect(
      getFolderPathSegments("/app/src/routes/guide", srcDir, "routes"),
    ).toEqual(["guide"])
  })

  test("default strategy: excludes dynamic route folders", () => {
    expect(
      getFolderPathSegments("/app/src/routes/blog+/$slug+", srcDir, "routes"),
    ).toBeUndefined()
  })

  test("react-router-directory-groups strategy: resolves nested plain folders", () => {
    expect(
      getFolderPathSegments(
        "/app/src/routes/guide/advanced",
        srcDir,
        "routes",
        "react-router-directory-groups",
      ),
    ).toEqual(["guide", "advanced"])
  })

  test("react-router-directory-groups strategy: excludes private folders", () => {
    expect(
      getFolderPathSegments(
        "/app/src/routes/guide/_demos",
        srcDir,
        "routes",
        "react-router-directory-groups",
      ),
    ).toBeUndefined()
  })

  test("vite-generouted strategy: drops group folders", () => {
    expect(
      getFolderPathSegments(
        "/app/src/routes/(auth)/docs",
        srcDir,
        "routes",
        "vite-generouted",
      ),
    ).toEqual(["docs"])
  })

  test("vite-generouted strategy: excludes + folders", () => {
    expect(
      getFolderPathSegments(
        "/app/src/routes/+private",
        srcDir,
        "routes",
        "vite-generouted",
      ),
    ).toBeUndefined()
  })

  test("resolves the page directory to the root route", () => {
    expect(getFolderPathSegments("/app/src/routes", srcDir, "routes")).toEqual(
      [],
    )
  })

  test("passes the synthetic index page to a custom strategy", () => {
    const strategy = (filePath: string) => [filePath]
    expect(
      getFolderPathSegments("/app/src/routes/docs", srcDir, "routes", strategy),
    ).toEqual(["docs/index.mdx"])
  })
})
