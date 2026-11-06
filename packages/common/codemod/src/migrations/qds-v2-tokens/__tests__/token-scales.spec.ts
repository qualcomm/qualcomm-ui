import {readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {
  BORDER_RADIUS_SCALE,
  SIZING_SCALE,
  SPACING_SCALE,
  TAILWIND_SPACING_SCALE,
  type TokenScale,
} from "../token-scales.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const packagesDir = resolve(__dirname, "../../../../..")

const theme = readFileSync(
  resolve(packagesDir, "qds-core/src/styles/qualcomm-dark.css"),
  "utf-8",
)

const tailwindTheme = readFileSync(
  resolve(packagesDir, "tailwind-plugin/src/qui.css"),
  "utf-8",
)

function getSteps(css: string, prefix: string): string[] {
  return Array.from(
    css.matchAll(new RegExp(`^\\s*${prefix}([a-z0-9]+):`, "gm")),
    ([, step]) => step,
  )
}

const scales: [string, TokenScale, string][] = [
  ["--spacing-", SPACING_SCALE, theme],
  ["--sizing-", SIZING_SCALE, theme],
  ["--border-radius-", BORDER_RADIUS_SCALE, theme],
  ["--spacing-qds-", TAILWIND_SPACING_SCALE, tailwindTheme],
]

describe.each(scales)("%s scale", (prefix, scale, css) => {
  test("matches the steps defined by the theme", () => {
    expect([...scale.steps].sort()).toEqual(getSteps(css, prefix).sort())
  })

  test("renames every legacy step to a step of the new scale", () => {
    for (const replacement of Object.values(scale.renames)) {
      expect(scale.steps).toContain(replacement)
    }
  })
})

describe("Tailwind border radius", () => {
  test("keeps every legacy name, so utilities don't need renaming", () => {
    const names = getSteps(tailwindTheme, "--radius-")
    for (const name of Object.keys(BORDER_RADIUS_SCALE.renames)) {
      expect(names).toContain(name)
    }
  })
})
