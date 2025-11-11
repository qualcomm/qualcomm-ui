// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {lstat, readFile, writeFile} from "node:fs/promises"
import {resolve} from "path"
import {Application, type JSONOutput} from "typedoc"

import {humanFileSize} from "@qualcomm-ui/typedoc-common"

import {InvalidConfigError} from "./errors"
import {
  type ParseResult,
  parseTypes,
  resolveConfigSync,
  resolveTsconfig,
} from "./internal"
import {TimeLogger} from "./logger"
import {defaultOptions} from "./options"
import {
  loadDecoratorPlugin,
  loadInputSignalPlugin,
  loadStructuralDirectivePlugin,
} from "./plugins"
import type {BuildOptions, ResolvedBuildOptions} from "./types"

const defaultApiFile = ".typedoc/api.json"

export class TypeParser {
  get options(): ResolvedBuildOptions {
    return this._options
  }
  private set options(options: ResolvedBuildOptions) {
    this._options = {
      ...options,
      outputFile: options.outputFile || ".typedoc/doc-props.json",
    }
  }
  private _options!: ResolvedBuildOptions

  private logger: TimeLogger = new TimeLogger(false)

  constructor(private readonly optionsOrConfigPath: BuildOptions | string) {
    this.initConfig()
    // defaults
    this.options = {
      documentationScope: "only-public",
      ...this._options,
      outputFile: this._options.outputFile || ".typedoc/doc-props.json",
    }
    this.logger = new TimeLogger(this.options.logMode !== "quiet")
  }

  // TODO: validate with zod
  private initConfig() {
    if (typeof this.optionsOrConfigPath === "object") {
      // TODO: validate
      this._options = {
        outputFile: "",
        ...this.optionsOrConfigPath,
      }
      return
    }
    if (this.optionsOrConfigPath.length) {
      this.options = resolveConfigSync(this.optionsOrConfigPath)
      return
    }

    // no config passed as parameter, so search for it using cosmiconfig.
    this.options = resolveConfigSync()
  }

  private resolveEntrypoints() {
    const entryPoints = this.options.typedocOptions?.entryPoints ?? []

    if (entryPoints.length) {
      return entryPoints
    }
    const tsconfig = resolveTsconfig(
      this.options.typedocOptions?.tsconfig as string,
    )
    if (!tsconfig) {
      return []
    }

    const glob = Object.entries(tsconfig.wildcardDirectories ?? {})
      .filter(([, value]) => !!value)
      .map(([key]) => key)

    return [...glob, ...tsconfig.fileNames]
  }

  private resolveExclude(): string[] {
    const tsconfig = resolveTsconfig(
      this.options.typedocOptions?.tsconfig as string,
    )

    const exclude: string[] = [
      ...(this.options.typedocOptions?.exclude ?? []),
      ...(tsconfig?.raw?.exclude ?? []),
    ].flat()

    return exclude
  }

  private validateBuildOptions() {
    const entryPoints = this.resolveEntrypoints()
    if (!entryPoints?.length) {
      throw new InvalidConfigError(
        "Invalid config: unable to resolve package entrypoints.",
      )
    }
  }

  async build(): Promise<JSONOutput.ProjectReflection> {
    this.validateBuildOptions()
    const app = await Application.bootstrapWithPlugins({
      ...defaultOptions,
      ...this.options.typedocOptions,
      entryPoints: this.resolveEntrypoints(),
      exclude: this.resolveExclude(),
    })

    loadDecoratorPlugin(app)
    loadInputSignalPlugin(app)
    loadStructuralDirectivePlugin(app)

    this.logger.start(`Compiling TypeDoc JSON...`)

    const project = await app.convert()

    if (!project) {
      this.logger.failed("TypeDoc failed to generate api json")
      throw new Error("TypeDoc failed to generate api json")
    }

    await app.generateJson(
      project,
      resolve(this.options.apiFile || defaultApiFile),
    )

    const json: JSONOutput.ProjectReflection = await readFile(
      this.options.apiFile || defaultApiFile,
      {
        encoding: "utf-8",
      },
    ).then(JSON.parse)

    this.logger.succeed(`Compiled TypeDoc JSON: ${this.logger.elapsedTime}`)

    return json
  }

  async export(result: ParseResult) {
    await writeFile(
      resolve(this.options.outputFile),
      JSON.stringify(
        {
          descriptionDisclaimer:
            "This file generated from the build script of the @qualcomm-ui/typedoc package. Do not edit it directly.",
          props: result.types,
        },
        null,
        this.options.prettyJson ? 2 : 0,
      ),
    )
  }

  async printFileMetrics() {
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

  async parseTypes(json: JSONOutput.ProjectReflection) {
    this.logger.start()
    const result = await parseTypes(json, this.options)

    if (!result?.types) {
      this.logger.failed("Failed to generate type definitions")
      throw new Error("Failed to generate type definitions")
    }

    this.logger.succeed(
      `Type definitions generated: ${this.logger.elapsedTime}`,
    )

    return result
  }
}
