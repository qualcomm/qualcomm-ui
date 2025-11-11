#!/usr/bin/env node

import {existsSync, mkdirSync} from "node:fs"
import {readFile, writeFile} from "node:fs/promises"
import {dirname} from "node:path"
import {exit} from "node:process"

function parseTailwindTheme(
  cssContent: string,
): Record<string, {cssProperty: string; tailwindVariable: string}[]> {
  const utilityBlockRegex = /@utility\s+([^\s{]+)\s*\{([^}]+)\}/g
  const propertyRegex = /([^:;{}]+):\s*var\([^)]+\);?/g
  const result: Record<
    string,
    {cssProperty: string; tailwindVariable: string}[]
  > = {}

  let blockMatch: RegExpExecArray | null

  while ((blockMatch = utilityBlockRegex.exec(cssContent)) !== null) {
    const tailwindVariable = blockMatch[1]
    const blockContent = blockMatch[2]

    let propertyMatch: RegExpExecArray | null
    propertyRegex.lastIndex = 0

    while ((propertyMatch = propertyRegex.exec(blockContent)) !== null) {
      const cssProperty = propertyMatch[1].trim()

      if (!result[cssProperty]) {
        result[cssProperty] = []
      }

      result[cssProperty].push({
        cssProperty,
        tailwindVariable,
      })
    }
  }

  return result
}

function formatAsDocumentation(
  data: Record<string, {cssProperty: string; tailwindVariable: string}[]>,
): string {
  const sections: string[] = []

  const propertyDescriptions: Record<string, string> = {
    "background-color":
      "The following variables are available as the `bg-` tailwind class shorthand, which maps to background-color",
    "border-color":
      "The following variables are available as the `border-` tailwind class, which maps to border-color",
    color:
      "The following variables are available as the `text-` tailwind class, which maps to color",
    font: "The following utility classes apply the `font` CSS shorthand, NOT the font-weight tailwind class",
  }

  for (const [cssProperty, utilities] of Object.entries(data)) {
    const description =
      propertyDescriptions[cssProperty] ||
      `The following variables map to ${cssProperty}`
    const classNames = utilities.map((u) => u.tailwindVariable).join(", ")

    sections.push(`### ${description}\n`)
    sections.push(`${classNames}\n`)
  }

  return sections.join("\n")
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error("Usage: tailwind-parser <css-file>")
    exit(1)
  }

  const filePath = args[0]
  const outFile = args[1]

  if (!existsSync(dirname(outFile))) {
    mkdirSync(dirname(outFile), {recursive: true})
  }

  try {
    const cssContent = await readFile(filePath, "utf-8")
    const result = parseTailwindTheme(cssContent)
    const documentation = formatAsDocumentation(result)
    await writeFile(outFile, documentation, "utf-8")
  } catch (error) {
    console.error(
      `Error reading file: ${error instanceof Error ? error.message : error}`,
    )
    exit(1)
  }
}

main()
