#!/usr/bin/env node

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readdirSync, readFileSync, statSync} from "node:fs"
import {join, relative, sep} from "node:path"

import type {ImportTransformEntry} from "../transformers"

export interface ExportInfo {
  filePath: string
  name: string
  type:
    | "function"
    | "class"
    | "interface"
    | "type"
    | "const"
    | "default"
    | "named"
    | "reexport"
}

export interface DirectoryStats {
  exports: ExportInfo[]
  exportsByType: Record<string, number>
  files: string[]
  totalExports: number
}

export class ExportAnalyzer {
  private exports: ExportInfo[] = []
  private processedFiles = 0

  stats: Map<string, DirectoryStats> | null = null

  analyzeDirectory(rootPath: string): ExportAnalyzer {
    console.log(`🔍 Scanning directory: ${rootPath}`)

    this.scanDirectory(rootPath)

    console.log(`✅ Processed ${this.processedFiles} TypeScript files\n`)

    this.stats = this.aggregateByTopLevelDirectory(rootPath)
    return this
  }

  private scanDirectory(dirPath: string): void {
    try {
      const entries = readdirSync(dirPath)

      for (const entry of entries) {
        const fullPath = join(dirPath, entry)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          // Skip common directories that don't contain source code
          if (!["node_modules", ".git", "dist", "build"].includes(entry)) {
            this.scanDirectory(fullPath)
          }
        } else if (this.isTypeScriptFile(entry)) {
          this.analyzeFile(fullPath)
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not scan directory ${dirPath}: ${error}`)
    }
  }

  private isTypeScriptFile(filename: string): boolean {
    return /\.(ts|tsx)$/.test(filename)
  }

  private analyzeFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, "utf-8")
      const exports = this.extractExports(content, filePath)
      this.exports.push(...exports)
      this.processedFiles++
    } catch (error) {
      console.warn(`⚠️  Could not analyze file ${filePath}: ${error}`)
    }
  }

  private extractExports(content: string, filePath: string): ExportInfo[] {
    const exports: ExportInfo[] = []

    // Remove comments and strings to avoid false matches
    const cleanContent = this.removeCommentsAndStrings(content)

    // Export patterns
    const patterns = [
      // export function/class/interface/type
      {
        handler: (match: RegExpExecArray) => ({
          filePath,
          name: match[2],
          type: match[1] as ExportInfo["type"],
        }),
        regex:
          /export\s+(function|class|interface|type)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      },
      // export const/let/var
      {
        handler: (match: RegExpExecArray) => ({
          filePath,
          name: match[2],
          type: "const" as const,
        }),
        regex: /export\s+(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      },
      // export default
      {
        handler: (match: RegExpExecArray) => ({
          filePath,
          name: match[1] || match[2] || match[3] || "default",
          type: "default" as const,
        }),
        regex:
          /export\s+default\s+(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|([a-zA-Z_$][a-zA-Z0-9_$]*))/g,
      },
      // export { ... }
      {
        handler: (match: RegExpExecArray) => {
          const namedExports = match[1]
            .split(",")
            .map((exp) =>
              exp
                .trim()
                .split(/\s+as\s+/)[0]
                .trim(),
            )
            .filter((name) => name && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name))

          return namedExports.map((name) => ({
            filePath,
            name,
            type: "named" as const,
          }))
        },
        regex: /export\s*\{\s*([^}]+)\s*\}/g,
      },
      // export * from "..."
      {
        handler: (match: RegExpExecArray) => ({
          filePath,
          name: `* from "${match[1]}"`,
          type: "reexport" as const,
        }),
        regex: /export\s+\*\s+from\s+["']([^"']+)["']/g,
      },
    ]

    for (const pattern of patterns) {
      let match: RegExpExecArray | null
      while ((match = pattern.regex.exec(cleanContent)) !== null) {
        const result = pattern.handler(match)
        if (Array.isArray(result)) {
          exports.push(...result)
        } else {
          exports.push(result)
        }
      }
    }

    return exports
  }

  private removeCommentsAndStrings(content: string): string {
    // Simple approach: remove single-line comments, multi-line comments, and string
    // literals
    return content
      .replace(/\/\*[\s\S]*?\*\//g, " ") // Multi-line comments
      .replace(/\/\/.*$/gm, " ") // Single-line comments
      .replace(/"(?:[^"\\]|\\.)*"/g, '""') // Double-quoted strings
      .replace(/'(?:[^'\\]|\\.)*'/g, "''") // Single-quoted strings
      .replace(/`(?:[^`\\]|\\.)*`/g, "``") // Template literals
  }

  private aggregateByTopLevelDirectory(
    rootPath: string,
  ): Map<string, DirectoryStats> {
    const stats = new Map<string, DirectoryStats>()

    for (const exportInfo of this.exports) {
      const relativePath = relative(rootPath, exportInfo.filePath)
      const topLevelDir = relativePath.split(sep)[0]

      if (!stats.has(topLevelDir)) {
        stats.set(topLevelDir, {
          exports: [],
          exportsByType: {},
          files: [],
          totalExports: 0,
        })
      }

      const dirStats = stats.get(topLevelDir)!
      dirStats.totalExports++
      dirStats.exportsByType[exportInfo.type] =
        (dirStats.exportsByType[exportInfo.type] || 0) + 1
      dirStats.exports.push(exportInfo)

      if (!dirStats.files.includes(exportInfo.filePath)) {
        dirStats.files.push(exportInfo.filePath)
      }
    }

    return stats
  }

  createMigrationConfig(
    sourcePackageName: string,
  ): [string, Omit<ImportTransformEntry, "sourcePackage">[]] {
    if (!this.stats) {
      throw new Error("No stats available, did you run analyzeDirectory()?")
    }

    const entries: Omit<ImportTransformEntry, "sourcePackage">[] = []

    // Sort directories by total exports (descending)
    const sortedEntries = Array.from(this.stats.entries()).sort(
      ([, a], [, b]) => b.totalExports - a.totalExports,
    )

    for (const [dirName, dirStats] of sortedEntries) {
      const targetPackage = `${sourcePackageName}/${dirName}`
      const imports: string[] = []

      for (const exp of Object.values(dirStats.exports)) {
        imports.push(exp.name)
      }

      entries.push({imports, targetPackage})
    }

    return [sourcePackageName, entries]
  }

  printReport(): void {
    if (!this.stats) {
      throw new Error("No stats available, did you run analyzeDirectory()?")
    }
    console.log("📊 Export Analysis Report")
    console.log("=".repeat(50))

    // Sort directories by total exports (descending)
    const sortedEntries = Array.from(this.stats.entries()).sort(
      ([, a], [, b]) => b.totalExports - a.totalExports,
    )

    for (const [dirName, dirStats] of sortedEntries) {
      console.log(`\n${dirName}`)

      for (const exp of Object.values(dirStats.exports)) {
        console.log(`  ${exp.name}`)
      }
    }
  }
}
