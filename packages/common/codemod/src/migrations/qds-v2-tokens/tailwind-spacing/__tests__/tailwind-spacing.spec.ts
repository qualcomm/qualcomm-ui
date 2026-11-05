import {readdirSync, readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {transformTailwindSpacing} from "../tailwind-spacing.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const files = readdirSync(dirs.original)

describe("tailwind-spacing", () => {
  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformTailwindSpacing(original).content).toBe(expected)
    })
  }

  test.each(files)("is idempotent: %s", (file) => {
    const original = readFileSync(resolve(dirs.original, file), "utf-8")
    const once = transformTailwindSpacing(original)
    const twice = transformTailwindSpacing(once.content, {ambiguous: "keep"})
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("renames each utility once, from its legacy value", () => {
    const content = `<div class="p-qds-40 m-qds-100 gap-qds-10"></div>\n`
    expect(transformTailwindSpacing(content).content).toBe(
      `<div class="p-qds-100 m-qds-400 gap-qds-25"></div>\n`,
    )
  })

  test("leaves border radius utilities and variables alone", () => {
    const content = `<div class="rounded-md rounded-t-lg rounded-rounded [border-radius:var(--radius-xl)]"></div>\n`
    expect(transformTailwindSpacing(content)).toEqual({
      content,
      manual: [],
      renamed: 0,
      status: "skipped",
    })
  })

  test("leaves CSS variables to the measurement tokens codemod", () => {
    const content = `<div class="w-[var(--spacing-40)]"></div>\n`
    expect(transformTailwindSpacing(content)).toMatchObject({
      content,
      status: "skipped",
    })
  })

  test("only matches whole utilities", () => {
    const content = `<div class="p-qds-35 p-qds-40px qds-40"></div>\n`
    expect(transformTailwindSpacing(content)).toMatchObject({
      content,
      renamed: 0,
    })
  })
})
