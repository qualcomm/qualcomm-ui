import {readdirSync, readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {transformMeasurementTokens} from "../measurement-tokens.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const files = readdirSync(dirs.original)

describe("measurement-tokens", () => {
  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformMeasurementTokens(original).content).toBe(expected)
    })
  }

  test.each(files)("is idempotent: %s", (file) => {
    const original = readFileSync(resolve(dirs.original, file), "utf-8")
    const once = transformMeasurementTokens(original)
    const twice = transformMeasurementTokens(once.content, {ambiguous: "keep"})
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("renames each token once, from its legacy value", () => {
    const content = `a { padding: var(--spacing-40) var(--spacing-100) var(--spacing-10); width: var(--sizing-30); }\n`
    expect(transformMeasurementTokens(content)).toEqual({
      content: `a { padding: var(--spacing-100) var(--spacing-400) var(--spacing-25); width: var(--sizing-100); }\n`,
      manual: [],
      renamed: 4,
      status: "updated",
    })
  })

  test("doesn't count steps that keep their name", () => {
    const content = `a { margin: var(--spacing-0) var(--spacing-40); }\n`
    expect(transformMeasurementTokens(content)).toMatchObject({
      content: `a { margin: var(--spacing-0) var(--spacing-100); }\n`,
      renamed: 1,
    })
  })

  test("renames ambiguous steps unless told to keep them", () => {
    const content = `a { gap: var(--spacing-100); width: var(--sizing-200); }\n`
    expect(transformMeasurementTokens(content).content).toBe(
      `a { gap: var(--spacing-400); width: var(--sizing-4000); }\n`,
    )
    expect(
      transformMeasurementTokens(content, {ambiguous: "keep"}),
    ).toMatchObject({content, status: "unchanged"})
  })

  test("accepts an ambiguous mode per scale", () => {
    const content = `a { gap: var(--spacing-100); width: var(--sizing-200); }\n`
    expect(
      transformMeasurementTokens(content, {ambiguous: {sizing: "keep"}})
        .content,
    ).toBe(`a { gap: var(--spacing-400); width: var(--sizing-200); }\n`)
  })

  test("keeps ambiguous steps in files that use new steps", () => {
    const content = `a { gap: var(--spacing-100) var(--spacing-25); }\n`
    expect(transformMeasurementTokens(content)).toMatchObject({
      content,
      status: "unchanged",
    })
  })

  test("reports files that mix legacy, new, and ambiguous steps", () => {
    const content = `a { gap: var(--spacing-40) var(--spacing-25) var(--spacing-100); width: var(--sizing-30); }\n`
    expect(transformMeasurementTokens(content)).toEqual({
      content: `a { gap: var(--spacing-40) var(--spacing-25) var(--spacing-100); width: var(--sizing-100); }\n`,
      manual: [
        "the spacing tokens mix legacy and new steps, rename any legacy tokens: --spacing-40 → --spacing-100, --spacing-100 → --spacing-400",
      ],
      renamed: 1,
      status: "conflict",
    })
  })

  test("renames legacy-only steps in files that also use new steps", () => {
    const content = `a { gap: var(--spacing-40) var(--spacing-25); }\n`
    expect(transformMeasurementTokens(content).content).toBe(
      `a { gap: var(--spacing-100) var(--spacing-25); }\n`,
    )
  })

  test("renames border radius names next to new steps", () => {
    const content = `a { border-radius: var(--border-radius-md) var(--border-radius-100); }\n`
    expect(transformMeasurementTokens(content).content).toBe(
      `a { border-radius: var(--border-radius-100) var(--border-radius-100); }\n`,
    )
  })

  test("only matches whole variable names", () => {
    const content = `a { gap: var(--my-spacing-40) var(--spacing-qds-40) var(--spacing-35) var(--sizing-xl); }\n`
    expect(transformMeasurementTokens(content)).toMatchObject({
      content,
      renamed: 0,
    })
  })

  test("skips files without tokens", () => {
    const content = `a { gap: 4px; }\n`
    expect(transformMeasurementTokens(content)).toEqual({
      content,
      manual: [],
      renamed: 0,
      status: "skipped",
    })
  })
})
