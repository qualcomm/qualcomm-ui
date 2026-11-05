import {sync} from "glob"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {SearchIndexer} from "../search-indexer"

import {readJsonSync, writeJsonSync} from "./utils"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename) // get the name of the directory

const filePaths = {
  navItems: resolve(
    __dirname,
    "./fixtures/react-router-hybrid-routes/mock-data/nav-items.json",
  ),
  pageMap: resolve(
    __dirname,
    "./fixtures/react-router-hybrid-routes/mock-data/page-map.json",
  ),
  routesDir: resolve(__dirname, "./fixtures/react-router-hybrid-routes/routes"),
  searchIndex: resolve(
    __dirname,
    "./fixtures/react-router-hybrid-routes/mock-data/search-index.json",
  ),
}

describe("QUI Docs Plugin", () => {
  test("React Hybrid Routes Routes Search Indexer", () => {
    const mdxFiles = sync(`${filePaths.routesDir}/**/*.mdx`)
    const indexer = new SearchIndexer({
      navConfig: [
        {
          id: "_index",
          title: "Introduction",
        },
        {
          children: [
            {
              id: "sign-up",
            },
            {
              id: "log-in",
            },
            {
              id: "home",
            },
            {
              id: "guide",
            },
          ],
          expanded: true,
          id: "getting-started",
          title: "Getting Started",
        },
        {
          id: "best-practices",
          title: "Best Practices",
        },
      ],
      pageDirectory: "routes",
      srcDir: resolve(__dirname, "./fixtures/react-router-hybrid-routes"),
      throwOnError: true,
    })

    indexer.buildIndex(mdxFiles)

    // normalize
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
