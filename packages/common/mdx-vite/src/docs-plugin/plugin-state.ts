// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import chokidar from "chokidar"
import {glob} from "glob"
import {readFileSync} from "node:fs"
import {mkdir, writeFile} from "node:fs/promises"
import {join, resolve} from "node:path"
import prettyMilliseconds from "pretty-ms"
import type {ViteDevServer} from "vite"

import type {
  KnowledgePages,
  KnowledgeSections,
  PageDocProps,
  SiteData,
} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import type {ResolvedQuiDocsConfig} from "./config"
import {ConfigLoader} from "./config/config-loader"
import {type CompiledMdxFile, MdxFileReader} from "./markdown"
import {KnowledgeExporter} from "./markdown/knowledge"
import {fixPath} from "./path-utils"
import {SearchIndexer} from "./search-indexer"

const isDev = process.env.NODE_ENV === "development"

// TODO: deprecate and rename to @qualcomm-ui/docs-plugin/site-data
export const PLUGIN_VIRTUAL_MODULE_ID = "\0@qualcomm-ui/mdx-vite-plugin"
export const CONFIG_VIRTUAL_MODULE_ID = "\0@qualcomm-ui/docs-plugin/config"
export const EXPORTS_VIRTUAL_MODULE_ID =
  "\0@qualcomm-ui/docs-plugin/markdown-content"

export interface ChangeOptions {
  onComplete?: () => void
}

export interface ExportsState {
  dir: string
  enabled: boolean
  pathnames: string[]
}

/**
 * TODO: adjust when https://github.com/vitejs/vite/discussions/16358 lands.
 */
export class PluginState {
  buildCount: number = 0
  config: ResolvedQuiDocsConfig | null = null
  configFilePath: string = ""
  docPropsFilePath: string = ""
  exports: ExportsState = {dir: "", enabled: false, pathnames: []}
  indexer!: SearchIndexer
  configLoader: ConfigLoader | null = null
  knowledgeConfig: ResolvedQuiDocsConfig["knowledge"] = undefined
  pages: KnowledgePages | null = null
  sections: KnowledgeSections | null = null
  routesDir!: string
  servers: ViteDevServer[] = []
  timeout: ReturnType<typeof setTimeout> | undefined = undefined
  exportsTimeout: ReturnType<typeof setTimeout> | undefined = undefined
  watching = false

  cwd!: string

  init(cwd: string) {
    this.cwd = cwd
  }

  getCwd() {
    return this.cwd
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

  get siteData(): SiteData & {
    config: Omit<ResolvedQuiDocsConfig, "filePath">
    exports: ExportsState
  } {
    const {filePath: _filePath, ...config} =
      this.config ?? ({} as ResolvedQuiDocsConfig)
    return {
      config,
      exports: this.exports,
      navItems: this.indexer.navItems,
      pageDocProps: this.indexer.pageDocProps as unknown as PageDocProps,
      pageMap: this.indexer.pageMap,
      searchIndex: this.indexer.searchIndex,
    }
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
    this.config = config
    this.configFilePath = config.filePath
    this.docPropsFilePath = config.typeDocProps
      ? fixPath(resolve(this.cwd, config.typeDocProps))
      : ""
    this.routesDir = fixPath(resolve(config.appDirectory, config.pageDirectory))
    this.knowledgeConfig = config.knowledge
    this.indexer = new SearchIndexer({
      ...config,
      srcDir: fixPath(resolve(this.cwd, config.appDirectory)),
      typeDocProps: this.resolveDocProps(),
    })

    const knowledgeEnabled = !!config.knowledge
    const outputPath = config.knowledge?.outputPath ?? "exports"
    this.exports = {
      dir: knowledgeEnabled ? `/${outputPath}` : "",
      enabled: knowledgeEnabled,
      pathnames: [],
    }
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
        `${chalk.magenta.bold(`@qualcomm-ui/mdx-vite/docs-plugin:`)} Compiled search index in: ${chalk.blueBright.bold(prettyMilliseconds(Date.now() - startTime))}${this.indexer.cachedFileCount ? chalk.greenBright.bold(` (${this.indexer.cachedFileCount}/${this.indexer.mdxFileCount} files cached)`) : ""}`,
      )
    }

    return compiledMdxFiles
  }

  sendUpdate() {
    for (const server of this.servers) {
      const virtualModule = server.moduleGraph.getModuleById(
        PLUGIN_VIRTUAL_MODULE_ID,
      )
      if (virtualModule) {
        server.moduleGraph.invalidateModule(virtualModule)
        server.reloadModule(virtualModule)
      }
    }
  }

  handleChange(opts: ChangeOptions = {}) {
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

  async generateKnowledge(publicDir: string): Promise<void> {
    if (!this.knowledgeConfig) {
      return
    }

    const outputDir = join(
      publicDir,
      this.knowledgeConfig.outputPath ?? "exports",
    )
    const startTime = Date.now()

    const fileReader = new MdxFileReader(false)
    const exporter = new KnowledgeExporter(
      {
        baseUrl: this.knowledgeConfig.baseUrl,
        docPropsPath: this.docPropsFilePath || undefined,
        exclude: this.knowledgeConfig.exclude,
        extraFiles: this.knowledgeConfig.extraFiles,
        frontmatter: this.knowledgeConfig.frontmatter,
        pageIdPrefix: this.knowledgeConfig.pageIdPrefix,
        pages: this.knowledgeConfig.pages,
        routeDir: this.routesDir,
        sections: this.knowledgeConfig.sections,
      },
      fileReader,
    )

    const result = await exporter.generate()
    this.pages = result.pages
    this.sections = result.sections

    await mkdir(outputDir, {recursive: true})
    await writeFile(
      join(outputDir, "sections.json"),
      JSON.stringify(result.sections, null, 2),
      "utf-8",
    )
    await writeFile(
      join(outputDir, "pages.json"),
      JSON.stringify(result.pages, null, 2),
      "utf-8",
    )

    this.exports.pathnames = result.pages.pages.map((p) => p.pathname)

    console.debug(
      `${chalk.magenta.bold(`@qualcomm-ui/mdx-vite/docs-plugin:`)} Generated knowledge exports in: ${chalk.blueBright.bold(prettyMilliseconds(Date.now() - startTime))}`,
    )
  }

  debouncedGenerateKnowledge(
    publicDir: string,
    opts: {onDone?: () => void} = {},
  ): void {
    if (!this.knowledgeConfig) {
      return
    }
    clearTimeout(this.exportsTimeout)
    this.exportsTimeout = setTimeout(() => {
      void this.generateKnowledge(publicDir).then(() => {
        opts.onDone?.()
      })
    }, 500)
  }
}
