// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, readFile, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test} from "vitest"

import type {KnowledgeSections} from "@qualcomm-ui/mdx-common"

import {PluginState} from "../plugin-state.js"

let temporaryDirectory: string | undefined

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, {force: true, recursive: true})
    temporaryDirectory = undefined
  }
})

describe("PluginState knowledge exports", () => {
  test("writes configured page and section filenames below the knowledge output directory", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-knowledge-output-"))
    const routeDirectory = join(temporaryDirectory, "routes")
    const publicDirectory = join(temporaryDirectory, "site-public")
    await mkdir(routeDirectory, {recursive: true})
    await writeFile(
      join(routeDirectory, "guide.mdx"),
      "# Guide\n\n## Routing\n\nConfigure routes.",
      "utf8",
    )

    const state = new PluginState()
    state.docPropsFilePath = ""
    state.knowledgeConfig = {
      outputPath: "knowledge",
      pages: {outputPath: "data/pages-output.json"},
      sections: {outputPath: "data/sections-output.json"},
    }
    state.routesDir = routeDirectory

    await state.generateKnowledge(publicDirectory)

    const outputDirectory = join(publicDirectory, "knowledge", "data")
    const [pages, sections] = await Promise.all([
      readJson(join(outputDirectory, "pages-output.json")),
      readJson(join(outputDirectory, "sections-output.json")),
    ])

    expect(pages).toMatchObject({totalPages: 1})
    expect(sections).toMatchObject({totalSections: 1})
  })

  test("marks sections excluded by resolved page search metadata", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-knowledge-output-"))
    const routeDirectory = join(temporaryDirectory, "routes")
    const publicDirectory = join(temporaryDirectory, "site-public")
    await mkdir(routeDirectory, {recursive: true})
    await Promise.all([
      writeRoute(routeDirectory, "hidden-by-frontmatter", "hidden: true"),
      writeRoute(routeDirectory, "hidden-by-nav"),
      writeRoute(routeDirectory, "hidden-from-search", "hideFromSearch: true"),
      writeRoute(routeDirectory, "visible-by-nav", "hidden: true"),
      writeRoute(routeDirectory, "visible"),
    ])

    const state = new PluginState()
    state.init(temporaryDirectory)
    state.createIndexer({
      appDirectory: temporaryDirectory,
      filePath: join(temporaryDirectory, "qui-docs.config.ts"),
      knowledge: {outputPath: "knowledge"},
      navConfig: [
        {hidden: true, id: "hidden-by-nav"},
        {hidden: false, id: "visible-by-nav"},
      ],
      pageDirectory: "routes",
      routingStrategy: "react-router-directory-groups",
    })
    state.buildIndex(false)

    await state.generateKnowledge(publicDirectory)

    const sections = (await readJson(
      join(publicDirectory, "knowledge", "sections.json"),
    )) as KnowledgeSections
    const sectionsByPathname = Map.groupBy(
      sections.sections,
      (section) => section.pathname,
    )

    expect(sectionsByPathname.get("/hidden-by-frontmatter")).toEqual([
      expect.objectContaining({excludeFromSearch: true}),
    ])
    expect(sectionsByPathname.get("/hidden-by-nav")).toEqual([
      expect.objectContaining({excludeFromSearch: true}),
    ])
    expect(sectionsByPathname.get("/hidden-from-search")).toEqual([
      expect.objectContaining({excludeFromSearch: true}),
    ])
    expect(sectionsByPathname.get("/visible-by-nav")).toEqual([
      expect.not.objectContaining({excludeFromSearch: true}),
    ])
    expect(sectionsByPathname.get("/visible")).toEqual([
      expect.not.objectContaining({excludeFromSearch: true}),
    ])
  })
})

async function writeRoute(
  routeDirectory: string,
  name: string,
  frontmatter?: string,
): Promise<void> {
  const metadata = frontmatter
    ? `---\ntitle: ${name}\n${frontmatter}\n---\n\n`
    : `---\ntitle: ${name}\n---\n\n`
  await writeFile(
    join(routeDirectory, `${name}.mdx`),
    `${metadata}# {frontmatter.title}\n\nPage content.`,
    "utf8",
  )
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"))
}
