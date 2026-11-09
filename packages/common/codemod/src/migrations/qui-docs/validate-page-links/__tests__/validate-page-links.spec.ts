import {mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {
  transformValidatePageLinks,
  validatePageLinks,
} from "../validate-page-links.js"

function transform(lines: string[]) {
  return transformValidatePageLinks(lines.join("\n"))
}

describe("transformValidatePageLinks", () => {
  test("replaces false with lint.brokenLinks off", () => {
    const result = transform([
      "export default {",
      '  appDirectory: "src",',
      "  validatePageLinks: false,",
      "}",
    ])
    expect(result.content).toBe(
      [
        "export default {",
        '  appDirectory: "src",',
        '  lint: {brokenLinks: "off"},',
        "}",
      ].join("\n"),
    )
    expect(result.status).toBe("updated")
  })

  test("removes true, which was the default", () => {
    const result = transform([
      "export default {",
      '  appDirectory: "src",',
      "  validatePageLinks: true,",
      '  pageDirectory: "routes",',
      "}",
    ])
    expect(result.content).toBe(
      [
        "export default {",
        '  appDirectory: "src",',
        '  pageDirectory: "routes",',
        "}",
      ].join("\n"),
    )
  })

  test("adds brokenLinks to an existing single-line lint object", () => {
    expect(
      transform([
        'export default {lint: {pageTitle: "error"}, validatePageLinks: false}',
      ]).content,
    ).toBe('export default {lint: {brokenLinks: "off", pageTitle: "error"}}')
  })

  test("adds brokenLinks to an existing multi-line lint object", () => {
    expect(
      transform([
        "export default {",
        "  lint: {",
        '    pageTitle: "error",',
        "  },",
        "  validatePageLinks: false,",
        "}",
      ]).content,
    ).toBe(
      [
        "export default {",
        "  lint: {",
        '    brokenLinks: "off",',
        '    pageTitle: "error",',
        "  },",
        "}",
      ].join("\n"),
    )
  })

  test("adds brokenLinks to an empty lint object", () => {
    expect(
      transform(["export default {lint: {}, validatePageLinks: false}"])
        .content,
    ).toBe('export default {lint: {brokenLinks: "off"}}')
  })

  test("keeps an explicit lint.brokenLinks, which took precedence", () => {
    const result = transform([
      "export default {",
      '  lint: {brokenLinks: "error"},',
      "  validatePageLinks: false,",
      "}",
    ])
    expect(result.content).toBe(
      ["export default {", '  lint: {brokenLinks: "error"},', "}"].join("\n"),
    )
    expect(result.changed).toEqual([
      "remove validatePageLinks: false, lint.brokenLinks is already set",
    ])
  })

  test("matches single quotes", () => {
    expect(
      transform([
        "export default {appDirectory: 'src', validatePageLinks: false}",
      ]).content,
    ).toBe("export default {appDirectory: 'src', lint: {brokenLinks: 'off'}}")
  })

  test("handles configs assigned to a variable", () => {
    expect(
      transform([
        'import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"',
        "",
        "const config: QuiDocsConfig = {validatePageLinks: false}",
        "",
        "export default config",
      ]).content,
    ).toBe(
      [
        'import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"',
        "",
        'const config: QuiDocsConfig = {lint: {brokenLinks: "off"}}',
        "",
        "export default config",
      ].join("\n"),
    )
  })

  test("reports values it can't resolve statically", () => {
    const content = "export default {validatePageLinks: !isDev}"
    const result = transformValidatePageLinks(content)
    expect(result.status).toBe("conflict")
    expect(result.manual).toEqual([
      "replace validatePageLinks (line 1) with lint.brokenLinks",
    ])
    expect(result.content).toBe(content)
  })

  test("reports a lint value that isn't an object literal", () => {
    const content = "export default {lint, validatePageLinks: false}"
    const result = transformValidatePageLinks(content)
    expect(result.status).toBe("conflict")
    expect(result.content).toBe(content)
  })

  test("is idempotent", () => {
    const once = transform([
      "export default {lint: {pageTitle: 'warn'}, validatePageLinks: false}",
    ])
    const twice = transformValidatePageLinks(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("leaves configs without validatePageLinks alone", () => {
    const content = 'export default {lint: {brokenLinks: "warn"}}'
    expect(transformValidatePageLinks(content)).toEqual({
      changed: [],
      content,
      manual: [],
      status: "unchanged",
    })
  })
})

describe("validatePageLinks codemod", () => {
  let cwd: string

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "qui-codemod-"))
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  const config = "export default {validatePageLinks: false}\n"

  test("updates the config", async () => {
    writeFileSync(join(cwd, "qui-docs.config.ts"), config, "utf-8")

    const results = await validatePageLinks.run({cwd, dryRun: false})

    expect(results.map(({message, status}) => ({message, status}))).toEqual([
      {
        message:
          'replaced validatePageLinks: false with lint: {brokenLinks: "off"}',
        status: "updated",
      },
    ])
    expect(readFileSync(join(cwd, "qui-docs.config.ts"), "utf-8")).toBe(
      'export default {lint: {brokenLinks: "off"}}\n',
    )
  })

  test("doesn't write files in a dry run", async () => {
    writeFileSync(join(cwd, "qui-docs.config.ts"), config, "utf-8")

    const results = await validatePageLinks.run({cwd, dryRun: true})

    expect(results[0].message).toBe(
      'would replace validatePageLinks: false with lint: {brokenLinks: "off"}',
    )
    expect(readFileSync(join(cwd, "qui-docs.config.ts"), "utf-8")).toBe(config)
  })
})
