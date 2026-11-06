// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test} from "vitest"

import {PluginState} from "../plugin-state.js"

const spec = {
  info: {title: "Pets", version: "1.0.0"},
  openapi: "3.1.0",
  paths: {
    "/pets": {get: {operationId: "listPets", summary: "List pets"}},
  },
}

let temporaryDirectory: string | undefined

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, {force: true, recursive: true})
    temporaryDirectory = undefined
  }
})

async function indexApiPage() {
  temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-openapi-index-"))
  const routeDirectory = join(temporaryDirectory, "routes")
  await mkdir(routeDirectory, {recursive: true})
  await writeFile(join(routeDirectory, "pets.json"), JSON.stringify(spec))
  await writeFile(
    join(routeDirectory, "api.mdx"),
    "---\ntitle: Pets API\nopenApi: ./pets.json\n---\n\n# Pets API\n",
  )
  await writeFile(
    join(routeDirectory, "guide.mdx"),
    "---\ntitle: Guide\n---\n\n# Guide\n",
  )

  const state = new PluginState()
  state.init(temporaryDirectory)
  state.createIndexer({
    appDirectory: temporaryDirectory,
    configuredLint: {},
    filePath: join(temporaryDirectory, "qui-docs.config.ts"),
    lint: {
      brokenLinks: "warn",
      configs: "warn",
      fileLinks: "off",
      pageTitle: "warn",
    },
    pageDirectory: "routes",
    unrecognizedConfigKeys: {
      filePath: join(temporaryDirectory, "qui-docs.config.ts"),
      messages: [],
    },
  })
  await state.buildIndex(false)
  return state.siteData
}

describe("OpenAPI page indexing", () => {
  test("keeps API pages out of the global nav", async () => {
    const {navItems, openApiNav, pageMap} = await indexApiPage()
    expect(navItems.map((item) => item.pathname)).toEqual(["/guide"])
    expect(Object.keys(openApiNav ?? {})).toEqual(["/api"])
    expect(pageMap["/api"]?.title).toBe("Pets API")
    expect(pageMap["/api/listPets"]?.title).toBe("List pets")
  })
})
