// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {lstat, mkdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import type ts from "typescript"

import {humanFileSize} from "@qualcomm-ui/typedoc-common"

import {extract, type ParseResult} from "./extractor/index.js"
import {resolveConfigSync} from "./internal/config.js"
import {TimeLogger} from "./logger.js"
import type {BuildOptions, ResolvedBuildOptions} from "./types.js"

const defaultOutputFile = ".typescoop/type-data.json"

export class TypeParser {
  readonly options: ResolvedBuildOptions

  private readonly logger: TimeLogger

  /**
   * The last program, reused by subsequent builds in watch mode.
   */
  private program: ts.Program | undefined

  constructor(optionsOrConfigPath: BuildOptions | string) {
    const options: BuildOptions =
      typeof optionsOrConfigPath === "object"
        ? optionsOrConfigPath
        : resolveConfigSync(optionsOrConfigPath || undefined)
    this.options = {
      documentationScope: "all",
      ...options,
      outputFile: options.outputFile || defaultOutputFile,
    }
    this.logger = new TimeLogger(this.options.logMode !== "quiet")
  }

  async build(): Promise<ParseResult> {
    this.logger.start()
    try {
      const {program, result} = await extract(this.options, this.program)
      this.program = program
      this.logger.succeed(
        `Type definitions generated: ${this.logger.elapsedTime}`,
      )
      return result
    } catch (error) {
      this.logger.failed("Failed to generate type definitions")
      throw error
    }
  }

  async export(result: ParseResult): Promise<void> {
    const outputFile = resolve(this.options.outputFile)
    await mkdir(dirname(outputFile), {recursive: true})
    await writeFile(
      outputFile,
      JSON.stringify(
        {
          descriptionDisclaimer:
            "This file generated from the build script of the @qualcomm-ui/typescoop package. Do not edit it directly.",
          props: result.types,
        },
        null,
        this.options.prettyJson ? 2 : 0,
      ),
    )
  }

  async printFileMetrics(): Promise<void> {
    const fileSize = await lstat(resolve(this.options.outputFile)).then((res) =>
      humanFileSize(res.size),
    )
    const name = this.options.outputFile.split("/").at(-1) ?? ""

    console.log(
      `${chalk.blueBright.bold(name.padEnd(12))} ${chalk.magenta.bold(
        fileSize.padEnd(12),
      )}`,
    )
  }
}
