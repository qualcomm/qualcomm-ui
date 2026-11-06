import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {removeOpenWebUi, transformQuiDocsConfig} from "../remove-open-web-ui.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const configFiles = readdirSync(dirs.original).filter((file) =>
  file.endsWith(".config.ts"),
)

function readMocks(file: string) {
  return {
    expected: readFileSync(resolve(dirs.expected, file), "utf-8"),
    original: readFileSync(resolve(dirs.original, file), "utf-8"),
  }
}

describe("transformQuiDocsConfig", () => {
  test.each(configFiles)("%s", (file) => {
    const {expected, original} = readMocks(file)
    const result = transformQuiDocsConfig(original)
    expect(result.content).toBe(expected)
    expect(result.status).toBe("updated")
  })

  test.each(configFiles)("is idempotent: %s", (file) => {
    const {original} = readMocks(file)
    const once = transformQuiDocsConfig(original)
    const twice = transformQuiDocsConfig(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("removes integrations from a knowledge config in a variable", () => {
    const content = [
      "const knowledge = {",
      '  baseUrl: "https://example.com",',
      '  integrations: {openWebUi: [{id: "prod"}]},',
      "}",
      "",
      "export default {knowledge}",
      "",
    ].join("\n")
    expect(transformQuiDocsConfig(content).content).toBe(
      [
        "const knowledge = {",
        '  baseUrl: "https://example.com",',
        "}",
        "",
        "export default {knowledge}",
        "",
      ].join("\n"),
    )
  })

  test("leaves unrelated integrations properties alone", () => {
    const content = `export default {navConfig: [{id: "integrations"}], other: {integrations: []}}\n`
    expect(transformQuiDocsConfig(content)).toEqual({
      content,
      manual: [],
      removed: [],
      status: "unchanged",
    })
  })

  test("reports integrations that aren't an object literal", () => {
    const content = [
      "const integrations = {openWebUi: []}",
      "export default {knowledge: {integrations}}",
      "",
    ].join("\n")
    const result = transformQuiDocsConfig(content)
    expect(result.status).toBe("conflict")
    expect(result.manual).toEqual(["remove knowledge.integrations (line 2)"])
    expect(result.content).toBe(content)
  })

  test("reports references to the OpenWebUiIntegration type", () => {
    const content = [
      'import type {OpenWebUiIntegration} from "@qualcomm-ui/mdx-vite"',
      "",
      'const integrations: OpenWebUiIntegration[] = [{id: "prod"}]',
      "",
    ].join("\n")
    const result = transformQuiDocsConfig(content)
    expect(result.status).toBe("conflict")
    expect(result.manual).toEqual([
      "remove references to the OpenWebUiIntegration type (line 1)",
    ])
  })
})

describe("removeOpenWebUi codemod", () => {
  let cwd: string

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "qui-codemod-"))
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  function write(path: string, content: string) {
    mkdirSync(dirname(join(cwd, path)), {recursive: true})
    writeFileSync(join(cwd, path), content, "utf-8")
  }

  const config = `export default {knowledge: {integrations: {openWebUi: [{id: "prod"}]}, outputPath: "exports"}}\n`
  test("updates the config", async () => {
    write("src/qui-docs.config.ts", config)

    const results = await removeOpenWebUi.run({cwd, dryRun: false})

    expect(results.map(({message, status}) => ({message, status}))).toEqual([
      {message: "removed knowledge.integrations", status: "updated"},
    ])
    expect(readFileSync(join(cwd, "src/qui-docs.config.ts"), "utf-8")).toBe(
      `export default {knowledge: {outputPath: "exports"}}\n`,
    )
  })

  test("doesn't touch package.json", async () => {
    const packageJson = `{"scripts": {"upload": "qui-mdx-vite upload-knowledge"}}\n`
    write("qui-docs.config.ts", config)
    write("package.json", packageJson)

    await removeOpenWebUi.run({cwd, dryRun: false})

    expect(readFileSync(join(cwd, "package.json"), "utf-8")).toBe(packageJson)
  })

  test("doesn't write files in a dry run", async () => {
    write("qui-docs.config.ts", config)

    const results = await removeOpenWebUi.run({cwd, dryRun: true})

    expect(results.map(({message}) => message)).toEqual([
      "would remove knowledge.integrations",
    ])
    expect(readFileSync(join(cwd, "qui-docs.config.ts"), "utf-8")).toBe(config)
  })

  test("reports nothing when there is no Open WebUI usage", async () => {
    write("qui-docs.config.ts", "export default {}\n")

    expect(await removeOpenWebUi.run({cwd, dryRun: false})).toEqual([])
  })
})
