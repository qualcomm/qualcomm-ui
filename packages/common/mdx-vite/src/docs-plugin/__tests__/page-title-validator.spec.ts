// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test, vi} from "vitest"

import type {SearchIndexerOptions} from "../config"
import {createRemarkProcessor} from "../markdown/remark-pipeline"
import {validatePageTitle} from "../page-title-validator"
import {SearchIndexer} from "../search-indexer"

function validate(md: string) {
  const tree = createRemarkProcessor({frontmatter: true, mdx: true}).parse(md)
  return validatePageTitle(tree, "/routes/page.mdx", "/page").map(
    ({line, reason}) => ({line, reason}),
  )
}

describe("validatePageTitle", () => {
  test("accepts a frontmatter title after frontmatter and imports", () => {
    expect(
      validate(
        [
          "---",
          "title: Page",
          "---",
          "",
          'import {Demo} from "./demo"',
          "",
          "# {frontmatter.title}",
          "",
          "Content.",
        ].join("\n"),
      ),
    ).toEqual([])
  })

  test("accepts a literal title", () => {
    expect(validate("# Page\n\n## Section")).toEqual([])
  })

  test("reports a page without an h1", () => {
    expect(validate("Intro text.\n\n## Section")).toEqual([
      {line: 1, reason: "missing-title"},
    ])
  })

  test("reports content placed before the title", () => {
    expect(validate("<Callout>Hi</Callout>\n\n# Page")).toEqual([
      {line: 1, reason: "missing-title"},
      {line: 3, reason: "extra-h1"},
    ])
  })

  test("reports additional h1 headings", () => {
    expect(validate("# Page\n\n## Section\n\n# Another")).toEqual([
      {line: 5, reason: "extra-h1"},
    ])
  })

  test("ignores h1 syntax inside code blocks", () => {
    expect(
      validate(["# Page", "", "```shell", "# a comment", "```"].join("\n")),
    ).toEqual([])
  })

  test("skips pages without content", () => {
    expect(validate("export const loader = () => null")).toEqual([])
  })
})

describe("SearchIndexer page title lint", () => {
  let tmpDir: string | undefined

  afterEach(() => {
    vi.restoreAllMocks()
    if (tmpDir) {
      rmSync(tmpDir, {force: true, recursive: true})
      tmpDir = undefined
    }
  })

  function buildIndex(
    contents: string,
    options: Partial<SearchIndexerOptions> = {},
  ) {
    tmpDir = mkdtempSync(join(tmpdir(), "qui-mdx-vite-"))
    const routesDir = join(tmpDir, "routes")
    mkdirSync(routesDir)
    const file = join(routesDir, "page.mdx")
    writeFileSync(file, contents, "utf-8")

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
    const indexer = new SearchIndexer({
      navConfig: [],
      pageDirectory: "routes",
      srcDir: tmpDir,
      ...options,
    })
    indexer.buildIndex([file])
    return {
      file,
      indexer,
      output: debugSpy.mock.calls.flat().join("\n"),
    }
  }

  const invalidPage = "---\ntitle: Page\n---\n\nIntro.\n\n# Stray"

  test("counts issues as errors when set to error", () => {
    const {file, indexer, output} = buildIndex(invalidPage, {
      lint: {pageTitle: "error"},
    })

    expect(indexer.lintErrorCount).toBe(2)
    expect(output).toContain(`${file}:5`)
    expect(output).toContain(`${file}:7`)
  })

  test("logs without counting errors by default", () => {
    const {indexer, output} = buildIndex(invalidPage)

    expect(indexer.lintErrorCount).toBe(0)
    expect(output).toContain("Found 2 page title issues")
  })

  test("skips the check when set to off", () => {
    const {indexer, output} = buildIndex(invalidPage, {
      lint: {pageTitle: "off"},
    })

    expect(indexer.lintErrorCount).toBe(0)
    expect(output).not.toContain("page title")
  })

  test("broken links warn by default and count as errors when configured", () => {
    const page = "# Page\n\n[missing](/missing)"

    expect(buildIndex(page).indexer.lintErrorCount).toBe(0)
    rmSync(tmpDir!, {force: true, recursive: true})
    expect(
      buildIndex(page, {lint: {brokenLinks: "error"}}).indexer.lintErrorCount,
    ).toBe(1)
  })
})
