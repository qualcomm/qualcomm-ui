// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, readFile, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test} from "vitest"

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
})

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"))
}
