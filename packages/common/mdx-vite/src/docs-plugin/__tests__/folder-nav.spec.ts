// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {sync} from "glob"
import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import type {NavItem} from "@qualcomm-ui/mdx-common"

import type {SearchIndexerOptions} from "../config"
import {fixPath} from "../path-utils"
import {SearchIndexer} from "../search-indexer"

import {readJsonSync} from "./utils"

const __dirname = dirname(fileURLToPath(import.meta.url))

let srcDir: string
let debugSpy: ReturnType<typeof vi.spyOn>

function getOutput(): string {
  return debugSpy.mock.calls.flat().join("\n")
}

async function writeRoutes(files: Record<string, string | object>) {
  for (const [path, contents] of Object.entries(files)) {
    const filePath = join(srcDir, "routes", path)
    await mkdir(dirname(filePath), {recursive: true})
    await writeFile(
      filePath,
      typeof contents === "string" ? contents : JSON.stringify(contents),
      "utf-8",
    )
  }
}

function page(title: string): string {
  return `---\ntitle: ${title}\n---\n\n# {frontmatter.title}\n`
}

function buildIndex(
  options: Partial<SearchIndexerOptions> = {},
): SearchIndexer {
  const indexer = new SearchIndexer({
    pageDirectory: "routes",
    routingStrategy: "react-router-directory-groups",
    srcDir,
    ...options,
  })
  indexer.buildIndex(sync(`${srcDir}/routes/**/*.{mdx,tsx}`))
  return indexer
}

function getTitles(items: NavItem[] | undefined): string[] {
  return (items ?? []).map((item) => item.sectionTitle || item.title)
}

function findItem(indexer: SearchIndexer, id: string): NavItem | undefined {
  return indexer.navItems.find((item) => item.id === id)
}

beforeEach(async () => {
  srcDir = fixPath(await mkdtemp(join(tmpdir(), "qui-docs-folder-nav-")))
  debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
})

afterEach(async () => {
  vi.restoreAllMocks()
  await rm(srcDir, {force: true, recursive: true})
})

describe("_nav.json files", () => {
  test("build the same site data as the equivalent root navConfig", () => {
    const fixtures = resolve(__dirname, "./fixtures")
    const fixtureSrcDir = resolve(fixtures, "folder-nav")
    const indexer = new SearchIndexer({
      navConfig: [
        {id: "_index", title: "Introduction"},
        {id: "guide"},
        {id: "api"},
      ],
      pageDirectory: "routes",
      routingStrategy: "react-router-directory-groups",
      srcDir: fixtureSrcDir,
      throwOnError: true,
    })
    indexer.buildIndex(sync(`${fixtureSrcDir}/routes/**/*.{mdx,tsx}`))

    const expected = (file: string) =>
      readJsonSync(
        resolve(fixtures, "react-router-directory-routes/mock-data", file),
      )
    const toJson = (value: unknown) => JSON.parse(JSON.stringify(value))

    expect(indexer.navConfigErrorCount).toBe(0)
    expect(toJson(indexer.navItems)).toEqual(expected("nav-items.json"))
    expect(toJson(indexer.pageMap)).toEqual(expected("page-map.json"))
    expect(toJson(indexer.searchIndex)).toEqual(expected("search-index.json"))
  })

  test("skip the whole file when it redefines a property from navConfig", async () => {
    await writeRoutes({
      "guide/_nav.json": {
        children: [{id: "b"}, {id: "a"}],
        title: "Guide",
      },
      "guide/a.mdx": page("A"),
      "guide/b.mdx": page("B"),
    })

    const indexer = buildIndex({navConfig: [{id: "guide", title: "Guides"}]})

    expect(indexer.navConfigErrorCount).toBe(1)
    expect(getOutput()).toContain(
      `/guide: "title" is already defined in navConfig`,
    )
    const guide = findItem(indexer, "/guide")
    expect(guide?.title).toBe("Guides")
    expect(getTitles(guide?.items)).toEqual(["A", "B"])
  })

  test("treat false and empty values in navConfig as definitions", async () => {
    await writeRoutes({
      "api/_nav.json": {expanded: false},
      "api/page.mdx": page("Page"),
      "guide/_nav.json": {children: [{id: "a"}]},
      "guide/a.mdx": page("A"),
    })

    const indexer = buildIndex({
      navConfig: [
        {children: [], id: "guide"},
        {expanded: false, id: "api"},
      ],
    })

    expect(indexer.navConfigErrorCount).toBe(2)
    expect(getOutput()).toContain(
      `/guide: "children" is already defined in navConfig`,
    )
    expect(getOutput()).toContain(
      `/api: "expanded" is already defined in navConfig`,
    )
  })

  test("skip a nested file that redefines a property from its parent's file", async () => {
    await writeRoutes({
      "guide/_nav.json": {
        children: [{id: "advanced", title: "Advanced"}],
        title: "Guide",
      },
      "guide/advanced/_nav.json": {expanded: true, title: "Deep Dive"},
      "guide/advanced/topic.mdx": page("Topic"),
    })

    const indexer = buildIndex()

    expect(indexer.navConfigErrorCount).toBe(1)
    expect(getOutput()).toMatch(
      /\/guide\/advanced: "title" is already defined in .*guide\/_nav\.json/,
    )
    const guide = findItem(indexer, "/guide")
    expect(guide?.title).toBe("Guide")
    expect(guide?.items?.[0]).toMatchObject({
      expanded: false,
      title: "Advanced",
    })
  })

  test("merge files from folders that resolve to the same route", async () => {
    await writeRoutes({
      "guide+/_nav.json": {title: "Guide"},
      "guide+/topic.mdx": page("Topic"),
      "guide/_nav.json": {expanded: true},
    })

    const indexer = buildIndex({routingStrategy: undefined})

    expect(indexer.navConfigErrorCount).toBe(0)
    expect(findItem(indexer, "/guide")).toMatchObject({
      expanded: true,
      title: "Guide",
    })
  })

  test("reject overlapping properties from folders that resolve to the same route", async () => {
    await writeRoutes({
      "guide+/_nav.json": {title: "Guide"},
      "guide+/topic.mdx": page("Topic"),
      "guide/_nav.json": {title: "Guides"},
    })

    const indexer = buildIndex({routingStrategy: undefined})

    expect(indexer.navConfigErrorCount).toBe(1)
    expect(getOutput()).toContain(`/guide: "title" is already defined in`)
  })

  test("report malformed JSON, schema errors, and duplicate children", async () => {
    await writeRoutes({
      "a/_nav.json": "{",
      "a/page.mdx": page("A"),
      "b/_nav.json": {children: [{id: "page", titel: "Page"}]},
      "b/page.mdx": page("B"),
      "c/_nav.json": {children: [{id: "page"}, {id: "page"}]},
      "c/page.mdx": page("C"),
    })

    const indexer = buildIndex()

    expect(indexer.navConfigErrorCount).toBe(3)
    const output = getOutput()
    expect(output).toContain("invalid JSON")
    expect(output).toContain(`children[0]: Unrecognized key: "titel"`)
    expect(output).toContain(`/c: "page" is listed more than once in children`)
  })

  test("reject a file in the page directory root", async () => {
    await writeRoutes({
      "_nav.json": {title: "Home"},
      "index.mdx": page("Home"),
    })

    const indexer = buildIndex()

    expect(indexer.navConfigErrorCount).toBe(1)
    expect(getOutput()).toContain("not supported in the page directory root")
  })

  test("ignore files in folders that the routing strategy excludes", async () => {
    await writeRoutes({
      "guide/_demos/_nav.json": {title: "Demos"},
      "guide/page.mdx": page("Page"),
    })

    const indexer = buildIndex()

    expect(indexer.navConfigErrorCount).toBe(0)
    expect(getOutput()).toContain("excludes this folder's pages")
  })

  test("sort a folder that its parent doesn't list with unlisted siblings", async () => {
    await writeRoutes({
      "alpha/page.mdx": page("Alpha Page"),
      "omega/_nav.json": {title: "Omega"},
      "omega/page.mdx": page("Omega Page"),
      "zeta/page.mdx": page("Zeta Page"),
    })

    const indexer = buildIndex({navConfig: [{id: "zeta"}]})

    expect(getTitles(indexer.navItems)).toEqual(["Zeta", "Alpha", "Omega"])
  })

  test("don't add tsx routes for folders created to reach a nested file", async () => {
    await writeRoutes({
      "guide/_index.tsx": "export default function Guide() {}",
      "guide/advanced/_nav.json": {title: "Advanced"},
    })

    const indexer = buildIndex()

    expect(indexer.navConfigErrorCount).toBe(0)
    expect(indexer.navItems).toEqual([])
  })

  test("keep section titles in place when a file hides a top-level route", async () => {
    await writeRoutes({
      "a.mdx": page("A"),
      "b.mdx": page("B"),
      "secret+/_index.mdx": page("Secret"),
      "secret+/_nav.json": {hidden: true},
    })

    const indexer = buildIndex({
      navConfig: [{id: "a"}, {id: "secret"}, {sectionTitle: "More"}, {id: "b"}],
      routingStrategy: undefined,
    })

    expect(getTitles(indexer.navItems)).toEqual(["A", "More", "B"])
  })

  test("apply sideNavTitle from navConfig and from files", async () => {
    await writeRoutes({
      "api/_nav.json": {sideNavTitle: "Reference"},
      "api/page.mdx": page("Page"),
      "guide/page.mdx": page("Page"),
    })

    const indexer = buildIndex({
      navConfig: [{id: "guide", sideNavTitle: "Guides"}, {id: "api"}],
    })

    expect(getTitles(indexer.navItems)).toEqual(["Guides", "Reference"])
  })

  test("throw for invalid files when throwOnError is set", async () => {
    await writeRoutes({
      "guide/_nav.json": {id: "guide"},
      "guide/page.mdx": page("Page"),
    })

    expect(() => buildIndex({throwOnError: true})).toThrow(
      "Found 1 invalid _nav.json file.",
    )
  })
})
