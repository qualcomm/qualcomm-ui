// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test, vi} from "vitest"

import {MdxFileReader} from "../markdown"
import {SearchIndexer} from "../search-indexer"

let tmpDir: string | undefined

afterEach(() => {
  vi.restoreAllMocks()

  if (tmpDir) {
    rmSync(tmpDir, {force: true, recursive: true})
    tmpDir = undefined
  }
})

function createMdxFile(path: string, contents: string): string {
  writeFileSync(path, contents, "utf-8")
  return path
}

describe("SearchIndexer link validation cache", () => {
  test("revalidates cached source page links against changed target fragments", () => {
    tmpDir = mkdtempSync(join(tmpdir(), "qui-mdx-vite-"))
    const routesDir = join(tmpDir, "routes")
    mkdirSync(routesDir)

    const sourceFile = createMdxFile(
      join(routesDir, "source.mdx"),
      [
        "---",
        "title: Source",
        "---",
        "",
        "See the [target anchor](/target#target-anchor).",
      ].join("\n"),
    )
    const targetFile = join(routesDir, "target.mdx")
    createMdxFile(
      targetFile,
      [
        "---",
        "title: Target",
        "---",
        "",
        "## Target Anchor",
        "",
        "Target content.",
      ].join("\n"),
    )

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
    const indexer = new SearchIndexer(
      {
        navConfig: [],
        pageDirectory: "routes",
        srcDir: tmpDir,
        validatePageLinks: true,
      },
      true,
      {mdxFileReader: new MdxFileReader(true)},
    )

    indexer.buildIndex([sourceFile, targetFile])
    debugSpy.mockClear()

    createMdxFile(
      targetFile,
      [
        "---",
        "title: Target",
        "---",
        "",
        "## Renamed Anchor",
        "",
        "Target content.",
      ].join("\n"),
    )

    indexer.buildIndex([sourceFile, targetFile])

    const output = debugSpy.mock.calls.flat().join("\n")
    expect(output).toContain("/target#target-anchor")
    expect(output).toContain('fragment "#target-anchor" not found')
  })
})
