// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createHash} from "node:crypto"
import {access} from "node:fs/promises"
import {dirname, join, resolve} from "node:path"
import ts from "typescript"

export async function exists(dirPath: string): Promise<boolean> {
  return access(dirPath)
    .then(() => true)
    .catch(() => false)
}

export function computeMd5(content: string): string {
  return createHash("md5").update(content).digest("hex")
}

export function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine) ||
    /^<!--\s*preview\s*-->$/.test(trimmedLine)
  )
}

export function removePreviewLines(code: string): string {
  return code
    .split("\n")
    .filter((line) => !isPreviewLine(line.trim()))
    .join("\n")
}

export function getIntroLines(
  projectName?: string,
  description?: string,
): string {
  const lines: string[] = []

  if (projectName) {
    lines.push(`# ${projectName}`)
  }

  if (description) {
    lines.push("")
    lines.push(`> ${description}`)
  }

  return lines.join("\n")
}

export function extractRelativeImports(content: string): string[] {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    content,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX,
  )

  const imports: string[] = []

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const path = statement.moduleSpecifier.text
      if (path.startsWith(".")) {
        imports.push(path)
      }
    }
  }

  return imports
}

export async function resolveModulePath(
  importPath: string,
  fromFile: string,
): Promise<string | null> {
  const fromDir = dirname(fromFile)
  const baseResolved = resolve(fromDir, importPath)
  const extensions = [".ts", ".tsx", ".js", ".jsx", ""]
  for (const ext of extensions) {
    const fullPath = baseResolved + ext
    if (await exists(fullPath)) {
      return fullPath
    }
  }
  if (await exists(baseResolved)) {
    const indexPath = join(baseResolved, "index.ts")
    if (await exists(indexPath)) {
      return indexPath
    }
  }
  return null
}
