// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import {readFile, writeFile} from "node:fs/promises"
import remarkFrontmatter from "remark-frontmatter"
import remarkParse from "remark-parse"
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkStringify from "remark-stringify"
import {unified} from "unified"

import type {ImportTransformEntry} from "./types"

export interface MdxSections {
  contentSection: string
  frontmatter: string
  importsSection: string
}

export async function transformMdx(
  filePath: string,
  optionsArray: ImportTransformEntry[],
): Promise<boolean> {
  try {
    let content = await readFile(filePath, "utf-8")
    let hasAnyChanges = false

    for (const options of optionsArray) {
      const {hasChanges, newContent} = await transformMdxImports(
        content,
        options,
      )
      if (hasChanges) {
        content = newContent
        hasAnyChanges = true
      }
    }

    if (hasAnyChanges) {
      await writeFile(filePath, content, "utf-8")
    }

    return hasAnyChanges
  } catch (error) {
    console.warn(`Failed to process MDX file ${filePath}:`, error)
    return false
  }
}

export async function transformMdxImports(
  content: string,
  options: ImportTransformEntry,
): Promise<{hasChanges: boolean; newContent: string}> {
  const {sourcePackage, variableTransformers} = options

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(remarkParseFrontmatter)
    .use(remarkStringify)

  const ast = processor.parse(content)

  const sections = extractMdxSections(content, ast)

  if (!sections.importsSection.includes(sourcePackage)) {
    return {hasChanges: false, newContent: content}
  }

  const importedNamesFromSource = extractImportedNames(
    sections.importsSection,
    sourcePackage,
  )

  const {hasChanges, transformedImports} = transformImportsSection(
    sections.importsSection,
    options,
  )

  let transformedContent = sections.contentSection
  let contentHasChanges = false

  if (variableTransformers && variableTransformers.length > 0) {
    for (const transformer of variableTransformers) {
      if (!importedNamesFromSource.has(transformer.name)) {
        continue
      }

      const regex = new RegExp(`\\b${escapeRegex(transformer.name)}\\b`, "g")
      const newContent = transformedContent.replace(regex, transformer.renameTo)

      if (newContent !== transformedContent) {
        transformedContent = newContent
        contentHasChanges = true
      }
    }
  }

  if (!hasChanges && !contentHasChanges) {
    return {hasChanges: false, newContent: content}
  }

  const newContent = [
    sections.frontmatter,
    transformedImports,
    transformedContent,
  ]
    .filter(Boolean)
    .join("")

  return {hasChanges: true, newContent}
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function extractImportedNames(
  importsSection: string,
  sourcePackage: string,
): Set<string> {
  const importedNames = new Set<string>()
  const lines = importsSection.split("\n")

  const patterns = [
    /^(\s*)import\s*\{\s*([^}]+)\s*\}\s*from\s*['"`]([^'"`]+)['"`]\s*$/,
    /^(\s*)import\s+type\s*\{\s*([^}]+)\s*\}\s*from\s*['"`]([^'"`]+)['"`]\s*$/,
  ]

  for (const line of lines) {
    const trimmedLine = line.trim()

    for (const pattern of patterns) {
      const match = trimmedLine.match(pattern)
      if (match && match[3] === sourcePackage) {
        const importedItems = match[2]
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)

        for (const item of importedItems) {
          const cleanItem = item
            .replace(/\s+as\s+\w+$/, "")
            .replace(/^type\s+/, "")
            .trim()
          importedNames.add(cleanItem)
        }
        break
      }
    }
  }

  return importedNames
}

export function extractMdxSections(content: string, ast: Root): MdxSections {
  const lines = content.split("\n")
  let frontmatterEnd = 0
  let importsEnd = 0

  const hasFrontmatter = ast.children[0]?.type === "yaml"

  if (hasFrontmatter) {
    let inFrontmatter = false
    let frontmatterDelimiter = ""
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!inFrontmatter && (line === "---" || line === "+++")) {
        inFrontmatter = true
        frontmatterDelimiter = line
        continue
      }
      if (inFrontmatter && line === frontmatterDelimiter) {
        frontmatterEnd = i + 1
        break
      }
    }
  }

  importsEnd = frontmatterEnd
  let inMultilineComment = false
  for (let i = frontmatterEnd; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.includes("/*") && !line.includes("*/")) {
      inMultilineComment = true
      importsEnd = i + 1
      continue
    }
    if (inMultilineComment) {
      importsEnd = i + 1
      if (line.includes("*/")) {
        inMultilineComment = false
      }
      continue
    }

    if (!line || line.startsWith("//")) {
      importsEnd = i + 1
      continue
    }

    if (line.startsWith("import ") || line.startsWith("export ")) {
      importsEnd = i + 1
      continue
    }

    break
  }

  return {
    contentSection: lines.slice(importsEnd).join("\n"),
    frontmatter:
      lines.slice(0, frontmatterEnd).join("\n") +
      (frontmatterEnd > 0 ? "\n" : ""),
    importsSection:
      lines.slice(frontmatterEnd, importsEnd).join("\n") +
      (importsEnd > frontmatterEnd ? "\n" : ""),
  }
}

export function transformImportsSection(
  importsSection: string,
  options: ImportTransformEntry,
): {hasChanges: boolean; transformedImports: string} {
  const {sourcePackage} = options

  if (!importsSection.trim()) {
    return {hasChanges: false, transformedImports: importsSection}
  }

  const lines = importsSection.split("\n")
  const transformedLines: string[] = []
  let hasChanges = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (
      !trimmedLine ||
      trimmedLine.startsWith("//") ||
      trimmedLine.startsWith("/*")
    ) {
      transformedLines.push(line)
      continue
    }

    if (
      trimmedLine.startsWith("import") &&
      trimmedLine.includes(sourcePackage)
    ) {
      const transformResult = transformImportLine(line, options)
      if (transformResult.hasChanges) {
        transformedLines.push(...transformResult.newLines)
        hasChanges = true
      } else {
        transformedLines.push(line)
      }
    } else {
      transformedLines.push(line)
    }
  }

  return {
    hasChanges,
    transformedImports: transformedLines.join("\n"),
  }
}

export function transformImportLine(
  line: string,
  options: ImportTransformEntry,
): {hasChanges: boolean; newLines: string[]} {
  const {imports, importsToRemove, sourcePackage, targetPackage} = options

  const patterns = [
    /^(\s*)import\s*\{\s*([^}]+)\s*\}\s*from\s*['"`]([^'"`]+)['"`]\s*$/,
    /^(\s*)import\s+type\s*\{\s*([^}]+)\s*\}\s*from\s*['"`]([^'"`]+)['"`]\s*$/,
  ]

  const shouldMoveAll = !imports || imports.length === 0

  for (const pattern of patterns) {
    const match = line.match(pattern)
    if (!match || match[3] !== sourcePackage) {
      continue
    }

    const indent = match[1]
    const isTypeImport = line.includes("import type")
    const importedItems = match[2]
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    const itemsToMove: string[] = []
    const itemsToKeep: string[] = []

    for (const item of importedItems) {
      const cleanItem = item
        .replace(/\s+as\s+\w+$/, "")
        .replace(/^type\s+/, "")
        .trim()

      if (importsToRemove?.includes(cleanItem)) {
        continue
      }

      const shouldMove =
        shouldMoveAll ||
        imports.some((imp) => {
          if (typeof imp === "string") {
            return imp === cleanItem
          }
          return imp.name === cleanItem
        })

      if (shouldMove) {
        const importConfig = imports?.find(
          (imp) => typeof imp === "object" && imp.name === cleanItem,
        )
        if (typeof importConfig === "object" && importConfig.renameTo) {
          const renamed = item.replace(
            cleanItem,
            `${cleanItem} as ${importConfig.renameTo}`,
          )
          itemsToMove.push(renamed)
        } else {
          itemsToMove.push(item)
        }
      } else {
        itemsToKeep.push(item)
      }
    }

    const removedCount =
      importedItems.length - itemsToMove.length - itemsToKeep.length

    if (itemsToMove.length === 0 && removedCount === 0) {
      return {hasChanges: false, newLines: [line]}
    }

    const newLines: string[] = []
    const typePrefix = isTypeImport ? "type " : ""

    if (itemsToMove.length > 0) {
      newLines.push(
        `${indent}import ${typePrefix}{${itemsToMove.join(", ")}} from "${targetPackage}"`,
      )
    }

    if (itemsToKeep.length > 0) {
      newLines.push(
        `${indent}import ${typePrefix}{${itemsToKeep.join(", ")}} from "${sourcePackage}"`,
      )
    }

    return {hasChanges: true, newLines}
  }

  return {hasChanges: false, newLines: [line]}
}
