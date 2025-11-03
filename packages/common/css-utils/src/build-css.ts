import autoprefixer from "autoprefixer"
import chalk from "chalk"
import cssnano from "cssnano"
import litePreset from "cssnano-preset-lite"
import {sync} from "glob"
import {createHash} from "node:crypto"
import {mkdir, readFile, stat, writeFile} from "node:fs/promises"
import {dirname, join, sep} from "node:path"
import {cwd} from "node:process"
import postcss from "postcss"
import minifySelectorsPlugin from "postcss-minify-selectors"
import postcssNested from "postcss-nested"
import {parse} from "postcss-scss"
import prettyMilliseconds from "pretty-ms"

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
import {findNearestPackageJson} from "./internal"

const stripCommentsPreset = litePreset({})

function humanFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  // @ts-expect-error
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ["B", "kB", "MB", "GB", "TB"][i]
  }`
}

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
  name: string
  size: number
}

export class CssBuilder {
  private cachedFileCount = 0
  private fileCount: number = 0
  private cache: Record<string, {css: string; md5: string}> = {}
  private readonly opts: Omit<CssBuilderConfig, "name" | "workingDir"> & {
    name: string
    workingDir: string
  }

  private isFirstBuild = true

  constructor({
    logMode = "aggregate-only",
    ...opts
  }: CssBuilderConfig & {isWatch?: boolean}) {
    const name = opts.name || findNearestPackageJson(cwd())?.name

    this.opts = {
      logMode,
      ...opts,
      name,
      watchOptions: opts.isWatch ? getDefaultWatchOptions(opts) : {},
      workingDir: opts.workingDir || cwd(),
    }
  }

  private get cacheEnabled() {
    return this.opts.watchOptions?.cache
  }

  private reset() {
    this.cachedFileCount = 0
    this.fileCount = 0
  }

  private hash(input: string) {
    return createHash("md5").update(input).digest("hex")
  }

  private sortArtifacts(artifacts: BuildArtifact[]) {
    return artifacts.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  private async buildCss({
    cssFiles,
    ignore,
    outFileName,
    outputMode,
  }: CssFileGroup): Promise<BuildArtifact[]> {
    const allCss: string[] = []

    const files = sync(cssFiles, {ignore})
    this.fileCount += files.length
    const changedFiles: BuildArtifact[] = []

    const minifiedCss: {name: string; size: number}[] = await Promise.all(
      files.map(async (file) => {
        const normalizedFileName = file.replace(`src${sep}`, "")
        const outFile = `${this.opts.outDir}/${normalizedFileName}`
        await ensureFile(outFile)
        const fileData = await readFile(file, "utf-8")

        let css = ""

        let fromCache = false
        if (this.cacheEnabled) {
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
            .then((res) => {
              return res.css
            })
        }

        if (this.cacheEnabled && !fromCache) {
          this.cache[outFile] = {
            css,
            md5: this.hash(fileData),
          }
        }

        if (outputMode !== "individual-only") {
          allCss.push(css)
        }
        if (outputMode !== "aggregated-only") {
          await writeFile(outFile, css)
        }

        const fileSize =
          outputMode !== "aggregated-only" ? (await stat(outFile)).size : 0

        const buildArtifact: BuildArtifact = {
          name: normalizedFileName,
          size: fileSize,
        }

        if (!fromCache && this.cacheEnabled && !this.isFirstBuild) {
          changedFiles.push(buildArtifact)
        }

        return buildArtifact
      }),
    ).catch((err) => {
      throw new Error(err.message)
    })

    const allMinCssPath = join(this.opts.outDir, outFileName)

    const outDirOnly = this.opts.outDir
      .replace(this.opts.workingDir, "")
      .replace(`${sep}`, "")

    if (outputMode !== "individual-only") {
      await writeFile(allMinCssPath, allCss.join(""), "utf-8")
    }

    let artifacts: BuildArtifact[]

    if (this.opts.logMode === "aggregate-only") {
      artifacts = [
        {
          name: `${outDirOnly}/${outFileName}`,
          size: (await stat(allMinCssPath)).size,
        },
      ]
    } else if (this.opts.logMode === "changed-only") {
      if (changedFiles.length === 0) {
        artifacts = []
      } else {
        artifacts = [
          ...this.sortArtifacts(changedFiles),
          {
            name: `${outDirOnly}/${outFileName}`,
            size: (await stat(allMinCssPath)).size,
          },
        ]
      }
    } else {
      artifacts = [
        ...this.sortArtifacts(minifiedCss),
        // sort "minified output file" to the end
        {
          name: `${outDirOnly}/${outFileName}`,
          size: (await stat(allMinCssPath)).size,
        },
      ]
    }

    return artifacts
  }

  /**
   * Collects all CSS from a file glob, merges it into a single file, and writes that
   * file to the supplied output folder.
   */
  async build() {
    this.reset()
    const startTime = new Date().getTime()

    await ensureDir(this.opts.outDir)

    const buildArtifacts: BuildArtifact[] = (
      await Promise.all(
        this.opts.fileGroups.map((group) => this.buildCss(group)),
      )
    ).flat()

    this.isFirstBuild = false

    const endTime = new Date().getTime()

    if (this.opts.logMode !== "silent") {
      for (const {name, size} of buildArtifacts) {
        console.debug(
          `${chalk.blueBright.bold(
            name.replace(this.opts.workingDir, "").padEnd(22),
          )} ${chalk.magenta.bold(humanFileSize(size).padEnd(12))}`,
        )
      }

      console.debug(
        chalk.green.bold(
          `Built ${chalk.blueBright.bold(this.opts.name)} css in ${chalk.magenta.bold(prettyMilliseconds(endTime - startTime))}${this.cachedFileCount ? chalk.greenBright.bold(` (${this.cachedFileCount}/${this.fileCount} files cached)`) : ""}`,
        ),
      )
    }
  }
}
