import {sync} from "glob"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test, vi} from "vitest"

vi.mock("node:child_process", () => ({
  execSync: () => "",
}))

import {SearchIndexer} from "../search-indexer"

import {readJsonSync, writeJsonSync} from "./utils"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePaths = {
  navItems: resolve(
    __dirname,
    "./fixtures/edge-cases/side-nav-title/mock-data/nav-items.json",
  ),
  pageMap: resolve(
    __dirname,
    "./fixtures/edge-cases/side-nav-title/mock-data/page-map.json",
  ),
  routesDir: resolve(__dirname, "./fixtures/edge-cases/side-nav-title/routes"),
  searchIndex: resolve(
    __dirname,
    "./fixtures/edge-cases/side-nav-title/mock-data/search-index.json",
  ),
}

describe("MDX Docs Plugin", () => {
  test("Edge Cases: Side Nav Title", () => {
    const mdxFiles = sync(`${filePaths.routesDir}/**/*.mdx`)
    const indexer = new SearchIndexer({
      navConfig: [],
      pageDirectory: "routes",
      srcDir: resolve(__dirname, "./fixtures/edge-cases/side-nav-title"),
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
