// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import {resolveLintOptions} from "../config"
import {
  type LintPagesOptions,
  lintPages,
  resolveLintCommandRules,
} from "../lint-pages"

let tempDir: string

function writeFile(path: string, contents: string): void {
  const filePath = join(tempDir, path)
  mkdirSync(dirname(filePath), {recursive: true})
  writeFileSync(filePath, contents, "utf-8")
}

function writeConfig(config: Record<string, unknown> = {}): string {
  writeFile(
    "qui-docs.config.js",
    `module.exports = ${JSON.stringify({navConfig: [], ...config})}`,
  )
  return join(tempDir, "qui-docs.config.js")
}

async function lint(
  config: Record<string, unknown> = {},
  options: Omit<LintPagesOptions, "configFile" | "cwd"> = {},
) {
  const configFile = writeConfig(config)
  const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
  const result = await lintPages({configFile, cwd: tempDir, ...options})
  return {output: debugSpy.mock.calls.flat().join("\n"), result}
}

const brokenPage = "Intro.\n\n[Missing](missing.mdx)"

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "qui-docs-lint-test-"))
  writeFile("app/routes/index.mdx", "# Home\n\n[Guide](guide.mdx)")
  writeFile("app/routes/guide.mdx", "# Guide\n\n## Setup")
})

afterEach(() => {
  vi.restoreAllMocks()
  rmSync(tempDir, {force: true, recursive: true})
})

describe("lintPages", () => {
  test("reports no issues for valid pages", async () => {
    const {result} = await lint()

    expect(result).toEqual({
      configFile: join(tempDir, "qui-docs.config.js"),
      disabledRules: [{rule: "fileLinks", source: "default"}],
      errorCount: 0,
      navFileCount: 0,
      pageCount: 2,
      warningCount: 0,
    })
  })

  test("reports issues as errors by default", async () => {
    writeFile("app/routes/broken.mdx", brokenPage)

    const {output, result} = await lint()

    expect(result.errorCount).toBe(2)
    expect(result.warningCount).toBe(0)
    expect(output).toContain("Found 1 broken link")
    expect(output).toContain("Found 1 page title issue")
  })

  test("reports issues as errors for rules set to warn in the config", async () => {
    writeFile("app/routes/broken.mdx", brokenPage)

    const {result} = await lint({
      lint: {brokenLinks: "warn", pageTitle: "warn"},
    })

    expect(result.errorCount).toBe(2)
  })

  test("reports URL-path links to MDX pages when fileLinks is enabled", async () => {
    writeFile("app/routes/index.mdx", "# Home\n\n[Guide](/guide)")

    const {output, result} = await lint({lint: {fileLinks: "warn"}})

    expect(result.errorCount).toBe(1)
    expect(output).toContain("should use a relative .mdx file path")
  })

  test("skips and reports rules turned off in the config", async () => {
    writeFile("app/routes/broken.mdx", brokenPage)

    const {output, result} = await lint({
      lint: {brokenLinks: "off", fileLinks: "warn", pageTitle: "off"},
    })

    expect(result).toEqual({
      configFile: join(tempDir, "qui-docs.config.js"),
      disabledRules: [
        {rule: "brokenLinks", source: "config"},
        {rule: "pageTitle", source: "config"},
      ],
      errorCount: 0,
      navFileCount: 0,
      pageCount: 3,
      warningCount: 0,
    })
    expect(output).not.toContain("broken link")
  })

  test("reports issues as warnings with warn", async () => {
    writeFile("app/routes/broken.mdx", brokenPage)

    const {result} = await lint({}, {warn: true})

    expect(result.errorCount).toBe(0)
    expect(result.warningCount).toBe(2)
  })

  test("applies per-rule options over the config", async () => {
    writeFile("app/routes/broken.mdx", brokenPage)

    const {result} = await lint(
      {lint: {brokenLinks: "off"}},
      {rules: {brokenLinks: "error", pageTitle: "off"}},
    )

    expect(result.errorCount).toBe(1)
    expect(result.disabledRules).toEqual([
      {rule: "fileLinks", source: "default"},
      {rule: "pageTitle", source: "option"},
    ])
  })

  test("reports invalid _nav.json files as errors with warn", async () => {
    writeFile("app/routes/docs/_nav.json", JSON.stringify({titel: "Docs"}))
    writeFile("app/routes/docs/intro.mdx", "# Intro")

    const {output, result} = await lint({}, {warn: true})

    expect(result.errorCount).toBe(1)
    expect(output).toContain(`Unrecognized key: "titel"`)
  })

  test("validates fragments against page headings", async () => {
    writeFile(
      "app/routes/index.mdx",
      "# Home\n\n[Setup](guide.mdx#setup) [Missing](guide.mdx#missing)",
    )

    const {output, result} = await lint()

    expect(result.errorCount).toBe(1)
    expect(output).toContain('fragment "#missing" not found')
  })

  test("accepts links to files in the public directory", async () => {
    writeFile("app/routes/index.mdx", "# Home\n\n[Logo](/logo.svg)")
    writeFile("public/logo.svg", "<svg />")

    const {result} = await lint()

    expect(result.errorCount).toBe(0)
  })

  test("resolves the app directory from the config", async () => {
    writeFile("src/routes/index.mdx", brokenPage)

    const {result} = await lint({appDirectory: "src"})

    expect(result.pageCount).toBe(1)
    expect(result.errorCount).toBe(2)
  })
})

describe("lintPages config validation", () => {
  test("stops before checking pages when the config has invalid values", async () => {
    const {output, result} = await lint({lint: {pageTitle: "fatal"}})

    expect(result).toEqual({
      configFile: join(tempDir, "qui-docs.config.js"),
      disabledRules: [],
      errorCount: 1,
      navFileCount: 0,
      pageCount: 0,
      warningCount: 0,
    })
    expect(output).toContain("Found 1 invalid config value")
    expect(output).toContain("lint.pageTitle: ")
  })

  test("reports unrecognized config keys under the config file", async () => {
    const {output, result} = await lint({titel: "Docs"})

    expect(result.errorCount).toBe(1)
    expect(output).toContain("Found 1 config issue")
    expect(output).toContain("qui-docs.config.js")
    expect(output).toContain(`Unrecognized key: "titel"`)
  })

  test("reports navConfig ids that don't match a page or folder", async () => {
    const {output, result} = await lint({
      navConfig: [{id: "guide"}, {children: [{id: "nested"}], id: "missing"}],
    })

    expect(result.errorCount).toBe(1)
    expect(output).toContain(
      `navConfig[1].id: "missing" doesn't match a page or folder (/missing)`,
    )
    expect(output).not.toContain("nested")
  })

  test("reports _nav.json children that don't match a page", async () => {
    writeFile("app/routes/docs+/intro.mdx", "# Intro")
    writeFile(
      "app/routes/docs+/_nav.json",
      JSON.stringify({children: [{id: "intro"}, {id: "gone"}]}),
    )

    const {output, result} = await lint()

    expect(result.navFileCount).toBe(1)
    expect(result.errorCount).toBe(1)
    expect(output).toContain("docs+/_nav.json")
    expect(output).toContain(
      `children[1].id: "gone" doesn't match a page or folder (/docs/gone)`,
    )
  })

  test("accepts ids of folders and .tsx pages", async () => {
    writeFile("app/routes/docs+/intro.mdx", "# Intro")
    writeFile(
      "app/routes/playground.tsx",
      "export default function Playground() {\n  return null\n}\n",
    )

    const {output, result} = await lint({
      navConfig: [{id: "docs"}, {id: "playground"}],
    })

    expect(result.errorCount).toBe(0)
    expect(output).not.toContain("config issue")
  })

  test("reports config issues as warnings with warn", async () => {
    const {result} = await lint({titel: "Docs"}, {warn: true})

    expect(result.errorCount).toBe(0)
    expect(result.warningCount).toBe(1)
  })

  test("skips config issues when configs is turned off", async () => {
    const {output, result} = await lint(
      {navConfig: [{id: "missing"}], titel: "Docs"},
      {rules: {configs: "off"}},
    )

    expect(result.disabledRules).toContainEqual({
      rule: "configs",
      source: "option",
    })
    expect(result.errorCount).toBe(0)
    expect(output).not.toContain("config issue")
  })
})

describe("resolveLintCommandRules", () => {
  const defaults = resolveLintOptions({lint: {fileLinks: "warn"}})

  test("keeps fileLinks off by default", () => {
    expect(resolveLintCommandRules({})).toEqual({
      disabledRules: [{rule: "fileLinks", source: "default"}],
      lint: {
        brokenLinks: "error",
        configs: "error",
        fileLinks: "off",
        pageTitle: "error",
      },
    })
  })

  test("promotes every enabled rule to error", () => {
    expect(resolveLintCommandRules(defaults).lint).toEqual({
      brokenLinks: "error",
      configs: "error",
      fileLinks: "error",
      pageTitle: "error",
    })
  })

  test("uses warn for enabled rules with warn", () => {
    expect(resolveLintCommandRules(defaults, {warn: true}).lint).toEqual({
      brokenLinks: "warn",
      configs: "warn",
      fileLinks: "warn",
      pageTitle: "warn",
    })
  })

  test("keeps rules turned off in the config off", () => {
    expect(
      resolveLintCommandRules({...defaults, fileLinks: "off"}, {warn: true}),
    ).toEqual({
      disabledRules: [{rule: "fileLinks", source: "config"}],
      lint: {
        brokenLinks: "warn",
        configs: "warn",
        fileLinks: "off",
        pageTitle: "warn",
      },
    })
  })

  test("prefers per-rule options over the config and warn", () => {
    expect(
      resolveLintCommandRules(
        {...defaults, fileLinks: "off"},
        {rules: {fileLinks: "error", pageTitle: "off"}, warn: true},
      ),
    ).toEqual({
      disabledRules: [{rule: "pageTitle", source: "option"}],
      lint: {
        brokenLinks: "warn",
        configs: "warn",
        fileLinks: "error",
        pageTitle: "off",
      },
    })
  })
})
