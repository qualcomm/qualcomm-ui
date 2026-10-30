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
      pageTitle: "warn",
    })
  })

  test("maps the deprecated validatePageLinks: false to brokenLinks: off", () => {
    const filePath = writeConfigFile(
      `module.exports = {validatePageLinks: false}`,
    )
    const loader = new ConfigLoader({configFile: filePath})
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(loader.loadConfig().lint.brokenLinks).toBe("off")
    expect(warnSpy.mock.calls.flat().join("\n")).toContain(
      "`validatePageLinks` will be removed",
    )
  })

  test("prefers lint.brokenLinks over validatePageLinks", () => {
    const filePath = writeConfigFile(
      `module.exports = {lint: {brokenLinks: "error"}, validatePageLinks: false}`,
    )
    const loader = new ConfigLoader({configFile: filePath})
    vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(loader.loadConfig().lint.brokenLinks).toBe("error")
  })

  test("rejects unknown lint severities", () => {
    const filePath = writeConfigFile(
      `module.exports = {lint: {pageTitle: "fatal"}}`,
    )
    const loader = new ConfigLoader({configFile: filePath})

    vi.spyOn(console, "dir").mockImplementation(() => {})
    expect(() => loader.loadConfig()).toThrow("Failed to parse config file.")
  })
})
