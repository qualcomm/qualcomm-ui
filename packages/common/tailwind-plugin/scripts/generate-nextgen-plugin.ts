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
  pattern: string
  themeKey: string
  utilities?: Utility[]
}

const TOKEN_MAPPINGS: TokenMapping[] = [
  {
    nameTransform: (name) => name.replace(/^border-radius-/, ""),
    pattern: "border-radius-*",
    themeKey: "radius",
  },
  {
    nameTransform: (name) => name.replace(/^border-width-/, ""),
    pattern: "border-width-*",
    themeKey: "border",
  },
  {
    pattern: "color-*background*",
    themeKey: "color",
    utilities: [Utility.BG],
  },
  {
    pattern: "color-*border*",
    themeKey: "color",
    utilities: [Utility.BORDER],
  },
  {
    pattern: "color-*category*",
    themeKey: "color",
    utilities: [Utility.TEXT, Utility.BG, Utility.BORDER],
  },
  {
    pattern: "color-*surface*",
    themeKey: "color",
    utilities: [Utility.BG],
  },
  // Must come before color-*icon* and color-*text* to match utility tokens first
  {
    pattern: "color-*utility*",
    themeKey: "color",
    utilities: [Utility.TEXT, Utility.BG, Utility.BORDER],
  },
  {
    nameTransform: (name) => `icon-${name}`,
    pattern: "color-*icon*",
    themeKey: "color",
    utilities: [Utility.TEXT],
  },
  {
    pattern: "color-*text*",
    themeKey: "color",
    utilities: [Utility.TEXT],
  },
  {
    pattern: "font-*",
    themeKey: "type",
  },
  {
    ignore: true,
    pattern: "icon-stroke-*",
    themeKey: "icon-stroke",
  },
  {
    nameTransform: (name) => name.replace(/^canvas-/, ""),
    pattern: "canvas-width",
    themeKey: "canvas",
  },
  {
    ignore: true,
    pattern: "component-*",
    themeKey: "component",
  },
  {
    ignore: true,
    pattern: "scrim-*",
    themeKey: "scrim",
  },
  {
    pattern: "shadow-*",
    themeKey: "shadow",
    utilities: [Utility.SHADOW],
  },
  {
    ignore: true,
    pattern: "sizing-*",
    themeKey: "sizing",
  },
  {
    ignore: true,
    pattern: "track-*",
    themeKey: "track",
  },
  {
    nameTransform: (name) => name.replace("spacing", "qds"),
    pattern: "spacing-*",
    themeKey: "spacing",
  },
  {
    nameTransform: (name) => name.replace(/^type-font-family-/, ""),
    pattern: "type-font-family-*",
    themeKey: "font-family",
  },
  {
    nameTransform: (name) => name.replace(/^type-font-weight-/, ""),
    pattern: "type-font-weight-*",
    themeKey: "font-weight",
  },
  {
    pattern: "type-static-body-*",
    themeKey: "text-body",
  },
  {
    pattern: "type-static-code-*",
    themeKey: "text-code",
  },
  {
    pattern: "type-static-eyebrow-*",
    themeKey: "text-eyebrow",
  },
  {
    pattern: "type-static-heading-*",
    themeKey: "text-heading",
  },
]

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
    for (const mapping of TOKEN_MAPPINGS) {
      if (matchesWildcard(mapping.pattern, varName)) {
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
      .replace(/^shadow-/, "")
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
        let redundantSuffix: string | undefined

        switch (category) {
          case Utility.BG:
            // Skip bg utilities for icon/text colors
            if (varName.endsWith("-icon") || varName.endsWith("-text")) {
              continue
            }
            cssProperty = "background-color"
            utilityPrefix = "bg"
            redundantSuffix = "-background"
            break
          case Utility.BORDER:
            cssProperty = "border-color"
            utilityPrefix = "border"
            redundantSuffix = "-border"
            break
          case Utility.SHADOW:
            cssProperty = "box-shadow"
            utilityPrefix = "shadow"
            break
          case Utility.TEXT:
            cssProperty = "color"
            utilityPrefix = "text"
            redundantSuffix = "-text"
            break
          default:
            continue
        }

        const finalUtilityName =
          redundantSuffix && utilityName.endsWith(redundantSuffix)
            ? utilityName.slice(0, -redundantSuffix.length)
            : utilityName

        utilities.push(
          `@utility ${utilityPrefix}-${finalUtilityName} {${cssProperty}: var(--${varName});}`,
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
  const textSizeGroups = new Map<string, string[]>()

  const bodyToTailwindMap: Record<string, string> = {
    lg: "lg",
    md: "base",
    sm: "sm",
    xl: "xl",
    xs: "xs",
    xxl: "2xl",
  }

  for (const [varName, mapping] of Object.entries(variables)) {
    if (
      !mapping.utilities &&
      mapping.themeKey !== "type" &&
      !mapping.themeKey.startsWith("text-")
    ) {
      const utilityName = extractUtilityName(varName, mapping)
      themeVars.push(
        `  --${mapping.themeKey}-${utilityName}: var(--${varName});`,
      )
    } else if (mapping.themeKey.startsWith("text-")) {
      const category = mapping.themeKey.slice(5)
      const regex = new RegExp(
        `^type-static-${category}-(\\w+)-(font-size|line-height)$`,
      )
      const match = varName.match(regex)
      if (match) {
        const [, size, prop] = match
        const key = `${category}/${size}`
        if (!textSizeGroups.has(key)) {
          textSizeGroups.set(key, [])
        }
        textSizeGroups.get(key)!.push(`${prop}:${varName}`)
      }
    }
  }

  for (const [key, props] of textSizeGroups) {
    const [category, size] = key.split("/")

    let themeVarName: string
    if (category === "body") {
      const tailwindSize = bodyToTailwindMap[size]
      if (!tailwindSize) {
        continue
      }
      themeVarName = tailwindSize
    } else if (category === "eyebrow" && size === "type") {
      themeVarName = "eyebrow"
    } else {
      themeVarName = `${category}-${size}`
    }

    for (const propEntry of props) {
      const [prop, varName] = propEntry.split(":")
      if (prop === "font-size") {
        themeVars.push(`  --text-${themeVarName}: var(--${varName});`)
      } else if (prop === "line-height") {
        themeVars.push(
          `  --text-${themeVarName}--line-height: var(--${varName});`,
        )
      }
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
