// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {sync} from "glob"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {SearchIndexer} from "../search-indexer"

import {readJsonSync, writeJsonSync} from "./utils"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePaths = {
  navItems: resolve(
    __dirname,
    "./fixtures/react-router-directory-routes/mock-data/nav-items.json",
  ),
  pageMap: resolve(
    __dirname,
    "./fixtures/react-router-directory-routes/mock-data/page-map.json",
  ),
  routesDir: resolve(
    __dirname,
    "./fixtures/react-router-directory-routes/routes",
  ),
  searchIndex: resolve(
    __dirname,
    "./fixtures/react-router-directory-routes/mock-data/search-index.json",
  ),
}

describe("QUI Docs Plugin", () => {
  test("React Router directory routes Search Indexer", () => {
    const files = sync(`${filePaths.routesDir}/**/*.{mdx,tsx}`)
    const indexer = new SearchIndexer({
      navConfig: [
        {
          id: "_index",
          title: "Introduction",
        },
        {
          children: [
            {
              id: "markdown",
            },
            {
              id: "page-setup",
            },
            {
              children: [
                {
                  id: "deep-topic",
                },
              ],
              expanded: true,
              id: "advanced",
              title: "Advanced",
            },
            {
              id: "redirect",
              title: "Redirect",
            },
          ],
          expanded: true,
          id: "guide",
          title: "Guide",
        },
        {
          children: [
            {
              id: "page-frontmatter",
            },
          ],
          id: "api",
          title: "API",
        },
      ],
      pageDirectory: "routes",
      routingStrategy: "react-router-directory-groups",
      srcDir: resolve(__dirname, "./fixtures/react-router-directory-routes"),
      throwOnError: true,
    })

    indexer.buildIndex(files)

    const navItems = JSON.parse(JSON.stringify(indexer.navItems))
    const pageMap = JSON.parse(JSON.stringify(indexer.pageMap))
    const searchIndex = JSON.parse(JSON.stringify(indexer.searchIndex))

    if (import.meta.env.UPDATE_SNAPSHOTS) {
      updateMocks(indexer)
    }

    expect(navItems).deep.eq(readJsonSync(filePaths.navItems))
    expect(pageMap).deep.eq(readJsonSync(filePaths.pageMap))
    expect(searchIndex).deep.eq(readJsonSync(filePaths.searchIndex))
  })
})

function updateMocks(indexer: SearchIndexer) {
  writeJsonSync(filePaths.navItems, indexer.navItems)
  writeJsonSync(filePaths.pageMap, indexer.pageMap)
  writeJsonSync(filePaths.searchIndex, indexer.searchIndex)
}
