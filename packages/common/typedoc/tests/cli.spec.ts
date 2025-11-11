import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import type {BuildOptions} from "../src"
import {resolveConfig} from "../src/internal"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const jsonConfigFixture = resolve(__dirname, "./fixtures/test.config.json")
const jsConfigFixture = resolve(__dirname, "./fixtures/test.config.js")
const tsConfigFixture = resolve(__dirname, "./fixtures/qui-test.config.ts")

const testConfig: BuildOptions = {
  apiFile: "./temp/api.json",
  outputFile: "./temp/doc-props.json",
  typedocOptions: {
    entryPoints: [
      "./src/package1/index.ts",
      "./src/package2/index.ts",
      "./src/package3/index.ts",
    ],
    tsconfig: "tsconfig.typedoc.json",
  },
}

describe("config loader", () => {
  test("reads a json config file", async () => {
    const config = await resolveConfig(jsonConfigFixture)
    expect(config).deep.eq(testConfig)
  })

  test("reads a js config file", async () => {
    const config = await resolveConfig(jsConfigFixture)
    expect(config).deep.eq(testConfig)
  })

  test("reads a ts config file", async () => {
    const config = await resolveConfig(tsConfigFixture)
    expect(config).deep.eq(testConfig)
  })
})
