import {readFile, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {tokens, type TokenWithComment} from "@qualcomm-ui/qds-core/tokens"

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

interface UtilityDeclaration {
  cssProperty: string
  description?: string
  tailwindClass: string
  variable: string
}

interface ThemeVariableDeclaration {
  description?: string
  themeVariable: string
  variable: string
}

const TOKEN_DESCRIPTIONS = new Map<string, string>()
for (const {comment, name} of tokens) {
  if (comment) {
    TOKEN_DESCRIPTIONS.set(name, comment)
  }
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
    pattern: "color-border-*",
    themeKey: "color",
    utilities: [Utility.BORDER],
  },
  {
    pattern: "color-interactive-border-*",
    themeKey: "color",
    utilities: [Utility.BORDER],
  },
  {
    pattern: "color-*category*",
    themeKey: "color",
    utilities: [Utility.TEXT, Utility.BG],
  },
  {
    pattern: "color-*surface*",
    themeKey: "color",
    utilities: [Utility.BG],
  },
  {
    pattern: "color-utility-*-border",
    themeKey: "color",
    utilities: [Utility.BORDER],
  },
  // Must come before color-*icon* and color-*text* to match utility tokens first
  {
    pattern: "color-*utility*",
    themeKey: "color",
    utilities: [Utility.TEXT, Utility.BG],
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
    pattern: "cross-component-*",
    themeKey: "cross-component",
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

function transformTokens(
  tokens: readonly TokenWithComment[],
): Record<string, TokenMapping> {
  const themeVariables: Record<string, TokenMapping> = {}
  for (const {name: varName} of tokens) {
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
): UtilityDeclaration[] {
  const utilities: UtilityDeclaration[] = []

  for (const [varName, mapping] of Object.entries(variables)) {
    const description = TOKEN_DESCRIPTIONS.get(varName)
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

        utilities.push({
          cssProperty,
          ...(description ? {description} : {}),
          tailwindClass: `${utilityPrefix}-${finalUtilityName}`,
          variable: `--${varName}`,
        })
      }
    } else if (mapping.themeKey === "type") {
      const baseUtilityName = varName.replace(/^font-/, "")
      let utilityName = baseUtilityName.replace(/^static-/, "")
      if (utilityName.endsWith("-default")) {
        utilityName = utilityName.slice(0, -8)
      }
      utilities.push({
        cssProperty: "font",
        ...(description ? {description} : {}),
        tailwindClass: `font-${utilityName}`,
        variable: `--${varName}`,
      })
    }
  }

  return utilities
}

function serializeUtilityDeclarations(
  declarations: readonly UtilityDeclaration[],
): string {
  return declarations
    .map(
      ({cssProperty, tailwindClass, variable}) =>
        `@utility ${tailwindClass} {${cssProperty}: var(${variable});}`,
    )
    .join("\n")
}

function generateThemeVariableDeclarations(
  variables: Record<string, TokenMapping>,
): ThemeVariableDeclaration[] {
  const declarations: ThemeVariableDeclaration[] = []
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
    const description = TOKEN_DESCRIPTIONS.get(varName)
    if (
      !mapping.utilities &&
      mapping.themeKey !== "type" &&
      !mapping.themeKey.startsWith("text-")
    ) {
      const utilityName = extractUtilityName(varName, mapping)
      declarations.push({
        ...(description ? {description} : {}),
        themeVariable: `--${mapping.themeKey}-${utilityName}`,
        variable: `--${varName}`,
      })
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
      const description = TOKEN_DESCRIPTIONS.get(varName)
      if (prop === "font-size") {
        declarations.push({
          ...(description ? {description} : {}),
          themeVariable: `--text-${themeVarName}`,
          variable: `--${varName}`,
        })
      } else if (prop === "line-height") {
        declarations.push({
          ...(description ? {description} : {}),
          themeVariable: `--text-${themeVarName}--line-height`,
          variable: `--${varName}`,
        })
      }
    }
  }

  return declarations
}

function serializeThemeVariableDeclarations(
  declarations: readonly ThemeVariableDeclaration[],
): string {
  return declarations
    .map(({themeVariable, variable}) => `  ${themeVariable}: var(${variable});`)
    .sort()
    .join("\n")
}

function generateThemeCss(
  themeVariableDeclarations: readonly ThemeVariableDeclaration[],
  utilityDeclarations: readonly UtilityDeclaration[],
  strict?: boolean,
): string {
  const utilities = serializeUtilityDeclarations(utilityDeclarations)
  const themeVars = serializeThemeVariableDeclarations(
    themeVariableDeclarations,
  )

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

interface ThemeData {
  description?: string
  tailwindClasses: string[]
  variable: string
}

interface ColorData extends ThemeData {
  description?: string
}

interface ThemeColors {
  background: ColorData[]
  border: ColorData[]
  category: ColorData[]
  icon: ColorData[]
  surface: ColorData[]
  text: ColorData[]
}

function addThemeColor(
  colors: ColorData[],
  {
    description,
    tailwindClass,
    variable,
  }: Pick<UtilityDeclaration, "description" | "tailwindClass" | "variable">,
) {
  const existingColor = colors.find((color) => color.variable === variable)
  if (existingColor) {
    existingColor.tailwindClasses.push(tailwindClass)
    if (description && !existingColor.description) {
      existingColor.description = description
    }
    return
  }

  colors.push({
    ...(description ? {description} : {}),
    tailwindClasses: [tailwindClass],
    variable,
  })
}

function generateThemeColors(
  declarations: readonly UtilityDeclaration[],
): ThemeColors {
  const themeColors: ThemeColors = {
    background: [],
    border: [],
    category: [],
    icon: [],
    surface: [],
    text: [],
  }

  for (const declaration of declarations) {
    const {variable} = declaration
    if (!variable.startsWith("--color-")) {
      continue
    }

    if (variable.startsWith("--color-background-")) {
      addThemeColor(themeColors.background, declaration)
    } else if (
      variable.startsWith("--color-border-") ||
      (variable.startsWith("--color-utility-") && variable.endsWith("-border"))
    ) {
      addThemeColor(themeColors.border, declaration)
    } else if (variable.startsWith("--color-category-")) {
      addThemeColor(themeColors.category, declaration)
    } else if (variable.startsWith("--color-icon-")) {
      addThemeColor(themeColors.icon, declaration)
    } else if (variable.startsWith("--color-surface-")) {
      addThemeColor(themeColors.surface, declaration)
    } else if (variable.startsWith("--color-text-")) {
      addThemeColor(themeColors.text, declaration)
    }
  }

  for (const colors of Object.values(themeColors)) {
    for (const color of colors) {
      color.tailwindClasses.sort()
    }
    colors.sort((a: ColorData, b: ColorData) =>
      a.variable.localeCompare(b.variable),
    )
  }

  return themeColors
}

function serializeTailwindClasses(tailwindClasses: readonly string[]): string {
  const values = tailwindClasses.map((tailwindClass) =>
    JSON.stringify(tailwindClass),
  )
  const inline = `    tailwindClasses: [${values.join(", ")}],`
  if (inline.length <= 80) {
    return inline
  }

  return `    tailwindClasses: [
${values.map((value) => `      ${value},`).join("\n")}
    ],`
}

function serializeThemeData(data: readonly ThemeData[]): string {
  return data
    .map(
      ({description, tailwindClasses, variable}) => `  {
${description ? `    description: ${JSON.stringify(description)},\n` : ""}${serializeTailwindClasses(tailwindClasses)}
    variable: ${JSON.stringify(variable)},
  },`,
    )
    .join("\n")
}

function generateThemeColorsTs(
  declarations: readonly UtilityDeclaration[],
): string {
  const {background, border, category, icon, surface, text} =
    generateThemeColors(declarations)

  return `/* eslint-disable */
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** This file was generated automatically. Do not edit it directly. */

export interface ColorData {
  description?: string
  tailwindClasses: string[]
  variable: string
}

const background: ColorData[] = [
${serializeThemeData(background)}
]

const border: ColorData[] = [
${serializeThemeData(border)}
]

const category: ColorData[] = [
${serializeThemeData(category)}
]

const icon: ColorData[] = [
${serializeThemeData(icon)}
]

const surface: ColorData[] = [
${serializeThemeData(surface)}
]

const text: ColorData[] = [
${serializeThemeData(text)}
]

export const themeColors: {
  background: ColorData[]
  border: ColorData[]
  category: ColorData[]
  icon: ColorData[]
  surface: ColorData[]
  text: ColorData[]
} = {
  background,
  border,
  category,
  icon,
  surface,
  text,
}
`
}

const FONT_GROUPS = [
  {key: "display", pattern: /^--font-static-display-(\w+)$/},
  {key: "heading", pattern: /^--font-static-heading-(\w+)(?:-default)?$/},
  {key: "headingBold", pattern: /^--font-static-heading-(\w+)-bold$/},
  {key: "bodyCompact", pattern: /^--font-static-body-(\w+)-compact-default/},
  {key: "bodyCompactBold", pattern: /^--font-static-body-(\w+)-compact-bold$/},
  {key: "body", pattern: /^--font-static-body-(\w+)-default$/},
  {key: "bodyBold", pattern: /^--font-static-body-(\w+)-bold$/},
  {key: "eyebrow", pattern: /^--font-static-eyebrow-(\w+)-default$/},
  {key: "eyebrowBold", pattern: /^--font-static-eyebrow-(\w+)-bold$/},
  {key: "code", pattern: /^--font-static-code-(\w+)-default$/},
  {key: "codeBold", pattern: /^--font-static-code-(\w+)-bold$/},
  {key: "dynamicDisplay", pattern: /^--font-dynamic-display-(\w+)$/},
  {
    key: "dynamicHeading",
    pattern: /^--font-dynamic-heading-(\w+)(?:-default)?$/,
  },
  {
    key: "dynamicHeadingBold",
    pattern: /^--font-dynamic-heading-(\w+)-bold$/,
  },
] as const

type FontGroup = (typeof FONT_GROUPS)[number]["key"]

interface FontData extends ThemeData {
  size: string
}

const FONT_SIZE_ORDER = [
  "xxxl",
  "xxl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
  "xxs",
  "type",
]

function generateThemeFonts(
  declarations: readonly UtilityDeclaration[],
): Record<FontGroup, FontData[]> {
  const fonts: Record<FontGroup, FontData[]> = {
    body: [],
    bodyBold: [],
    bodyCompact: [],
    bodyCompactBold: [],
    code: [],
    codeBold: [],
    display: [],
    dynamicDisplay: [],
    dynamicHeading: [],
    dynamicHeadingBold: [],
    eyebrow: [],
    eyebrowBold: [],
    heading: [],
    headingBold: [],
  }

  for (const {
    cssProperty,
    description,
    tailwindClass,
    variable,
  } of declarations) {
    if (cssProperty !== "font") {
      continue
    }

    const group = FONT_GROUPS.find(({pattern}) => pattern.test(variable))
    const match = group?.pattern.exec(variable)

    if (!group || !match) {
      throw new Error(`Unmatched font utility: ${variable}`)
    }

    fonts[group.key].push({
      ...(description ? {description} : {}),
      size: match[1],
      tailwindClasses: [tailwindClass],
      variable,
    })
  }

  for (const group of Object.values(fonts)) {
    group.sort((a, b) => {
      const sizeDifference =
        FONT_SIZE_ORDER.indexOf(a.size) - FONT_SIZE_ORDER.indexOf(b.size)
      return sizeDifference || a.variable.localeCompare(b.variable)
    })
  }

  return fonts
}

function generateThemeFontsTs(
  declarations: readonly UtilityDeclaration[],
): string {
  const fonts = generateThemeFonts(declarations)
  const declarationsTs = FONT_GROUPS.map(
    ({key}) => `const ${key}: FontData[] = [
${serializeThemeData(fonts[key])}
]`,
  ).join("\n\n")
  const typeProperties = FONT_GROUPS.map(
    ({key}) => `  ${key}: FontData[]`,
  ).join("\n")
  const properties = FONT_GROUPS.map(({key}) => `  ${key},`).join("\n")

  return `/* eslint-disable */
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** This file was generated automatically. Do not edit it directly. */

export interface FontData {
  description?: string
  tailwindClasses: string[]
  variable: string
}

${declarationsTs}

export const themeFonts: {
${typeProperties}
} = {
${properties}
}
`
}

function generateThemeSpacing(
  declarations: readonly ThemeVariableDeclaration[],
): ThemeData[] {
  return declarations
    .filter(({themeVariable}) => themeVariable.startsWith("--spacing-qds-"))
    .map(({description, themeVariable, variable}) => ({
      ...(description ? {description} : {}),
      tailwindClasses: [themeVariable.replace(/^--spacing/, "*")],
      variable,
    }))
    .sort((a, b) => {
      const aValue = Number.parseInt(a.variable.replace("--spacing-", ""), 10)
      const bValue = Number.parseInt(b.variable.replace("--spacing-", ""), 10)
      return aValue - bValue
    })
}

function generateThemeSpacingTs(
  declarations: readonly ThemeVariableDeclaration[],
): string {
  return `/* eslint-disable */
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** This file was generated automatically. Do not edit it directly. */

import type {BasicThemeData} from "./theme.types.js"

export const themeSpacing: BasicThemeData[] = [
${serializeThemeData(generateThemeSpacing(declarations))}
]
`
}

function generateThemeZIndex(css: string): ThemeData[] {
  const zIndex = Array.from(
    css.matchAll(/^\s*(--z-index-[\w-]+)\s*:/gm),
    ([, variable]) => ({tailwindClasses: [], variable}),
  )
  if (!zIndex.length) {
    throw new Error("No z-index variables found")
  }
  return zIndex
}

function generateThemeZIndexTs(css: string): string {
  return `/* eslint-disable */
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** This file was generated automatically. Do not edit it directly. */

import type {BasicThemeData} from "./theme.types.js"

export const themeZIndex: BasicThemeData[] = [
${serializeThemeData(generateThemeZIndex(css))}
]
`
}

interface GenerateTailwindThemeOptions {
  outputPath: string
  outputPathStrictTheme: string
  themeColorsOutputPath: string
  themeFontsOutputPath: string
  themeSpacingOutputPath: string
  themeZIndexOutputPath: string
  zIndexSourcePath: string
}

export async function generateTailwindTheme({
  outputPath,
  outputPathStrictTheme,
  themeColorsOutputPath,
  themeFontsOutputPath,
  themeSpacingOutputPath,
  themeZIndexOutputPath,
  zIndexSourcePath,
}: GenerateTailwindThemeOptions): Promise<void> {
  const themeVariables = transformTokens(tokens)
  const themeVariableDeclarations =
    generateThemeVariableDeclarations(themeVariables)
  const utilityDeclarations = generateUtilityDeclarations(themeVariables)
  const themeCss = generateThemeCss(
    themeVariableDeclarations,
    utilityDeclarations,
  )
  const strictThemeCss = generateThemeCss(
    themeVariableDeclarations,
    utilityDeclarations,
    true,
  )
  const themeColorsTs = generateThemeColorsTs(utilityDeclarations)
  const themeFontsTs = generateThemeFontsTs(utilityDeclarations)
  const themeSpacingTs = generateThemeSpacingTs(themeVariableDeclarations)
  const zIndexCss = await readFile(zIndexSourcePath, "utf8")
  const themeZIndexTs = generateThemeZIndexTs(zIndexCss)

  await Promise.all([
    writeFile(outputPath, themeCss),
    writeFile(outputPathStrictTheme, strictThemeCss),
    writeFile(themeColorsOutputPath, themeColorsTs),
    writeFile(themeFontsOutputPath, themeFontsTs),
    writeFile(themeSpacingOutputPath, themeSpacingTs),
    writeFile(themeZIndexOutputPath, themeZIndexTs),
  ])

  console.log(`Generated Tailwind v4 theme at ${outputPath}`)
  console.log(`Generated Tailwind color data at ${themeColorsOutputPath}`)
  console.log(`Generated Tailwind font data at ${themeFontsOutputPath}`)
  console.log(`Generated Tailwind spacing data at ${themeSpacingOutputPath}`)
  console.log(`Generated z-index data at ${themeZIndexOutputPath}`)
  console.log(`Transformed ${tokens.length} design tokens`)
}

await generateTailwindTheme({
  outputPath: resolve(__dirname, "../src/qui.css"),
  outputPathStrictTheme: resolve(__dirname, "../src/qui-strict.css"),
  themeColorsOutputPath: resolve(__dirname, "../src/theme/theme-colors.ts"),
  themeFontsOutputPath: resolve(__dirname, "../src/theme/theme-fonts.ts"),
  themeSpacingOutputPath: resolve(__dirname, "../src/theme/theme-spacing.ts"),
  themeZIndexOutputPath: resolve(__dirname, "../src/theme/theme-z-index.ts"),
  zIndexSourcePath: resolve(
    __dirname,
    "../../qds-core/src/shared/qds-z-index.css",
  ),
})
