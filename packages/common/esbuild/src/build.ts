// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import esbuild, {
  type BuildOptions,
  type Plugin as EsbuildPlugin,
  type Metafile,
} from "esbuild"
import prettyMilliseconds from "pretty-ms"

import {
  type BundleSizeLoggerPluginOptions,
  formatHumanFileSize,
  getBundleSize,
  logOutputSizes,
} from "./plugins"

export async function buildOrWatch(
  options: BuildOptions,
  watch: boolean,
): Promise<void> {
  if (watch) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
  } else {
    await esbuild.build(options)
  }
}

export interface LogPluginOptions {
  /**
   * Options for bundle size reporting
   */
  bundleSizeOptions?: BundleSizeLoggerPluginOptions
  /**
   * Optional name to identify the build in logs
   */
  name?: string
}

let prevMetafile: Metafile | undefined | null = null

/**
 * A plugin that logs the build time and bundle size.
 *
 * @param opts
 */
export function logPlugin(opts: LogPluginOptions = {}): EsbuildPlugin {
  return {
    name: "qui-log-plugin",
    setup(pluginBuild) {
      const {onEnd, onStart} = pluginBuild
      let startTime: number = 0

      onStart(() => {
        startTime = Date.now()
      })

      onEnd((buildResult) => {
        const buildTime = Date.now() - startTime

        const bundleSizePluginOpts = opts.bundleSizeOptions

        const buildTimeFormatted = chalk.magenta.bold(
          prettyMilliseconds(buildTime),
        )

        let message = `Built ${opts.name ? `${chalk.cyan(opts.name)} ` : ""}in ${buildTimeFormatted}`

        if (!bundleSizePluginOpts || bundleSizePluginOpts.logMode === "none") {
          console.log(message)
          return
        }

        const results = getBundleSize(buildResult.metafile, prevMetafile)

        prevMetafile = buildResult.metafile

        if (!results) {
          return
        }

        const logMode = bundleSizePluginOpts.logMode

        if (
          logMode === "aggregate" ||
          logMode === "both" ||
          logMode === "all"
        ) {
          message += ` ${chalk.green("→")} ${chalk.dim(formatHumanFileSize(results.totalSize))}`
          message += chalk.dim(
            ` | gzip: ${formatHumanFileSize(results.totalGzipSize)}`,
          )
        }

        if (
          logMode === "individual" ||
          logMode === "both" ||
          logMode === "all"
        ) {
          logOutputSizes(results.entrypointSizes)
        }

        console.log(message)
      })
    },
  }
}
