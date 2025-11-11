// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ChokidarOptions} from "chokidar"

export interface CssFileGroup {
  /**
   * File glob
   */
  cssFiles: string[]

  /**
   * Set to true to emit individual CSS files for each file in the group.
   */
  emitIndividualCssFiles?: boolean

  /**
   * Optional ignored files in the {@link cssFiles} glob.
   */
  ignore?: string | string[]

  /**
   * The output file name of the aggregated CSS from this group. Omit this to
   * disable emitting an aggregated CSS file.
   */
  outFileName?: string
}

/**
 * @public
 */
export interface CssBuilderWatchOptions {
  /**
   * Whether to trigger a build when the script first executes.
   *
   * @default true
   */
  buildOnInit?: boolean

  /**
   * Use an in-memory cache to speed up rebuilds.
   *
   * @default true
   */
  cache?: boolean

  /**
   * Options for the chokidar file watcher.
   */
  chokidarWatchOptions?: Partial<ChokidarOptions>

  /**
   * Files to exclude from the watcher.
   */
  exclude?: string | string[]

  /**
   * Files to include in the watcher.
   *
   * @default ["./"]
   */
  include?: string | string[]
}

export interface CssBuilderConfig {
  /**
   * Groups of CSS files. Each array entry is collected into a single output file.
   */
  fileGroups: CssFileGroup[]

  /**
   * @option 'info': Logs the name and minified size of the files that changed and their associated output files.
   * @option 'silent': Disables logging.
   *
   * @default 'info'
   */
  logLevel?: "info" | "silent"

  /**
   * The package name, used for logging. Defaults to the nearest package.json name.
   */
  name?: string

  /**
   * Output directory for the minified CSS.
   */
  outDir: string

  /**
   * File patterns to include/exclude from the watch script. We recommend passing
   * directories for `include`. This will not trigger watch mode. You must run the
   * watch CLI command or call the exported `watchCss` function to watch for
   * changes.
   *
   * @default `{include: "./", cache: true, buildOnInit: true}`
   */
  watchOptions?: CssBuilderWatchOptions

  /**
   * Working directory. Defaults to process.cwd()
   */
  workingDir?: string
}
