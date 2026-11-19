// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readdir, stat} from "node:fs/promises"
import {join, resolve} from "node:path"
import ts from "typescript"

import {InvalidConfigError} from "../errors.js"
import {resolveTsconfig} from "../internal/config.js"

export interface ProgramOptions {
  /**
   * Files or directories to document. Directories are expanded to every
   * TypeScript file they contain. Defaults to the files matched by the tsconfig.
   */
  entryPoints?: string[]

  tsconfig?: string
}

export interface ExtractorProgram {
  checker: ts.TypeChecker
  /**
   * The source files whose exports are documented.
   */
  entryFiles: ts.SourceFile[]
  program: ts.Program
}

const sourceExtension = /\.(d\.)?[cm]?tsx?$/

/**
 * Directory contents are sorted because `readdir` does not guarantee an order,
 * and the order decides which entity wins when two files export the same name.
 */
async function expandEntryPoint(entryPoint: string): Promise<string[]> {
  const path = resolve(entryPoint)
  const stats = await stat(path)
  if (!stats.isDirectory()) {
    return [path]
  }
  const entries = await readdir(path, {recursive: true, withFileTypes: true})
  return entries
    .filter((entry) => entry.isFile() && sourceExtension.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort()
}

export async function createExtractorProgram(
  options: ProgramOptions,
  oldProgram?: ts.Program,
): Promise<ExtractorProgram> {
  const tsconfigPath = options.tsconfig ? resolve(options.tsconfig) : undefined
  const tsconfig = resolveTsconfig(tsconfigPath)
  if (tsconfigPath && !tsconfig) {
    throw new InvalidConfigError(`Unable to read tsconfig: ${tsconfigPath}`)
  }

  const entryPoints = options.entryPoints?.length
    ? (await Promise.all(options.entryPoints.map(expandEntryPoint))).flat()
    : (tsconfig?.fileNames ?? [])

  const entryFileNames = [...new Set(entryPoints)]

  if (!entryFileNames.length) {
    throw new InvalidConfigError(
      "Invalid config: unable to resolve package entrypoints.",
    )
  }

  const program = ts.createProgram({
    oldProgram,
    options: {
      // no type checking is needed, but the user can override this.
      noCheck: true,
      ...tsconfig?.options,
      // without null checks the checker erases `null` and `undefined` from
      // types, so they would be missing from the documentation.
      strictNullChecks: true,
    },
    projectReferences: tsconfig?.projectReferences,
    rootNames: entryFileNames,
  })

  const entryFiles = entryFileNames
    .map((fileName) => program.getSourceFile(fileName))
    .filter((sourceFile): sourceFile is ts.SourceFile => !!sourceFile)

  return {checker: program.getTypeChecker(), entryFiles, program}
}
