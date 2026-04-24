import {writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {knownVariables} from "./known-variables"

const __dirname = dirname(fileURLToPath(import.meta.url))

const backgroundRegex = /background(?:color|[1-9])?$/i
const foregroundRegex = /foreground(?:color|[1-9])?$/i

interface ThemeExtension {
  backgrounds: string[]
  borders: string[]
  colors: string[]
  foregrounds: string[]
  opacity: string[]
  outlines: string[]
  shadows: string[]
  stroke: string[]
}

interface FontSizeDef {
  fontWeight: string
  lineHeight: string
  size: string
}

const fontSizes: Record<string, FontSizeDef> = {
  "body-1": {fontWeight: "500", lineHeight: "normal", size: "13px"},
  "body-2": {fontWeight: "500", lineHeight: "normal", size: "12px"},
  "heading-1": {fontWeight: "600", lineHeight: "normal", size: "26px"},
  "heading-2": {fontWeight: "500", lineHeight: "normal", size: "14px"},
  "heading-3": {fontWeight: "800", lineHeight: "normal", size: "13px"},
  "heading-4": {fontWeight: "700", lineHeight: "normal", size: "11px"},
  "heading-5": {fontWeight: "500", lineHeight: "normal", size: "11px"},
  "heading-6": {fontWeight: "800", lineHeight: "normal", size: "11px"},
  "label-1": {fontWeight: "500", lineHeight: "normal", size: "14px"},
  "label-2": {fontWeight: "700", lineHeight: "normal", size: "12px"},
  "label-3": {fontWeight: "500", lineHeight: "normal", size: "11px"},
  "label-4": {fontWeight: "700", lineHeight: "normal", size: "9px"},
  "markdown-1": {fontWeight: "600", lineHeight: "normal", size: "26px"},
  "markdown-2": {fontWeight: "600", lineHeight: "normal", size: "20px"},
  "markdown-3": {fontWeight: "600", lineHeight: "normal", size: "15px"},
  "markdown-4": {fontWeight: "800", lineHeight: "normal", size: "13px"},
  "markdown-5": {fontWeight: "800", lineHeight: "normal", size: "11px"},
  "markdown-6": {fontWeight: "800", lineHeight: "normal", size: "8px"},
  paragraph: {fontWeight: "500", lineHeight: "normal", size: "13px"},
}

function categorize(): ThemeExtension {
  return knownVariables.reduce(
    (acc: ThemeExtension, current) => {
      const variable = current.toLowerCase()
      if (foregroundRegex.test(variable)) {
        acc.foregrounds.push(current)
      } else if (backgroundRegex.test(variable)) {
        acc.backgrounds.push(current)
      } else if (
        variable.endsWith("border") ||
        variable.endsWith("separator")
      ) {
        acc.borders.push(current)
      } else if (variable.endsWith("stroke")) {
        acc.stroke.push(current)
      } else if (variable.endsWith("shadow")) {
        acc.shadows.push(current)
      } else if (variable.endsWith("outline")) {
        acc.outlines.push(current)
      } else if (variable.includes("opacity")) {
        acc.opacity.push(current)
      } else {
        acc.colors.push(current)
      }
      return acc
    },
    {
      backgrounds: [],
      borders: [],
      colors: [],
      foregrounds: [],
      opacity: [],
      outlines: [],
      shadows: [],
      stroke: [],
    },
  )
}

function stripPrefix(variable: string): string {
  return variable.replace("--vscode-", "")
}

function shadowName(variable: string): string {
  const parts = stripPrefix(variable).split("-")
  const last = parts[parts.length - 1]
  if (last === "shadow" || last.endsWith("Shadow")) {
    parts.pop()
  }
  return parts.join("-")
}

function generateCSS(): string {
  const categories = categorize()
  const lines: string[] = []

  lines.push(
    "/** This file was generated automatically. Do not edit it directly. */",
  )
  lines.push("/* stylelint-disable */")
  lines.push("")

  lines.push("@theme {")
  lines.push("  --font-family-sans: var(--vscode-font-family);")
  lines.push("  --font-family-mono: Menlo, monospace;")
  lines.push("  --font-weight-normal: 400;")
  lines.push("  --font-weight-medium: 500;")
  lines.push("  --text-xs: 11px;")
  lines.push("  --text-xs--line-height: normal;")
  lines.push("  --text-sm: 12px;")
  lines.push("  --text-sm--line-height: normal;")
  lines.push("  --text-md: 13px;")
  lines.push("  --text-md--line-height: normal;")
  lines.push("}")
  lines.push("")

  for (const [name, def] of Object.entries(fontSizes)) {
    lines.push(
      `@utility text-${name} {font-size: ${def.size}; line-height: ${def.lineHeight}; font-weight: ${def.fontWeight};}`,
    )
  }
  lines.push("")

  for (const variable of categories.backgrounds) {
    const name = stripPrefix(variable)
    lines.push(`@utility bg-${name} {background-color: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.foregrounds) {
    const name = stripPrefix(variable)
    lines.push(`@utility text-${name} {color: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.borders) {
    const name = stripPrefix(variable)
    lines.push(`@utility border-${name} {border-color: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.shadows) {
    const name = shadowName(variable)
    lines.push(`@utility shadow-${name} {box-shadow: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.colors) {
    const name = stripPrefix(variable)
    lines.push(`@utility text-${name} {color: var(${variable});}`)
    lines.push(`@utility bg-${name} {background-color: var(${variable});}`)
    lines.push(`@utility border-${name} {border-color: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.outlines) {
    const name = stripPrefix(variable)
    lines.push(`@utility outline-${name} {outline-color: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.opacity) {
    const name = stripPrefix(variable)
    lines.push(`@utility opacity-${name} {opacity: var(${variable});}`)
  }
  lines.push("")

  for (const variable of categories.stroke) {
    const name = stripPrefix(variable)
    lines.push(`@utility stroke-${name} {stroke: var(${variable});}`)
  }

  return `${lines.join("\n")}\n`
}

const css = generateCSS()
writeFileSync(resolve(__dirname, "../src/qui-vscode.css"), css, "utf-8")
