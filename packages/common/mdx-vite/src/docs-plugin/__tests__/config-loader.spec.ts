// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdtempSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

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
})
