import {readFileSync, writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Many of our theme variables overlap with tailwind variable namespaces, so we
 * create a configuration to find and marshal them into custom utility functions.
 */
export const Utility = {
  BG: "background",
  BORDER: "border",
  SHADOW: "shadow",
  TEXT: "text",
} as const

type Utility = (typeof Utility)[keyof typeof Utility]

interface TokenMapping {
  ignore?: boolean
  nameTransform?: (name: string) => string
  themeKey: string
  utilities?: Utility[]
}

const TOKEN_MAPPINGS: Record<string, TokenMapping> = {
  "border-radius-*": {
    nameTransform: (name) => name.replace(/^border-radius-/, ""),
    themeKey: "radius",
  },
  "border-width-*": {
    nameTransform: (name) => name.replace(/^border-width-/, ""),
    themeKey: "border",
  },
  "color-*background*": {
    themeKey: "color",
    utilities: [Utility.BG],
  },
  "color-*border*": {
    themeKey: "color",
    utilities: [Utility.BORDER],
  },
  "color-*category*": {
    themeKey: "color",
    utilities: [Utility.TEXT, Utility.BG, Utility.BORDER],
  },
  "color-*icon*": {
    nameTransform: (name) => `icon-${name}`,
    themeKey: "color",
    utilities: [Utility.TEXT],
  },
  "color-*surface*": {
    themeKey: "color",
    utilities: [Utility.BG],
  },
  "color-*text*": {
    themeKey: "color",
    utilities: [Utility.TEXT],
  },
  "color-*utility*": {
    themeKey: "color",
    utilities: [Utility.BG, Utility.BORDER],
  },
  "font-*": {
    themeKey: "type",
  },
  "icon-stroke-*": {
    ignore: true,
    themeKey: "icon-stroke",
  },
  "scrim-*": {
    ignore: true,
    themeKey: "scrim",
  },
  "shadow-*": {
    themeKey: "shadow",
    utilities: [Utility.SHADOW],
  },
  "sizing-*": {
    ignore: true,
    themeKey: "sizing",
  },
  "spacing-*": {
    ignore: true,
    themeKey: "spacing",
  },
  "type-font-family-*": {
    nameTransform: (name) => name.replace(/^type-font-family-/, ""),
    themeKey: "font-family",
  },
  "type-font-weight-*": {
    nameTransform: (name) => name.replace(/^type-font-weight-/, ""),
    themeKey: "font-weight",
  },
}

function matchesWildcard(pattern: string, text: string): boolean {
  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
  return regex.test(text)
}

function transformVariables(
  variables: Record<string, string>,
): Record<string, TokenMapping> {
  const themeVariables: Record<string, TokenMapping> = {}
  for (const [varName] of Object.entries(variables)) {
    let matched = false
    for (const [pattern, mapping] of Object.entries(TOKEN_MAPPINGS)) {
      if (matchesWildcard(pattern, varName)) {
        if (mapping.ignore) {
          matched = true
          break
        }
        themeVariables[varName] = mapping
        matched = true
        break
      }
    }
    if (!matched) {
      console.warn(`Unmatched token: ${varName}`)
    }
  }
  return themeVariables
}

function parseCssVariables(cssContent: string): Record<string, string> {
  const variables: Record<string, string> = {}
  const variableRegex = /--([^:]+):\s*([^;]+);/g
  let match
  while ((match = variableRegex.exec(cssContent)) !== null) {
    const [, name, value] = match
    variables[name.trim()] = value.trim()
  }
  return variables
}

function extractUtilityName(
  variableName: string,
  mapping: TokenMapping,
): string {
  if (mapping.utilities) {
    const cleanName = variableName
      .replace(/^color-/, "")
      .replace(/(background|border|icon|text|surface|utility)-/, "")
      .replace(/^interactive-/, "")
    return mapping.nameTransform ? mapping.nameTransform(cleanName) : cleanName
  }

  if (mapping.nameTransform) {
    return mapping.nameTransform(variableName)
  }

  return variableName
}

function generateUtilityDeclarations(
  variables: Record<string, TokenMapping>,
): string {
  const utilities: string[] = []

  for (const [varName, mapping] of Object.entries(variables)) {
    if (mapping.utilities) {
      const utilityName = extractUtilityName(varName, mapping)

      for (const category of mapping.utilities) {
        let cssProperty: string
        let utilityPrefix: string

        switch (category) {
          case Utility.BG:
            cssProperty = "background-color"
            utilityPrefix = "bg"
            break
          case Utility.BORDER:
            cssProperty = "border-color"
            utilityPrefix = "border"
            break
          case Utility.TEXT:
            cssProperty = "color"
            utilityPrefix = "text"
            break
          default:
            continue
        }

        utilities.push(
          `@utility ${utilityPrefix}-${utilityName} {${cssProperty}: var(--${varName});}`,
        )
      }
    } else if (mapping.themeKey === "type") {
      const baseUtilityName = varName.replace(/^font-/, "")
      let utilityName = baseUtilityName.replace(/^static-/, "")
      if (utilityName.endsWith("-default")) {
        utilityName = utilityName.slice(0, -8)
      }
      utilities.push(`@utility font-${utilityName} {font: var(--${varName});}`)
    }
  }

  return utilities.join("\n")
}

function generateThemeVariables(
  variables: Record<string, TokenMapping>,
): string {
  const themeVars: string[] = []

  for (const [varName, mapping] of Object.entries(variables)) {
    if (!mapping.utilities && mapping.themeKey !== "type") {
      const utilityName = extractUtilityName(varName, mapping)
      themeVars.push(
        `  --${mapping.themeKey}-${utilityName}: var(--${varName});`,
      )
    }
  }

  return themeVars.sort().join("\n")
}

function generateThemeCss(
  themeVariables: Record<string, TokenMapping>,
  strict?: boolean,
): string {
  const utilities = generateUtilityDeclarations(themeVariables)
  const themeVars = generateThemeVariables(themeVariables)

  const strictDeclarations = strict
    ? [
        "--color-*: initial;",
        "--font-*: initial;",
        "--radius-*: initial;",
        "--shadow-*: initial;",
      ].join("\n  ")
    : ""

  return `/** This file was generated automatically. Do not edit it directly. */
/* stylelint-disable */
@theme {${strictDeclarations ? `\n  ${strictDeclarations}` : ""}
${themeVars}
}

${utilities}
`
}

export function generateTailwindTheme(
  cssFilePath: string,
  outputPath: string,
  outputPathStrictTheme: string,
) {
  const cssContent = readFileSync(cssFilePath, "utf8")
  const variables = parseCssVariables(cssContent)
  const themeVariables = transformVariables(variables)
  const themeCss = generateThemeCss(themeVariables)
  const strictThemeCss = generateThemeCss(themeVariables, true)

  writeFileSync(outputPath, themeCss)
  writeFileSync(outputPathStrictTheme, strictThemeCss)

  console.log(`Generated Tailwind v4 theme at ${outputPath}`)
  console.log(`Transformed ${Object.keys(variables).length} css variables`)
}

generateTailwindTheme(
  resolve(__dirname, "../../qds-core/src/styles/qualcomm-dark.css"),
  resolve(__dirname, "../src/qui.css"),
  resolve(__dirname, "../src/qui-strict.css"),
)
