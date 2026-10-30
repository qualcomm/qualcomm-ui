// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import type {RoutingStrategy, SearchIndexerOptions} from "../config"
import {MdxFileReader} from "../markdown"
import {SearchIndexer} from "../search-indexer"

let temporaryDirectory: string

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-parent-routes-"))
})

afterEach(async () => {
  vi.restoreAllMocks()
  await rm(temporaryDirectory, {force: true, recursive: true})
})

async function writeRoute(name: string, content = "# Page\n\nPage content.") {
  const filePath = join(temporaryDirectory, "routes", name)
  await mkdir(dirname(filePath), {recursive: true})
  await writeFile(filePath, content, "utf8")
  return filePath
}

function createIndexer(options: Partial<SearchIndexerOptions> = {}) {
  return new SearchIndexer({
    pageDirectory: "routes",
    srcDir: temporaryDirectory,
    throwOnError: true,
    ...options,
  })
}

const routingCases: {
  files: string[]
  name: string
  routingStrategy?: RoutingStrategy
}[] = [
  {
    files: [
      "_index.mdx",
      "guide._index.mdx",
      "guide.advanced._index.mdx",
      "guide.advanced.topic.mdx",
      "guidebook.mdx",
    ],
    name: "flat routes",
  },
  {
    files: [
      "index.mdx",
      "guide+/index.mdx",
      "guide+/advanced+/_advanced.mdx",
      "guide+/advanced+/topic.mdx",
      "guidebook.mdx",
    ],
    name: "hybrid routes",
  },
  {
    files: [
      "index.mdx",
      "guide/index.mdx",
      "guide/advanced/index.mdx",
      "guide/advanced/topic.mdx",
      "guidebook.mdx",
    ],
    name: "directory routes",
    routingStrategy: "react-router-directory-groups",
  },
  {
    files: [
      "index.mdx",
      "guide/index.mdx",
      "guide/advanced/index.mdx",
      "guide/advanced/topic.mdx",
      "guidebook.mdx",
    ],
    name: "generouted routes",
    routingStrategy: "vite-generouted",
  },
  {
    files: [
      "home.mdx",
      "guide.mdx",
      "guide--advanced.mdx",
      "guide--advanced--topic.mdx",
      "guidebook.mdx",
    ],
    name: "custom routes",
    routingStrategy: (filePath) =>
      filePath === "home.mdx" ? [] : filePath.replace(/\.mdx$/, "").split("--"),
  },
]

describe("parent pages", () => {
  test.each(routingCases)(
    "creates folder-only parents for $name regardless of file order",
    async ({files, routingStrategy}) => {
      const paths = await Promise.all(
        files.map((name, index) =>
          writeRoute(
            name,
            index === 0
              ? "---\nid: _index\ntitle: Home\n---\n\nHome content."
              : index === 1 || index === 2
                ? "---\ntitle: Ignored title\nsideNavTitle: Ignored nav title\ngroup: Ignored group\n---\n\nIgnored parent content."
                : "# Leaf\n\nLeaf content.",
          ),
        ),
      )
      const indexer = createIndexer({
        navConfig: [
          {id: "_index", title: "Home"},
          {expanded: true, id: "guide", title: "Documentation"},
        ],
        routingStrategy,
      })

      for (const inputFiles of [paths, paths.toReversed()]) {
        const compiled = indexer.buildIndex(inputFiles)

        expect(Object.keys(indexer.pageMap).sort()).toEqual([
          "/",
          "/guide/advanced/topic",
          "/guidebook",
        ])
        expect(compiled.map((file) => file.metadata.filePath).sort()).toEqual(
          [paths[0], paths[3], paths[4]].sort(),
        )
        expect(indexer.mdxFileCount).toBe(3)
        expect(indexer.ignoredMdxFiles).toEqual(new Set([paths[1], paths[2]]))
        expect(
          indexer.searchIndex.map((entry) => entry.pathname).sort(),
        ).toEqual(["/", "/guide/advanced/topic", "/guidebook"])
        expect(indexer.navItems.find((item) => item.id === "/")).toMatchObject({
          pathname: "/",
          title: "Home",
        })
        const parent = indexer.navItems.find((item) => item.id === "/guide")!
        expect(parent).toMatchObject({
          expanded: true,
          group: undefined,
          order: 2,
          pathname: undefined,
          title: "Documentation",
        })
        expect(parent.items).toEqual([
          expect.objectContaining({
            id: "/guide/advanced",
            items: [
              expect.objectContaining({pathname: "/guide/advanced/topic"}),
            ],
            pathname: undefined,
            title: "Advanced",
          }),
        ])
      }
    },
  )

  test.each([
    ["mdx", "tsx"],
    ["tsx", "mdx"],
    ["tsx", "tsx"],
  ])(
    "handles a %s parent and %s child",
    async (parentExtension, childExtension) => {
      const parent = await writeRoute(`guide.${parentExtension}`)
      const child = await writeRoute(`guide+/child.${childExtension}`)
      const indexer = createIndexer({
        navConfig: [{children: [{id: "child", title: "Child"}], id: "guide"}],
      })

      indexer.buildIndex([parent, child])

      expect(Object.keys(indexer.pageMap)).toEqual(["/guide/child"])
      expect(indexer.navItems).toEqual([
        expect.objectContaining({
          id: "/guide",
          items: [expect.objectContaining({pathname: "/guide/child"})],
          pathname: undefined,
        }),
      ])
    },
  )

  test("ignores malformed parent content before frontmatter and link parsing", async () => {
    const parent = await writeRoute(
      "guide.mdx",
      "---\ntitle: [\n---\n\n<Broken",
    )
    const child = await writeRoute("guide+/child.mdx")
    const indexer = createIndexer({lint: {brokenLinks: "warn"}})

    expect(() => indexer.buildIndex([parent, child])).not.toThrow()
    expect(Object.keys(indexer.pageMap)).toEqual(["/guide/child"])
  })

  test("ignores assets, private folders, and unconfigured TSX files when identifying parents", async () => {
    const parent = await writeRoute("guide.mdx")
    const otherFiles = await Promise.all([
      writeRoute("guide/image.svg"),
      writeRoute("guide/helper.tsx"),
      writeRoute("guide/_demos/demo.mdx"),
      writeRoute("guide/$slug.mdx"),
    ])
    const indexer = createIndexer({
      routingStrategy: "react-router-directory-groups",
    })

    indexer.buildIndex([parent, ...otherFiles])

    expect(Object.keys(indexer.pageMap)).toEqual(["/guide"])
    expect(indexer.navItems[0].pathname).toBe("/guide")
  })

  test("hidden descendants still make the parent folder-only", async () => {
    const parent = await writeRoute("guide.mdx")
    const child = await writeRoute(
      "guide+/child.mdx",
      "---\ntitle: Child\nhidden: true\n---\n\nHidden content.",
    )
    const indexer = createIndexer()

    indexer.buildIndex([parent, child])

    expect(Object.keys(indexer.pageMap)).toEqual(["/guide/child"])
    expect(indexer.navItems).toEqual([])
  })

  test("reports links to ignored pages but does not validate links from them", async () => {
    const parent = await writeRoute(
      "guide.mdx",
      "# Guide\n\n[Missing](/missing)",
    )
    const child = await writeRoute(
      "guide+/child.mdx",
      "# Child\n\n[Parent](/guide)",
    )
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {})
    const indexer = createIndexer({lint: {brokenLinks: "warn"}})

    indexer.buildIndex([parent, child])

    const output = debug.mock.calls.flat().join("\n")
    expect(output).toContain("/guide")
    expect(output).toContain("page not found")
    expect(output).not.toContain("/missing")
  })

  test("rebuilds cached page and doc-prop data when descendants are added or removed", async () => {
    const parent = await writeRoute(
      "guide.mdx",
      '# Guide\n\nParent content.\n\n<TypeDocProps name="WidgetProps" />',
    )
    const child = await writeRoute("guide+/child.mdx")
    const indexer = new SearchIndexer(
      {
        pageDirectory: "routes",
        srcDir: temporaryDirectory,
        throwOnError: true,
        typeDocProps: {
          WidgetProps: {
            name: "WidgetProps",
            props: [
              {
                name: "value",
                resolvedType: {prettyType: "boolean", type: "boolean"},
              },
            ],
          },
        },
      },
      true,
      {mdxFileReader: new MdxFileReader(true)},
    )

    indexer.buildIndex([parent])
    expect(indexer.pageDocProps["/guide"].WidgetProps).toBeDefined()

    indexer.buildIndex([parent, child])
    expect(indexer.pageMap["/guide"]).toBeUndefined()
    expect(indexer.pageDocProps).toEqual({})
    expect(
      indexer.searchIndex.every((entry) => entry.pathname !== "/guide"),
    ).toBe(true)
    expect(indexer.navItems[0].pathname).toBeUndefined()

    indexer.buildIndex([parent])
    expect(indexer.cachedFileCount).toBe(1)
    expect(indexer.ignoredMdxFiles.size).toBe(0)
    expect(indexer.pageMap["/guide"]).toBeDefined()
    expect(indexer.pageDocProps["/guide"].WidgetProps).toBeDefined()
    expect(indexer.navItems[0].pathname).toBe("/guide")
    expect(indexer.navItems[0].items).toEqual([])
  })
})
