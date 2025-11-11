// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import type {Plugin as EsbuildPlugin, Metafile} from "esbuild"
import {readFileSync} from "node:fs"
import {gzipSync} from "node:zlib"

export interface BundleSizeLoggerPluginOptions {
  /**
   * Custom formatter for the size output
   */
  formatter?: (size: number) => string

  /**
   * Determines the logging mode of the plugin.
   *
   * @option individual: Logs the size of every entrypoint as defined in the package.json
   * `exports` field.
   * @option aggregate: only logs aggregated data summaries (total package size).
   * @option all: logs all metrics (individual and aggregate).
   * @option both: deprecated, migrate to `all`.
   * @option none: disables package size logging.
   *
   * @default aggregate
   */
  logMode?: "individual" | "aggregate" | "both" | "all" | "none"
}

/**
 * Formats bytes into a human-readable string
 * Uses KB for values less than 1MB, and larger units for bigger values
 * Always includes a leading 0 for values less than 1 KB
 *
 * @param bytes The number of bytes
 * @param decimals The number of decimal places to include (default: 2)
 * @returns A human-readable file size string (e.g., "0.75 KB", "3.21 MB")
 */
export function formatHumanFileSize(
  bytes: number,
  decimals: number = 2,
): string {
  if (bytes === 0) {
    return "0.00 KB"
  }

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  // For values less than 1MB, always use KB
  if (bytes < k * k) {
    // Convert bytes to KB
    const valueInKb = bytes / k

    // Format with leading 0 for values less than 1
    if (valueInKb < 1) {
      return `0${valueInKb.toFixed(decimals).substring(1)} KB`
    }

    // For values >= 1 KB but < 1 MB, use standard KB formatting
    return `${parseFloat(valueInKb.toFixed(decimals)).toFixed(decimals)} KB`
  }

  // For values >= 1MB, use the appropriate larger unit
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)

  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`
}

function getGzipSize(path: string): number {
  const content = readFileSync(path)
  const compressed = gzipSync(content)
  return compressed.length
}

/**
 * Creates an esbuild plugin that prints the file size of every file defined
 * in the package's exports field.
 */
export function bundleSizeLoggerPlugin(
  opts: BundleSizeLoggerPluginOptions = {
    logMode: "aggregate",
  },
): EsbuildPlugin {
  let prevMetafile: Metafile | undefined | null = null
  return {
    name: "exports-size-plugin",
    setup(build) {
      let printed = false
      build.onEnd(async (buildResult) => {
        if (printed || opts.logMode === "none") {
          return
        }
        printed = true
        const results = getBundleSize(buildResult.metafile, prevMetafile)
        prevMetafile = buildResult.metafile
        if (!results || "error" in results) {
          console.error("Error in exports-size-plugin", results?.error)
          return
        }
        logBundleSize(results, opts.logMode)
      })
    },
  }
}

interface ArtifactSizeData {
  filePath: string

  gzipSize?: number

  /**
   * The size from the previous compilation. Only relevant in watch mode.
   */
  prevSize?: number

  size: number
  /**
   * If true, this entrypoint has not changed since the last build.
   */
  unchanged?: boolean
}

export interface GetBundleSizeResult {
  entrypointSizes: ArtifactSizeData[]
  totalGzipSize: number
  totalSize: number
}

export function logOutputSizes(entrypointSizes: ArtifactSizeData[]): void {
  entrypointSizes.forEach(({filePath, gzipSize, size, unchanged}) => {
    if (!unchanged) {
      const output = [
        `${filePath.replace(`${process.cwd()}/`, "").padEnd(30)}`,
        `${formatHumanFileSize(size).padStart(10)}`,
      ]
      if (gzipSize) {
        output.push(`| gzip: ${formatHumanFileSize(gzipSize)}`)
      }
      console.log(chalk.dim(output.join(" ")))
    }
  })
}

export function logBundleSize(
  {entrypointSizes, totalSize}: GetBundleSizeResult,
  logMode: BundleSizeLoggerPluginOptions["logMode"],
): void {
  if (logMode === "aggregate") {
    logTotalSize(totalSize)
  } else if (logMode === "individual") {
    logOutputSizes(entrypointSizes)
  } else if (logMode === "all" || logMode === "both") {
    logOutputSizes(entrypointSizes)
    logTotalSize(totalSize)
  }
}

export function logTotalSize(totalSize: number): void {
  console.log(
    chalk.dim.bold(`Aggregate: `),
    chalk.yellow(formatHumanFileSize(totalSize)),
  )
}

export function getBundleSize(
  metafile: Metafile | undefined,
  prevMetafile: Metafile | undefined | null,
): GetBundleSizeResult | undefined {
  if (!metafile) {
    console.warn(
      "Can't log bundle sizes. No metafile found. Please ensure that your esbuild build options includes `metafile: true`.",
    )
    return
  }

  let totalSize = 0
  let totalGzipSize = 0

  const entrypointSizes = Object.keys(metafile.outputs).reduce(
    (acc: ArtifactSizeData[], current) => {
      if (current.endsWith(".map")) {
        return acc
      }
      const entry = metafile.outputs[current]
      const prevEntry = prevMetafile?.outputs[current]
      totalSize += entry.bytes
      const gzipSize = getGzipSize(current)
      totalGzipSize += gzipSize
      acc.push({
        filePath: current,
        gzipSize,
        prevSize: prevEntry?.bytes,
        size: entry.bytes,
        unchanged: !!(
          prevMetafile &&
          prevMetafile.outputs[current] &&
          JSON.stringify(prevMetafile.outputs[current]) ===
            JSON.stringify(entry)
        ),
      })
      return acc
    },
    [],
  )

  return {
    /**
     * This sort is necessary because Promise.all() resolves promises in completion
     * order, not creation order, making the file processing results potentially
     * inconsistent between runs.
     */
    entrypointSizes: entrypointSizes.sort((a, b) =>
      a.filePath.localeCompare(b.filePath),
    ),
    totalGzipSize,
    totalSize,
  }
}
