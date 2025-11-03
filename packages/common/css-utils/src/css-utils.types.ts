import type {ChokidarOptions} from "chokidar/esm"

export interface CssFileGroup {
  /**
   * File glob
   */
  cssFiles: string[]

  /**
   * Optional ignored files in the {@link cssFiles} glob.
   */
  ignore?: string | string[]

  /**
   * The output file name of the aggregated CSS from this group.
   */
  outFileName: string

  /**
   * @option 'all': Outputs every CSS file encountered including the single aggregated file with the collected CSS.
   * @option 'aggregated-only': Only outputs the single aggregated file with all the CSS collected from each individual file.
   * @option 'individual-only': Identical to 'all', but omits the aggregated file.
   *
   * @default 'aggregated-only'
   */
  outputMode?: "all" | "aggregated-only" | "individual-only"
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
   * @option 'all': Log the name and minified size of every processed file.
   * @option 'aggregated-only': Only logs the name and minified size of the aggregated output files.
   * @option 'changed-only': Logs the name and minified size of the files that changed and their associated output files. Note that initially this will log every changed file.
   * @option 'silent': Disables logging.
   *
   * @default 'aggregated-only'
   */
  logMode?: "all" | "aggregate-only" | "changed-only" | "silent"

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
