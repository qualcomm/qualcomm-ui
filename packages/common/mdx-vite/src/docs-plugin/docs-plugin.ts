// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import chokidar from "chokidar"
import {glob} from "glob"
import {readFileSync} from "node:fs"
import {resolve} from "node:path"
import prettyMilliseconds from "pretty-ms"
import type {PluginOption, ViteDevServer} from "vite"

import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import {
  type CompiledMdxFile,
  ConfigLoader,
  fixPath,
  type ResolvedQuiDocsConfig,
  SearchIndexer,
} from "./internal"

const isDev = process.env.NODE_ENV === "development"

interface ChangeOptions {
  onComplete?: () => void
}

export interface QuiDocsPluginOptions {
  /**
   * Path to the qui-docs config file. This is automatically detected if omitted.
   */
  configFile?: string

  /**
   * The current working directory.
   *
   * @default process.cwd()
   */
  cwd?: string
}

const VIRTUAL_MODULE_ID = "\0@qualcomm-ui/mdx-vite-plugin"

/**
 * TODO: adjust when https://github.com/vitejs/vite/discussions/16358 lands.
 */
class PluginState {
  buildCount: number = 0
  configFilePath: string = ""
  docPropsFilePath: string = ""
  indexer!: SearchIndexer
  configLoader: ConfigLoader | null = null
  routesDir!: string
  servers: ViteDevServer[] = []
  timeout: ReturnType<typeof setTimeout> | undefined = undefined
  watching = false

  private cwd!: string

  init(cwd: string) {
    this.cwd = cwd
  }

  get docPropsDirectory() {
    if (!this.docPropsFilePath) {
      return ""
    }
    return this.docPropsFilePath.substring(
      0,
      this.docPropsFilePath.lastIndexOf("/"),
    )
  }

  private resolveDocProps(): Record<string, QuiPropTypes> {
    if (!this.docPropsFilePath) {
      return {}
    }
    try {
      return JSON.parse(readFileSync(this.docPropsFilePath, "utf-8"))?.props
    } catch (e) {
      console.debug(
        "Invalid doc props file. Unable to parse JSON. Please check the file",
      )
      return {}
    }
  }

  createIndexer(config: ResolvedQuiDocsConfig) {
    this.configFilePath = config.filePath
    this.docPropsFilePath = config.typeDocProps
      ? fixPath(resolve(this.cwd, config.typeDocProps))
      : ""
    this.routesDir = fixPath(resolve(config.appDirectory, config.pageDirectory))
    this.indexer = new SearchIndexer({
      ...config,
      srcDir: fixPath(resolve(this.cwd, config.appDirectory)),
      typeDocProps: this.resolveDocProps(),
    })
  }

  buildIndex(shouldLog: boolean): CompiledMdxFile[] {
    const files = glob.sync(
      [`${this.routesDir}/**/*.mdx`, `${this.routesDir}/**/*.tsx`],
      {
        absolute: true,
        cwd: this.cwd,
      },
    )

    if (!files.length) {
      return []
    }

    const startTime = Date.now()

    const compiledMdxFiles = this.indexer.buildIndex(files, shouldLog)

    if (isDev && shouldLog) {
      console.debug(
        `${chalk.magenta.bold(`@qualcomm-ui/mdx-vite/docs-plugin:`)} Compiled search index in: ${chalk.blueBright.bold(prettyMilliseconds(Date.now() - startTime))}${state.indexer.cachedFileCount ? chalk.greenBright.bold(` (${state.indexer.cachedFileCount}/${state.indexer.mdxFileCount} files cached)`) : ""}`,
      )
    }

    return compiledMdxFiles
  }

  /**
   * When the user adds or removes mdx files, we re-index the site. This function
   * handles module invalidation so that virtual file imports are refreshed as
   * expected by the consumer's dev server.
   */
  sendUpdate() {
    for (const server of this.servers) {
      const virtualModule = server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
      if (virtualModule) {
        server.moduleGraph.invalidateModule(virtualModule)
        server.reloadModule(virtualModule)
      }
    }
  }

  handleChange(opts: ChangeOptions = {}) {
    // the plugin is activating twice in dev mode. It's mostly harmless, but we
    // prevent logs from emitting twice by flipping a flag

    // debounce the change handler to prevent rapid updates from triggering rebuilds
    // in quick succession.
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.buildIndex(true)
      this.sendUpdate()
      opts?.onComplete?.()
    }, 300)
  }

  initWatchers(configFile?: string) {
    if (this.watching) {
      return
    }
    this.initConfigWatcher(configFile)
    this.watching = true
  }

  private initConfigWatcher(configFile?: string) {
    const paths: string[] = [this.configFilePath]
    if (this.docPropsFilePath) {
      paths.push(this.docPropsFilePath)
    }
    chokidar
      .watch(paths, {
        cwd: this.cwd,
      })
      .on("change", () => {
        console.debug(`qui-docs config changed, reloading plugin`)
        this.configLoader = new ConfigLoader({configFile})
        const resolvedConfig = this.configLoader.loadConfig()
        this.configFilePath = resolvedConfig.filePath
        this.createIndexer(resolvedConfig)
        this.handleChange({
          onComplete: () => {
            this.servers.forEach((server) =>
              server.ws.send({type: "full-reload"}),
            )
          },
        })
      })
  }
}

const state = new PluginState()

export function quiDocsPlugin(opts?: QuiDocsPluginOptions): PluginOption {
  state.init(fixPath(opts?.cwd ?? process.cwd()))

  // https://vitejs.dev/guide/api-plugin#virtual-modules-convention

  const configLoader = new ConfigLoader(opts || {})
  const config = configLoader.loadConfig()
  state.createIndexer(config)

  return {
    buildStart: async () => {
      state.buildIndex(state.buildCount > 0)
      state.buildCount++
    },
    configureServer: (server) => {
      if (!isDev) {
        return
      }
      state.initWatchers(opts?.configFile)
      server.watcher.on("add", (path: string) => {
        if (path.endsWith(".mdx")) {
          state.handleChange({
            onComplete: () => {
              server.ws.send({type: "full-reload"})
            },
          })
        }
      })
      server.watcher.on("unlink", (path: string) => {
        if (path.endsWith(".mdx")) {
          state.handleChange({
            onComplete: () => {
              server.ws.send({type: "full-reload"})
            },
          })
        }
      })
      state.servers.push(server)
    },
    handleHotUpdate: async ({file: updateFile, modules, server}) => {
      const file = fixPath(updateFile)

      if (
        (!config.hotUpdateIgnore || !config.hotUpdateIgnore.test(file)) &&
        // ignore watched files. We watch for these separately.
        file !== state.configFilePath
      ) {
        if (
          state.docPropsDirectory &&
          file.startsWith(state.docPropsFilePath)
        ) {
          return []
        }

        const files = state.buildIndex(true)
        if (updateFile.endsWith(".mdx")) {
          // invalidate the plugin module so that the virtual file is refreshed
          const virtualModule =
            server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
          if (virtualModule) {
            server.moduleGraph.invalidateModule(virtualModule)
          }
          if (files.some((file) => file.metadata.changed.frontmatter)) {
            console.debug(
              "Frontmatter changed, reloading plugin to reflect changes in the page configuration",
            )
            server.ws.send({type: "full-reload"})
          }
        }
      }

      return modules
    },
    load: (id): string | undefined => {
      if (id === VIRTUAL_MODULE_ID) {
        return `export const siteData = ${JSON.stringify({navItems: state.indexer.navItems, pageDocProps: state.indexer.pageDocProps, pageMap: state.indexer.pageMap, searchIndex: state.indexer.searchIndex})}`
      }
      return undefined
    },
    name: "qui-mdx-vite-plugin",
    resolveId: (id) => {
      if (id === "@qualcomm-ui/mdx-vite-plugin") {
        return VIRTUAL_MODULE_ID
      }
      return undefined
    },
  }
}
