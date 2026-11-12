// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdtempSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import {ConfigLoader} from "../config/config-loader"

let tempDir: string

function writeConfigFile(contents: string): string {
  const filePath = join(tempDir, "qui-docs.config.js")
  writeFileSync(filePath, contents, "utf-8")
  return filePath
}

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "qui-docs-config-test-"))
})

afterEach(() => {
  vi.restoreAllMocks()
  rmSync(tempDir, {force: true, recursive: true})
})

describe("ConfigLoader", () => {
  test("defaults appDirectory and pageDirectory when omitted", () => {
    const filePath = writeConfigFile(`module.exports = {}`)
    const loader = new ConfigLoader({configFile: filePath})

    const resolved = loader.loadConfig()

    expect(resolved.appDirectory).toBe("app")
    expect(resolved.pageDirectory).toBe("routes")
  })

  test("does not set routingStrategy when omitted", () => {
    const filePath = writeConfigFile(`module.exports = {}`)
    const loader = new ConfigLoader({configFile: filePath})

    const resolved = loader.loadConfig()

    expect(resolved.routingStrategy).toBeUndefined()
  })

  test("defaults lint rules when omitted", () => {
    const filePath = writeConfigFile(`module.exports = {}`)
    const loader = new ConfigLoader({configFile: filePath})

    expect(loader.loadConfig().lint).toEqual({
      brokenLinks: "warn",
      configs: "warn",
      fileLinks: "off",
      pageTitle: "warn",
    })
  })

  test("rejects unknown lint severities", () => {
    const filePath = writeConfigFile(
      `module.exports = {lint: {pageTitle: "fatal"}}`,
    )
    const loader = new ConfigLoader({configFile: filePath})

    expect(() => loader.loadConfig()).toThrow(
      /Failed to parse config file\.\n.*qui-docs\.config\.js\n {2}lint\.pageTitle: /,
    )
  })

  test("returns invalid values from lintConfig instead of throwing", () => {
    const filePath = writeConfigFile(
      `module.exports = {lint: {pageTitle: "fatal"}}`,
    )
    const loader = new ConfigLoader({configFile: filePath})

    const result = loader.lintConfig()

    expect(result.config).toBeUndefined()
    expect(result.filePath).toBe(filePath)
    expect(result.messages).toEqual([
      expect.stringMatching(/^lint\.pageTitle: /),
    ])
  })

  test("lists unrecognized keys, including keys in navConfig entries", () => {
    const filePath = writeConfigFile(
      `module.exports = {
        lint: {pageTitel: "warn"},
        navConfig: [{id: "guide", childen: []}, {sectionTitle: "API", titel: "x"}],
        titel: "Docs",
      }`,
    )
    const loader = new ConfigLoader({configFile: filePath})

    expect(loader.loadConfig().unrecognizedConfigKeys).toEqual({
      filePath,
      messages: [
        `lint: Unrecognized key: "pageTitel"`,
        `navConfig[0]: Unrecognized key: "childen"`,
        `navConfig[1]: Unrecognized key: "titel"`,
        `Unrecognized key: "titel"`,
      ],
    })
  })

  test("doesn't flag recognized or undefined keys", () => {
    const filePath = writeConfigFile(
      `module.exports = {
        hotUpdateIgnore: /\\.tmp$/,
        navConfig: [{id: "guide", children: [{id: "intro"}]}],
        pageDirectory: undefined,
        routingStrategy: "react-router-directory-groups",
      }`,
    )
    const loader = new ConfigLoader({configFile: filePath})

    expect(loader.loadConfig().unrecognizedConfigKeys.messages).toEqual([])
    expect(loader.lintConfig()).toMatchObject({messages: []})
  })
})
