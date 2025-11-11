// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Plugin} from "esbuild"
import {readFile} from "node:fs/promises"
import {dirname, join} from "node:path"
import {inspect} from "node:util"
import {
  findConfigFile,
  parseConfigFileTextToJson,
  type ParsedCommandLine,
  parseJsonConfigFileContent,
  sys,
  transpileModule,
} from "typescript"

import {strip} from "./strip-it"

/**
 * @public
 */
export interface EsbuildDecoratorsOptions {
  /**
   * If empty, uses the current working directory
   */
  cwd?: string
  /**
   * If true, force compilation with tsc
   */
  force?: boolean
  /**
   * If empty, uses esbuild's tsconfig.json and falls back to the tsconfig.json in
   * the $cwd.
   */
  tsconfig?: string
  /**
   * If true, enables tsx file support
   */
  tsx?: boolean
}

const theFinder = new RegExp(
  /((?<![(\s]\s*['"])@\w[.[\]\w\d]*\s*(?![;])[((?=\s)])/,
)

function findDecorators(fileContent: string): boolean {
  return theFinder.test(strip(fileContent))
}

export function esbuildDecoratorPlugin(
  options: EsbuildDecoratorsOptions = {},
): Plugin {
  return {
    name: "esbuild-decorator-plugin",
    setup(build) {
      const cwd = options.cwd || process.cwd()
      const tsconfigPath =
        options.tsconfig ||
        build.initialOptions?.tsconfig ||
        join(cwd, "./tsconfig.json")
      const forceTsc = options.force ?? false
      const tsx = options.tsx ?? true

      let parsedTsConfig: ParsedCommandLine | null = null

      build.onLoad({filter: tsx ? /\.tsx?$/ : /\.ts$/}, async (args) => {
        if (!parsedTsConfig) {
          parsedTsConfig = parseTsConfig(tsconfigPath, cwd)
          if (parsedTsConfig.options.sourceMap) {
            parsedTsConfig.options.sourceMap = false
            parsedTsConfig.options.inlineSources = true
            parsedTsConfig.options.inlineSourceMap = true
          }
        }

        // Just return if we don't need to search the file.
        if (
          !forceTsc &&
          (!parsedTsConfig ||
            !parsedTsConfig.options ||
            !parsedTsConfig.options.emitDecoratorMetadata)
        ) {
          return
        }

        const ts = await readFile(args.path, "utf8").catch((err) =>
          printDiagnostics({err, file: args.path}),
        )

        if (!ts) {
          return
        }

        // Find the decorator and if there isn't one, return out
        const hasDecorator = findDecorators(ts)
        if (!ts || !hasDecorator) {
          return
        }

        const program = transpileModule(ts, {
          compilerOptions: parsedTsConfig.options,
          fileName: args.path,
        })
        return {contents: program.outputText}
      })
    },
  }
}

function parseTsConfig(
  tsconfigPath: string,
  cwd = process.cwd(),
): ParsedCommandLine {
  const fileName = findConfigFile(cwd, sys.fileExists, tsconfigPath)

  // if the value was provided, but no file, fail hard
  if (tsconfigPath !== undefined && !fileName) {
    throw new Error(`failed to open '${fileName}'`)
  }

  let loadedConfig = {}
  let baseDir = cwd
  if (fileName) {
    const text = sys.readFile(fileName)
    if (text === undefined) {
      throw new Error(`failed to read '${fileName}'`)
    }

    const result = parseConfigFileTextToJson(fileName, text)

    if (result.error !== undefined) {
      printDiagnostics(result.error)
      throw new Error(`failed to parse '${fileName}'`)
    }

    loadedConfig = result.config
    baseDir = dirname(fileName)
  }

  const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir)

  if (parsedTsConfig.errors[0]) {
    printDiagnostics(parsedTsConfig.errors)
  }

  return parsedTsConfig
}

function printDiagnostics(...args: any[]): void {
  console.log(inspect(args, false, 10, true))
}
