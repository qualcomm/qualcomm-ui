// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Link} from "mdast"
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import {unified} from "unified"
import {visit} from "unist-util-visit"
import {afterEach, describe, expect, test, vi} from "vitest"

import type {SearchIndexerOptions} from "../config"
import {
  isMdxFileLink,
  rehypeMdxFileLinks,
  remarkMdxFileLinks,
  resolveMdxFileLink,
} from "../mdx-file-links"
import {SearchIndexer} from "../search-indexer"

const routesDir = "/site/src/routes"
const options = {routesDir}

describe("isMdxFileLink", () => {
  test.each([
    "page.mdx",
    "./page.mdx",
    "../button+/_button.mdx",
    "./page.mdx#size",
  ])("accepts %s", (url) => {
    expect(isMdxFileLink(url)).toBe(true)
  })

  test.each([
    "/api/page",
    "/api/page.mdx",
    "./page",
    "#size",
    "./#size",
    "https://example.com/page.mdx",
    "file:page.mdx",
    "./page.mdx.png",
    "",
  ])("rejects %s", (url) => {
    expect(isMdxFileLink(url)).toBe(false)
  })
})

describe("resolveMdxFileLink", () => {
  test("resolves a sibling file without a ./ prefix", () => {
    expect(
      resolveMdxFileLink(
        "qui-docs-config.mdx#navConfig",
        `${routesDir}/api+/nav-config.mdx`,
        options,
      ),
    ).toEqual({fragment: "navConfig", pathname: "/api/qui-docs-config"})
  })

  test("resolves a sibling file with a ./ prefix", () => {
    expect(
      resolveMdxFileLink(
        "./qui-docs-config.mdx",
        `${routesDir}/api+/nav-config.mdx`,
        options,
      ),
    ).toEqual({fragment: undefined, pathname: "/api/qui-docs-config"})
  })

  test("resolves flat routes in parent directories", () => {
    expect(
      resolveMdxFileLink(
        "../tooltip+/_tooltip.mdx#placement",
        `${routesDir}/components+/button+/_button.mdx`,
        options,
      ),
    ).toEqual({fragment: "placement", pathname: "/components/tooltip"})
  })

  test("resolves index routes", () => {
    expect(
      resolveMdxFileLink(
        "../_index.mdx",
        `${routesDir}/api+/nav-config.mdx`,
        options,
      ),
    ).toEqual({fragment: undefined, pathname: "/"})
  })

  test("decodes URL-encoded paths", () => {
    expect(
      resolveMdxFileLink(
        "./my%20page.mdx",
        `${routesDir}/api+/nav-config.mdx`,
        options,
      )?.pathname,
    ).toBe("/api/my page")
  })

  test("resolves directory group routes", () => {
    expect(
      resolveMdxFileLink(
        "qui-docs-config.mdx#navConfig",
        `${routesDir}/api/nav-config.mdx`,
        {routesDir, routingStrategy: "react-router-directory-groups"},
      ),
    ).toEqual({fragment: "navConfig", pathname: "/api/qui-docs-config"})
  })

  test("uses the configured routing strategy", () => {
    expect(
      resolveMdxFileLink("./target.mdx", `${routesDir}/api+/source.mdx`, {
        routesDir,
        routingStrategy: (filePath) => ["custom", filePath],
      })?.pathname,
    ).toBe("/custom/api+/target.mdx")
  })

  test("resolves Windows drive paths", () => {
    expect(
      resolveMdxFileLink(
        "../tooltip+/_tooltip.mdx",
        "C:\\site\\src\\routes\\components+\\button+\\_button.mdx",
        {routesDir: "C:\\site\\src\\routes"},
      )?.pathname,
    ).toBe("/components/tooltip")
  })

  test("returns null for files outside the routes directory", () => {
    expect(
      resolveMdxFileLink(
        "../../README.mdx",
        `${routesDir}/api+/nav-config.mdx`,
        options,
      ),
    ).toBeNull()
  })

  test("returns null for URL links", () => {
    expect(
      resolveMdxFileLink(
        "/api/qui-docs-config",
        `${routesDir}/api+/nav-config.mdx`,
        options,
      ),
    ).toBeNull()
  })
})

describe("rehypeMdxFileLinks", () => {
  function render(md: string, path?: string): string {
    const processor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMdxFileLinks, options)
      .use(rehypeStringify)
    return String(processor.processSync({path, value: md}))
  }

  test("rewrites file links to route pathnames", () => {
    expect(
      render(
        "[a](qui-docs-config.mdx#navConfig) [b](/api/typedoc) [c](https://example.com)",
        `${routesDir}/api+/nav-config.mdx`,
      ),
    ).toBe(
      '<p><a href="/api/qui-docs-config#navConfig">a</a> <a href="/api/typedoc">b</a> <a href="https://example.com">c</a></p>',
    )
  })

  test("leaves links unchanged without a source file path", () => {
    expect(render("[a](./page.mdx)")).toBe('<p><a href="./page.mdx">a</a></p>')
  })
})

describe("remarkMdxFileLinks", () => {
  test("rewrites file links relative to the given source file", () => {
    const processor = unified()
      .use(remarkParse)
      .use(
        remarkMdxFileLinks(`${routesDir}/components+/button+/_button.mdx`, {
          routesDir,
        }),
      )
    const tree = processor.runSync(
      processor.parse("[a](../tooltip+/_tooltip.mdx) [b](#size)"),
    )

    const urls: string[] = []
    visit(tree, "link", (node: Link) => {
      urls.push(node.url)
    })
    expect(urls).toEqual(["/components/tooltip", "#size"])
  })
})

describe("SearchIndexer file links", () => {
  let tmpDir: string | undefined

  afterEach(() => {
    vi.restoreAllMocks()
    if (tmpDir) {
      rmSync(tmpDir, {force: true, recursive: true})
      tmpDir = undefined
    }
  })

  function buildIndex(
    files: Record<string, string>,
    indexerOptions: Partial<SearchIndexerOptions> = {},
  ) {
    tmpDir = mkdtempSync(join(tmpdir(), "qui-mdx-vite-"))
    const filePaths = Object.entries(files).map(([name, body]) => {
      const filePath = join(tmpDir!, "routes", name)
      mkdirSync(dirname(filePath), {recursive: true})
      writeFileSync(filePath, body, "utf-8")
      return filePath
    })

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
    const indexer = new SearchIndexer({
      navConfig: [],
      pageDirectory: "routes",
      srcDir: tmpDir,
      ...indexerOptions,
    })
    indexer.buildIndex(filePaths)
    return {indexer, output: debugSpy.mock.calls.flat().join("\n")}
  }

  const target = "---\ntitle: Target\n---\n\n# Target\n\n## Size\n\nContent."

  function page(body: string) {
    return `---\ntitle: Source\n---\n\n# Source\n\n## Intro\n\n${body}`
  }

  test("validates file links against the target page", () => {
    const {indexer, output} = buildIndex(
      {
        "api+/source.mdx": page(
          "[a](./target.mdx#size) [b](target.mdx) [c](../guide+/_guide.mdx)",
        ),
        "api+/target.mdx": target,
        "guide+/_guide.mdx": target,
      },
      {lint: {brokenLinks: "error"}},
    )
    expect(output).not.toContain("broken link")
    expect(indexer.lintErrorCount).toBe(0)
  })

  test("reports broken file links", () => {
    const {indexer, output} = buildIndex(
      {
        "api+/source.mdx": page("[a](./missing.mdx) [b](./target.mdx#nope)"),
        "api+/target.mdx": target,
      },
      {lint: {brokenLinks: "error"}},
    )
    expect(output).toContain("./missing.mdx — page not found")
    expect(output).toContain('./target.mdx#nope — fragment "#nope" not found')
    expect(indexer.lintErrorCount).toBe(2)
  })

  test("does not report URL links by default", () => {
    const {output} = buildIndex({
      "api+/source.mdx": page("[a](/api/target)"),
      "api+/target.mdx": target,
    })
    expect(output).not.toContain("relative .mdx file path")
  })

  test("warns about URL links when fileLinks is warn", () => {
    const {indexer, output} = buildIndex(
      {
        "api+/source.mdx": page("[a](/api/target)"),
        "api+/target.mdx": target,
      },
      {lint: {fileLinks: "warn"}},
    )
    expect(output).toContain("relative .mdx file path")
    expect(output).toContain("qui-docs fix-links")
    expect(indexer.lintErrorCount).toBe(0)
  })

  test("resolves file links in symlinked pages against the real file", () => {
    tmpDir = mkdtempSync(join(tmpdir(), "qui-mdx-vite-"))
    const sharedFile = join(tmpDir, "shared", "shared.mdx")
    mkdirSync(dirname(sharedFile), {recursive: true})
    writeFileSync(
      sharedFile,
      page("[a](/api/target) [b](./target.mdx)"),
      "utf-8",
    )
    const targetFile = join(tmpDir, "routes", "api+", "target.mdx")
    mkdirSync(dirname(targetFile), {recursive: true})
    writeFileSync(targetFile, target, "utf-8")
    const linkFile = join(tmpDir, "routes", "api+", "shared.mdx")
    symlinkSync(sharedFile, linkFile)

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
    const indexer = new SearchIndexer({
      lint: {brokenLinks: "error", fileLinks: "error"},
      navConfig: [],
      pageDirectory: "routes",
      srcDir: tmpDir,
    })
    indexer.buildIndex([linkFile, targetFile])
    const output = debugSpy.mock.calls.flat().join("\n")

    expect(output).toContain("./target.mdx — page not found")
    expect(output).not.toContain("relative .mdx file path")
    expect(indexer.lintErrorCount).toBe(1)
  })

  test("reports URL links to MDX pages with file path suggestions", () => {
    const {indexer, output} = buildIndex(
      {
        "api+/source.mdx": page(
          [
            "[a](/api/target#size)",
            "[b](./target)",
            "[c](/guide)",
            "[d](./#intro)",
            "[e](#intro)",
            "[f](./target.mdx)",
            "[g](/missing)",
          ].join(" "),
        ),
        "api+/target.mdx": target,
        "guide+/_guide.mdx": target,
      },
      {lint: {brokenLinks: "off", fileLinks: "error"}},
    )
    expect(output).toContain(
      "Found 4 links that should use a relative .mdx file path",
    )
    expect(output).toMatch(/\/api\/target#size — use .*\.\/target\.mdx#size/)
    expect(output).toMatch(/\.\/target — use .*\.\/target\.mdx/)
    expect(output).toMatch(/\/guide — use .*\.\.\/guide\+\/_guide\.mdx/)
    expect(output).toMatch(/\.\/#intro — use .*#intro/)
    expect(output).not.toContain("/missing")
    expect(indexer.lintErrorCount).toBe(4)
  })
})
