// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import autoprefixer from "autoprefixer"
import chalk from "chalk"
import cssnano from "cssnano"
import litePreset from "cssnano-preset-lite"
import {sync} from "glob"
import {createHash} from "node:crypto"
import {mkdir, readFile, stat, writeFile} from "node:fs/promises"
import {dirname, join, sep} from "node:path"
import {cwd} from "node:process"
import {promisify} from "node:util"
import {gzip} from "node:zlib"
import postcss from "postcss"
import minifySelectorsPlugin from "postcss-minify-selectors"
import postcssNested from "postcss-nested"
import {parse} from "postcss-scss"
import prettyMilliseconds from "pretty-ms"

const gzipAsync = promisify(gzip)
import {formatHumanFileSize} from "@qualcomm-ui/esbuild"

async function ensureDir(path: string): Promise<void> {
  await mkdir(path, {recursive: true})
}

async function ensureFile(path: string): Promise<void> {
  try {
    const stats = await stat(path)
    if (stats.isFile()) {
      return
    }
  } catch {}

  await mkdir(dirname(path), {recursive: true})
  await writeFile(path, "")
}

import type {
  CssBuilderConfig,
  CssBuilderWatchOptions,
  CssFileGroup,
} from "./css-utils.types"

const stripCommentsPreset = litePreset({})

export function getDefaultWatchOptions(
  opts: CssBuilderConfig,
): CssBuilderWatchOptions {
  return {
    buildOnInit: true,
    cache: true,
    ...opts.watchOptions,
  }
}

interface BuildArtifact {
  gzipSize: number
  name: string
  size: number
}

interface BuildResult {
  aggregateFile: BuildArtifact | null
  hasChanges: boolean
  individualFiles: BuildArtifact[]
}

class CssFileGroupBuilder {
  private cache: Record<string, {css: string; md5: string}> = {}
  private isFirstBuild = true
  private cachedFileCount = 0
  private fileCount = 0

  constructor(
    private group: CssFileGroup,
    private opts: {
      cacheEnabled: boolean
      outDir: string
      workingDir: string
    },
  ) {}

  private reset() {
    this.cachedFileCount = 0
    this.fileCount = 0
  }

  private hash(input: string) {
    return createHash("md5").update(input).digest("hex")
  }

  private sortArtifacts(artifacts: BuildArtifact[]) {
    return artifacts.sort((a, b) => a.name.localeCompare(b.name))
  }

  async build(): Promise<BuildResult> {
    this.reset()
    const {cssFiles, emitIndividualCssFiles, ignore, outFileName} = this.group

    const allCss: string[] = []
    const files = sync(cssFiles, {ignore})
    this.fileCount = files.length

    const changedFiles: BuildArtifact[] = []
    const minifiedCss: BuildArtifact[] = await Promise.all(
      files.map(async (file) => {
        const normalizedFileName = file.replace(`src${sep}`, "")
        const outFile = `${this.opts.outDir}/${normalizedFileName}`
        const fileData = await readFile(file, "utf-8")
        let css = ""
        let fromCache = false

        if (this.opts.cacheEnabled) {
          const fileMd5 = this.hash(fileData)
          const cachedFile = this.cache[outFile]
          if (cachedFile?.md5 === fileMd5) {
            this.cachedFileCount++
            fromCache = true
            css = cachedFile.css
          }
        }

        if (!fromCache) {
          css = await postcss([
            postcssNested,
            autoprefixer,
            minifySelectorsPlugin,
            cssnano({
              preset: stripCommentsPreset,
            }),
          ])
            .process(fileData, {
              from: file,
              parser: parse as any,
              to: outFile,
            })
            .then((res) => res.css)
        }

        if (this.opts.cacheEnabled && !fromCache) {
          this.cache[outFile] = {
            css,
            md5: this.hash(fileData),
          }
        }

        if (outFileName) {
          allCss.push(css)
        }

        if (emitIndividualCssFiles) {
          await ensureFile(outFile)
          await writeFile(outFile, css)
        }

        const buildArtifact: BuildArtifact = {
          gzipSize: await getGzipSizeFromString(css),
          name: normalizedFileName,
          size: Buffer.byteLength(css, "utf-8"),
        }

        if (!fromCache && this.opts.cacheEnabled && !this.isFirstBuild) {
          changedFiles.push(buildArtifact)
        }

        return buildArtifact
      }),
    ).catch((err) => {
      throw new Error(err.message)
    })

    const allMinCssPath = outFileName ? join(this.opts.outDir, outFileName) : ""
    const outDirOnly = this.opts.outDir
      .replace(this.opts.workingDir, "")
      .replace(`${sep}`, "")

    if (outFileName) {
      await writeFile(allMinCssPath, allCss.join(""), "utf-8")
    }

    async function getAggregateFile(): Promise<BuildArtifact | null> {
      if (!outFileName) {
        return null
      }
      return {
        gzipSize: await getGzipSize(allMinCssPath),
        name: `${outDirOnly}/${outFileName}`,
        size: (await stat(allMinCssPath)).size,
      }
    }

    const hasChanges = this.fileCount > this.cachedFileCount
    const individualFiles = this.isFirstBuild ? minifiedCss : changedFiles

    this.isFirstBuild = false

    return {
      aggregateFile: await getAggregateFile(),
      hasChanges,
      individualFiles: this.sortArtifacts(individualFiles),
    }
  }

  getStats() {
    return {
      cachedFileCount: this.cachedFileCount,
      fileCount: this.fileCount,
    }
  }
}

export class CssBuilder {
  private readonly opts: Omit<CssBuilderConfig, "name" | "workingDir"> & {
    name?: string
    workingDir: string
  }
  private builders: CssFileGroupBuilder[]

  constructor({...opts}: CssBuilderConfig & {isWatch?: boolean}) {
    const name = opts.name
    this.opts = {
      ...opts,
      name,
      watchOptions: opts.isWatch ? getDefaultWatchOptions(opts) : {},
      workingDir: opts.workingDir || cwd(),
    }

    const cacheEnabled = Boolean(this.opts.watchOptions?.cache)
    this.builders = this.opts.fileGroups.map(
      (group) =>
        new CssFileGroupBuilder(group, {
          cacheEnabled,
          outDir: this.opts.outDir,
          workingDir: this.opts.workingDir,
        }),
    )
  }

  async build() {
    const startTime = new Date().getTime()
    await ensureDir(this.opts.outDir)

    const buildResults: BuildResult[] = await Promise.all(
      this.builders.map((builder) => builder.build()),
    )

    if (this.opts.logLevel === "silent") {
      return
    }

    const endTime = new Date().getTime()

    let totalCachedFileCount = 0
    let totalFileCount = 0
    let hasAnyChanges = false

    for (let i = 0; i < buildResults.length; i++) {
      const result = buildResults[i]
      const stats = this.builders[i].getStats()

      totalCachedFileCount += stats.cachedFileCount
      totalFileCount += stats.fileCount

      if (result.hasChanges) {
        hasAnyChanges = true

        for (const artifact of result.individualFiles) {
          console.debug(
            chalk.dim(artifact.name.padEnd(22)),
            this.formatSize(artifact),
          )
        }

        if (result.aggregateFile) {
          console.debug(this.formatBuildArtifact(result.aggregateFile))
        }
      }
    }

    if (hasAnyChanges) {
      const parts: string[] = []

      parts.push(
        `Built${this.opts.name ? ` ${this.formatName(this.opts.name, 0)}` : " "}in ${chalk.magenta.bold(prettyMilliseconds(endTime - startTime))}`,
      )

      if (totalCachedFileCount > 0) {
        parts.push(
          chalk.greenBright.bold(
            `(${totalCachedFileCount}/${totalFileCount} files cached)`,
          ),
        )
      }

      console.debug(parts.join(" "))
    }
  }

  private formatBuildArtifact(buildArtifact: BuildArtifact): string {
    return `${this.formatName(buildArtifact.name)}${this.formatSize(buildArtifact)}`
  }

  private formatName(name: string, padEnd = 22) {
    return `${chalk.blueBright.bold(name.padEnd(padEnd))} `
  }

  private formatSize(buildArtifact: BuildArtifact) {
    const {gzipSize, size} = buildArtifact
    const fileSize = formatHumanFileSize(size)
    const gzipSizeStr = formatHumanFileSize(gzipSize)
    return `${chalk.dim.bold(`${fileSize} | gzip: ${gzipSizeStr}`)}`
  }
}

async function getGzipSize(path: string): Promise<number> {
  const content = await readFile(path)
  const compressed = await gzipAsync(content)
  return compressed.length
}

async function getGzipSizeFromString(content: string): Promise<number> {
  const buffer = Buffer.from(content, "utf-8")
  const compressed = await gzipAsync(buffer)
  return compressed.length
}
