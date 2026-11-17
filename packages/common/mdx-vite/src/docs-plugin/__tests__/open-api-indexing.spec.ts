// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test, vi} from "vitest"

import {PluginState} from "../plugin-state.js"

const spec = {
  info: {title: "Pets", version: "1.0.0"},
  openapi: "3.1.0",
  paths: {
    "/pets": {get: {operationId: "listPets", summary: "List pets"}},
    "/pets/{petId}": {
      delete: {
        description: "Removes the pet **for good**.\n\nThis cannot be undone.",
        parameters: [
          {in: "path", name: "petId", required: true},
          {$ref: "./common.json#/components/parameters/Limit"},
        ],
      },
    },
  },
}

let temporaryDirectory: string | undefined

afterEach(async () => {
  vi.unstubAllEnvs()
  if (temporaryDirectory) {
    await rm(temporaryDirectory, {force: true, recursive: true})
    temporaryDirectory = undefined
  }
})

async function indexApiPage(
  apiFrontmatter = "",
  specContents: string | null = JSON.stringify(spec),
  knowledge: {exclude?: string[]} = {},
) {
  temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-openapi-index-"))
  const routeDirectory = join(temporaryDirectory, "routes")
  await mkdir(routeDirectory, {recursive: true})
  if (specContents !== null) {
    await writeFile(join(routeDirectory, "pets.json"), specContents)
  }
  await writeFile(
    join(routeDirectory, "api.mdx"),
    `---\ntitle: Pets API\nopenApi: ./pets.json\n${apiFrontmatter}---\n\n# Pets API\n`,
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
    knowledge: {baseUrl: "https://docs.example.com", ...knowledge},
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
  await state.generateKnowledge(join(temporaryDirectory, "public"))
  return {...state.siteData, sections: state.sections?.sections ?? [], state}
}

describe("OpenAPI page indexing", () => {
  test("keeps API pages out of the global nav", async () => {
    const {navItems, openApiNav, pageMap} = await indexApiPage()
    expect(navItems.map((item) => item.pathname)).toEqual(["/guide"])
    expect(Object.keys(openApiNav ?? {})).toEqual(["/api"])
    expect(pageMap["/api"]?.title).toBe("Pets API")
    expect(pageMap["/api/listPets"]?.title).toBe("List pets")
  })

  test("adds a knowledge section per operation", async () => {
    const {sections} = await indexApiPage()
    const operations = sections.filter((section) =>
      section.pathname?.startsWith("/api/"),
    )
    expect(operations).toMatchObject([
      {
        headerPath: ["Pets API", "List pets"],
        pathname: "/api/listPets",
        searchText: "",
        sectionId: "api/listPets",
        terms: ["GET /pets", "listPets"],
        url: "https://docs.example.com/api/listPets",
      },
      {
        headerPath: ["Pets API", "/pets/{petId}"],
        pathname: "/api/pets-petid-delete",
        rawContent: "Removes the pet **for good**.\n\nThis cannot be undone.",
        searchText: "Removes the pet for good.\n\nThis cannot be undone.",
        terms: ["DELETE /pets/{petId}", "petId"],
      },
    ])
    expect(operations[0].excludeFromSearch).toBeUndefined()
  })

  test.each(["hidden", "hideFromSearch"])(
    "operations inherit the intro page's %s flag",
    async (flag) => {
      const {pageMap, sections} = await indexApiPage(`${flag}: true\n`)
      const operations = sections.filter((section) =>
        section.pathname?.startsWith("/api/"),
      )
      expect(operations).toHaveLength(2)
      expect(operations.every((section) => section.excludeFromSearch)).toBe(
        true,
      )
      expect(pageMap["/api/listPets"]).toMatchObject({[flag]: true})
    },
  )

  test("leaves operations out of the knowledge export with their API", async () => {
    const {sections} = await indexApiPage("", JSON.stringify(spec), {
      exclude: ["api.mdx"],
    })
    expect(
      sections.filter((section) => section.pathname?.startsWith("/api")),
    ).toEqual([])
  })

  test("adds a legacy search entry per operation", async () => {
    const {searchIndex} = await indexApiPage()
    const operations = searchIndex.filter((section) =>
      section.pathname.startsWith("/api/"),
    )
    expect(operations).toMatchObject([
      {
        heading: "List pets",
        href: "/api/listPets",
        id: "/routes/api.mdx#listPets",
        title: "Pets API",
      },
      {
        content: "Removes the pet for good.\n\nThis cannot be undone.",
        heading: "/pets/{petId}",
        href: "/api/pets-petid-delete",
      },
    ])
    expect(operations[0].content).toBeUndefined()
  })

  test("leaves operations out of the legacy index with their API", async () => {
    const {searchIndex} = await indexApiPage("hideFromSearch: true\n")
    expect(
      searchIndex.filter((section) => section.pathname.startsWith("/api")),
    ).toEqual([])
  })

  test.each([
    ["invalid JSON", "{", "routes/pets.json is not valid JSON"],
    ["a non-OpenAPI document", "{}", 'it has no "openapi" or "swagger" field'],
  ])("fails the build on %s", async (_, contents, reason) => {
    await expect(indexApiPage("", contents)).rejects.toThrow(
      /Failed to load the OpenAPI spec "\.\/pets\.json" of .*api\.mdx/,
    )
    await expect(indexApiPage("", contents)).rejects.toThrow(reason)
  })

  test("keeps the intro page in dev when the spec is missing", async () => {
    vi.stubEnv("NODE_ENV", "development")
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const {openApiNav, pageMap, state} = await indexApiPage("", null)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("File not found:"),
    )
    expect(openApiNav?.["/api"]?.map((item) => item.pathname)).toEqual(["/api"])
    expect(pageMap["/api"]?.title).toBe("Pets API")
    expect([...state.indexer.openApiSpecFiles]).toEqual([
      expect.stringMatching(/\/routes\/pets\.json$/),
    ])
    warn.mockRestore()
  })
})
