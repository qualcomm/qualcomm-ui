import {writeFileSync} from "node:fs"
import {dirname} from "node:path"
import {fileURLToPath} from "node:url"
import {resolve} from "path"
import type {ThemeConfig} from "tailwindcss/types/config"

import {knownVariables} from "./known-variables"

const __dirname = dirname(fileURLToPath(import.meta.url))

interface ThemeObject {
  [key: string]: string | ThemeObject
}

// Microsoft at it again with the inconsistent conventions
const backgroundRegex = /background(?:color|[1-9])?$/
const foregroundRegex = /foreground(?:color|[1-9])?$/

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

function buildTheme() {
  const colors = knownVariables.reduce(
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

  writeFileSync(
    resolve(__dirname, "./temp/categories.json"),
    JSON.stringify(colors, null, 2),
  )

  const themeObject: Partial<ThemeConfig> = {
    backgroundColor: resolveRecursiveThemeObject(colors.backgrounds),
    borderColor: resolveRecursiveThemeObject(colors.borders),
    boxShadow: resolveShadows(colors.shadows),
    colors: resolveRecursiveThemeObject(colors.colors),
    opacity: resolveOpacity(colors.opacity),
    outlineColor: resolveRecursiveThemeObject(colors.outlines),
    stroke: resolveRecursiveThemeObject(colors.stroke),
    textColor: resolveRecursiveThemeObject(colors.foregrounds),
  }

  writeFileSync(
    resolve(__dirname, "./temp/theme.json"),
    JSON.stringify(themeObject, null, 2),
    "utf-8",
  )
}

function resolveOpacity(variables: string[]) {
  return variables.reduce((acc: Record<string, string>, current) => {
    acc[current.replace("--vscode-", "")] = `var(${current})`
    return acc
  }, {})
}

function resolveShadows(
  variables: string[],
): Record<string, string | string[]> {
  const obj: Record<string, string | string[]> = {}
  for (const variable of variables) {
    // Split the variable into parts
    const parts = variable.replace("--vscode-", "").split("-")

    if (
      parts[parts.length - 1] === "shadow" ||
      parts[parts.length - 1].endsWith("Shadow")
    ) {
      parts.pop()
    }

    obj[parts.join("-")] = `var(${variable})`
  }

  return obj
}

function resolveRecursiveThemeObject(variables: string[]): ThemeObject {
  const theme: any = {}

  variables.forEach((variable) => {
    const parts = variable.replace("--vscode-", "").split("-")
    let current = theme

    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] || {}
      current = current[parts[i]]
    }

    const lastPart = parts.pop()
    current[lastPart!] = {default: `var(${variable})`}
  })

  return simplifyTheme(theme)
}

function simplifyTheme(obj: any) {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const value = obj[key]
      if (
        Object.keys(value).length === 1 &&
        typeof value.default === "string"
      ) {
        obj[key] = value.default
      } else {
        simplifyTheme(value)
      }
    }
  }
  return obj
}

buildTheme()
