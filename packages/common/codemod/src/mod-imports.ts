// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readdir, stat} from "node:fs/promises"
import {join} from "node:path"
import ora from "ora"

import {
  type ImportTransformEntry,
  transformMdx,
  transformTs,
} from "./transformers" // Adjust import path as needed

/**
 * Process all TypeScript/TSX files in a directory
 */
export async function processDirectory(
  directoryPath: string,
  options: ImportTransformEntry | ImportTransformEntry[],
  recursive = true,
  retVal: {changedFiles: Set<string>; processedFiles: Set<string>},
): Promise<void> {
  const files = await readdir(directoryPath)
  const optionsArray = Array.isArray(options) ? options : [options]

  await Promise.all(
    files.map(async (file) => {
      const filePath = join(directoryPath, file)
      const stats = await stat(filePath)

      if (stats.isDirectory() && recursive) {
        await processDirectory(filePath, options, recursive, retVal)
      } else if (stats.isFile()) {
        const isTypeScriptFile =
          filePath.endsWith(".ts") || filePath.endsWith(".tsx")
        const isMdxFile = filePath.endsWith(".mdx")

        if (isTypeScriptFile || isMdxFile) {
          retVal.processedFiles.add(filePath)
          const transformed = isTypeScriptFile
            ? transformTs(filePath, optionsArray)
            : await transformMdx(filePath, optionsArray)

          if (transformed) {
            retVal.changedFiles.add(filePath)
          }
        }
      }
    }),
  )
}

function groupEntriesBySource(
  entries: ImportTransformEntry[],
): Map<string, ImportTransformEntry[]> {
  const grouped = new Map<string, ImportTransformEntry[]>()

  for (const entry of entries) {
    const existing = grouped.get(entry.sourcePackage) || []
    existing.push(entry)
    grouped.set(entry.sourcePackage, existing)
  }

  return grouped
}

export interface ImportTransformConfig {
  /**
   * The filepath to process. Supports {@link https://www.npmjs.com/package/glob glob}
   * patterns.
   */
  dir: string
  /**
   * @default "info"
   */
  logMode?: "info" | "verbose"
}

export async function modImports(
  entries: ImportTransformEntry[],
  config: ImportTransformConfig,
): Promise<void> {
  const directories = await Promise.all(
    config.dir
      .split(",")
      .map((dir) => dir.trim())
      .map((dir) => glob(dir.endsWith("/") ? dir : `${dir}/`)),
  ).then((dirs) => dirs.flat())

  const logMode = config.logMode || "info"

  if (logMode === "verbose") {
    console.log(
      `Recursively processing directories:\n${directories.join("\n")}`,
    )
  }

  const spinner = ora("Processing files").start()
  const changedFiles: Set<string> = new Set<string>()
  const processedFiles: Set<string> = new Set<string>()

  // Group entries by source package to handle multiple targets
  const entriesBySource = groupEntriesBySource(entries).values()

  // Process entries sequentially to avoid race conditions
  for (const sourceEntries of entriesBySource) {
    await Promise.all(
      directories.map((dir) =>
        processDirectory(dir, sourceEntries, true, {
          changedFiles,
          processedFiles,
        }),
      ),
    )
  }

  if (logMode === "verbose") {
    processedFiles.forEach((file) => console.log(`Processed: ${file}`))
  }

  if (changedFiles.size) {
    console.log(Array.from(changedFiles).sort().join("\n"))
  }

  spinner.succeed(
    `Processed ${processedFiles.size} files (${changedFiles.size} updates)`,
  )
}

export function createImportModEntries(
  sourcePackage: string,
  options: Omit<ImportTransformEntry, "sourcePackage">[],
): ImportTransformEntry[] {
  return options.map((opt) => ({...opt, sourcePackage}))
}
