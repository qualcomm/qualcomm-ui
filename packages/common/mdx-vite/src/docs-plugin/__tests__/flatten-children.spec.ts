// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import type {NavItem} from "@qualcomm-ui/mdx-common"

import type {RoutingStrategy} from "../config"
import {ConfigLoader} from "../config/config-loader"
import {routeMetaSchema} from "../config/config-schema"
import type {NavConfig} from "../nav-builder"
import {SearchIndexer} from "../search-indexer"

let temporaryDirectory: string
let files: string[]

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-flatten-children-"))
  files = []
})

afterEach(async () => {
  await rm(temporaryDirectory, {force: true, recursive: true})
})

async function writeRoute(name: string, content = "# Page\n\nPage content.") {
  const filePath = join(temporaryDirectory, "routes", name)
  await mkdir(dirname(filePath), {recursive: true})
  await writeFile(filePath, content, "utf8")
  files.push(filePath)
}

function buildIndex(navConfig: NavConfig[], routingStrategy?: RoutingStrategy) {
  const indexer = new SearchIndexer({
    navConfig,
    pageDirectory: "routes",
    routingStrategy,
    srcDir: temporaryDirectory,
    throwOnError: true,
  })
  indexer.buildIndex(files)
  return indexer
}

function pagePaths(items: NavItem[]): string[] {
  return items.flatMap((item) => [
    ...(item.pathname ? [item.pathname] : []),
    ...pagePaths(item.items ?? []),
  ])
}

describe("flattenChildren configuration", () => {
  test.each([undefined, false, true])("accepts %s", async (flattenChildren) => {
    const navConfig: NavConfig[] = [{flattenChildren, id: "guides"}]
    const filePath = join(temporaryDirectory, "qui-docs.config.cjs")
    await writeFile(
      filePath,
      `module.exports = ${JSON.stringify({navConfig})}`,
      "utf8",
    )

    expect(
      new ConfigLoader({configFile: filePath}).loadConfig().navConfig,
    ).toEqual(navConfig)
  })

  test.each(["true", 1, null])("rejects %s", (flattenChildren) => {
    expect(
      routeMetaSchema.safeParse({flattenChildren, id: "guides"}).success,
    ).toBe(false)
  })
})

describe("flattenChildren navigation", () => {
  test.each([undefined, false])(
    "preserves folders when flattenChildren is %s and ignores nested flags",
    async (flattenChildren) => {
      await writeRoute("guides+/advanced+/configuration.mdx")
      const indexer = buildIndex([
        {
          children: [{flattenChildren: true, id: "advanced"}],
          flattenChildren,
          id: "guides",
        },
      ])

      expect(indexer.navItems).toEqual([
        expect.objectContaining({
          depth: 1,
          id: "/guides",
          items: [
            expect.objectContaining({
              depth: 2,
              id: "/guides/advanced",
              items: [
                expect.objectContaining({
                  depth: 3,
                  pathname: "/guides/advanced/configuration",
                }),
              ],
            }),
          ],
        }),
      ])
    },
  )

  test("promotes one level while preserving child settings and nested URLs", async () => {
    await writeRoute(
      "guides+/installation.mdx",
      "---\ntitle: Install\nsideNavTitle: Installation\nbadges:\n  - id: new\n    label: New\n---\n\nInstall content.",
    )
    await writeRoute("guides+/advanced+/configuration.mdx")
    const indexer = buildIndex([
      {sectionTitle: "Guides"},
      {
        children: [
          {id: "installation"},
          {expanded: true, flattenChildren: true, id: "advanced"},
        ],
        flattenChildren: true,
        id: "guides",
      },
    ])

    expect(indexer.navItems).toEqual([
      expect.objectContaining({depth: 1, sectionTitle: "Guides"}),
      expect.objectContaining({
        badges: [{id: "new", label: "New"}],
        depth: 1,
        id: "/guides/installation",
        pathname: "/guides/installation",
        pathSegments: ["guides", "installation"],
        searchMeta: ["Guides"],
        title: "Installation",
      }),
      expect.objectContaining({
        depth: 1,
        expanded: true,
        id: "/guides/advanced",
        items: [
          expect.objectContaining({
            depth: 2,
            pathname: "/guides/advanced/configuration",
            pathSegments: ["guides", "advanced", "configuration"],
          }),
        ],
      }),
    ])
  })

  test("keeps multiple promoted subtrees in place around headings and separators", async () => {
    await Promise.all(
      [
        "before.mdx",
        "guides+/alpha.mdx",
        "guides+/zulu.mdx",
        "api+/alpha.mdx",
        "api+/zulu.mdx",
        "after.mdx",
      ].map((name) => writeRoute(name)),
    )
    const indexer = buildIndex([
      {id: "before", title: "Before"},
      {sectionTitle: "Guides"},
      {
        children: [
          {id: "zulu", title: "Z guide"},
          {id: "alpha", title: "A guide"},
        ],
        flattenChildren: true,
        id: "guides",
      },
      {separator: true},
      {sectionTitle: "API"},
      {
        children: [
          {id: "zulu", title: "Z API"},
          {id: "alpha", title: "A API"},
        ],
        flattenChildren: true,
        id: "api",
      },
      {separator: true},
      {id: "after", title: "After"},
    ])

    expect(
      indexer.navItems.map((item) =>
        item.separator ? "---" : item.sectionTitle || item.title,
      ),
    ).toEqual([
      "Before",
      "Guides",
      "Z guide",
      "A guide",
      "---",
      "API",
      "Z API",
      "A API",
      "---",
      "After",
    ])
    expect(indexer.navItems.at(-1)?.searchMeta).toBeUndefined()
  })

  test("respects ignored parent and child ordering without re-sorting promoted items", async () => {
    await Promise.all(
      ["guides+/alpha.mdx", "guides+/zulu.mdx", "other.mdx"].map((name) =>
        writeRoute(name),
      ),
    )
    const indexer = buildIndex([
      {
        children: [
          {id: "alpha", ignoreRouteMetaOrder: true, title: "Alpha"},
          {id: "zulu", title: "Zulu"},
        ],
        flattenChildren: true,
        id: "guides",
        ignoreRouteMetaOrder: true,
      },
      {sectionTitle: "Pages"},
      {id: "other", title: "Other"},
    ])

    expect(
      indexer.navItems.map((item) => item.sectionTitle || item.title),
    ).toEqual(["Pages", "Other", "Zulu", "Alpha"])
  })

  test("preserves group order and filtering context without leaking child groups", async () => {
    await writeRoute(
      "guides+/advanced+/configuration.mdx",
      "---\ntitle: Configuration\ngroup: Options\n---\n\nConfiguration content.",
    )
    await writeRoute("guides+/installation.mdx", "# Installation")
    await writeRoute("other.mdx", "# Other")
    const indexer = buildIndex([
      {sectionTitle: "Documentation"},
      {
        children: [
          {group: "Basics", id: "installation", ignoreRouteMetaOrder: true},
          {group: "Advanced", id: "advanced", ignoreRouteMetaOrder: true},
        ],
        flattenChildren: true,
        groupOrder: ["Advanced", "Basics"],
        id: "guides",
      },
      {id: "other"},
    ])

    expect(
      indexer.navItems.map((item) => item.sectionTitle || item.title),
    ).toEqual([
      "Documentation",
      "Advanced",
      "Advanced",
      "Basics",
      "Installation",
      "Other",
    ])
    expect(indexer.navItems.every((item) => item.depth === 1)).toBe(true)
    expect(indexer.navItems[2].items).toEqual([
      expect.objectContaining({depth: 2, sectionTitle: "Options"}),
      expect.objectContaining({
        depth: 2,
        searchMeta: ["Documentation", "Advanced", "Options"],
      }),
    ])
    expect(indexer.navItems[4].searchMeta).toEqual(["Documentation", "Basics"])
    expect(indexer.navItems[5].searchMeta).toEqual(["Documentation"])
  })

  test("discovers children, excludes hidden or missing pages, and leaves leaf flags alone", async () => {
    await writeRoute("guides+/discovered.mdx", "# Discovered")
    await writeRoute("guides+/hidden.mdx", "# Hidden")
    await writeRoute(
      "empty+/hidden.mdx",
      "---\ntitle: Hidden\nhidden: true\n---",
    )
    await writeRoute("leaf.mdx", "# Leaf")
    const indexer = buildIndex([
      {
        children: [{hidden: true, id: "hidden"}, {id: "missing"}],
        flattenChildren: true,
        id: "guides",
      },
      {sectionTitle: "Empty"},
      {flattenChildren: true, id: "empty"},
      {flattenChildren: true, id: "leaf"},
    ])

    expect(indexer.navItems).toEqual([
      expect.objectContaining({depth: 1, pathname: "/guides/discovered"}),
      expect.objectContaining({sectionTitle: "Empty"}),
      expect.objectContaining({depth: 1, pathname: "/leaf"}),
    ])
    expect(indexer.pageMap["/guides/hidden"]).toBeDefined()
    expect(indexer.pageMap["/guides/missing"]).toBeUndefined()
  })

  test("keeps page data, search content, and page-link sequence unchanged across rebuilds", async () => {
    await Promise.all(
      [
        "before.mdx",
        "guides+/intro.mdx",
        "guides+/advanced+/topic.mdx",
        "after.mdx",
      ].map((name) => writeRoute(name)),
    )
    const navConfig: NavConfig[] = [
      {id: "before"},
      {id: "guides", title: "Documentation"},
      {id: "after"},
    ]
    const baseline = buildIndex(navConfig)
    const flattened = buildIndex(
      navConfig.map((item) =>
        item.id === "guides" ? {...item, flattenChildren: true} : item,
      ),
    )

    for (const inputFiles of [files, files.toReversed()]) {
      baseline.buildIndex(inputFiles)
      flattened.buildIndex(inputFiles)
      expect(flattened.pageMap).toEqual(baseline.pageMap)
      expect(flattened.searchIndex).toEqual(baseline.searchIndex)
      expect(pagePaths(flattened.navItems)).toEqual(
        pagePaths(baseline.navItems),
      )
      expect(flattened.pageMap["/guides/advanced/topic"].categories).toEqual([
        "Documentation",
        "Advanced",
        "Page",
      ])
      expect(flattened.navItems.map((item) => item.id)).toEqual([
        "/before",
        "/guides/advanced",
        "/guides/intro",
        "/after",
      ])
      expect(flattened.navItems[1].depth).toBe(1)
      expect(flattened.navItems[1].items?.[0].depth).toBe(2)
    }
  })

  test.each<{
    name: string
    route: string
    routingStrategy?: RoutingStrategy
  }>([
    {name: "flat", route: "guides.intro.mdx"},
    {name: "hybrid", route: "guides+/intro.mdx"},
    {
      name: "directory",
      route: "guides/intro.mdx",
      routingStrategy: "react-router-directory-groups",
    },
    {
      name: "generouted",
      route: "guides/intro.mdx",
      routingStrategy: "vite-generouted",
    },
    {
      name: "custom",
      route: "guides--intro.mdx",
      routingStrategy: (filePath) => filePath.replace(/\.mdx$/, "").split("--"),
    },
  ])("supports $name routing", async ({route, routingStrategy}) => {
    await writeRoute(route)
    const indexer = buildIndex(
      [{flattenChildren: true, id: "guides"}],
      routingStrategy,
    )

    expect(indexer.navItems).toEqual([
      expect.objectContaining({
        depth: 1,
        id: "/guides/intro",
        pathname: "/guides/intro",
        pathSegments: ["guides", "intro"],
      }),
    ])
  })
})
