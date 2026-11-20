// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {basename, join} from "node:path"
import type {PluginOption, ResolvedConfig, ViteDevServer} from "vite"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {ConfigLoader, type QuiDocsPluginOptions} from "./config/index.js"
import {NAV_FILE_NAME} from "./nav-builder/load-folder-nav.js"
import {
  getOpenApiModuleCode,
  getOperationModuleCode,
  OPENAPI_OPERATION_MODULE_PREFIX,
} from "./open-api/get-module-code.js"
import {fixPath} from "./path-utils.js"
import {
  CONFIG_VIRTUAL_MODULE_ID,
  EXPORTS_VIRTUAL_MODULE_ID,
  OPENAPI_VIRTUAL_MODULE_ID,
  PLUGIN_VIRTUAL_MODULE_ID,
  PluginState,
} from "./plugin-state.js"

const isDev = process.env.NODE_ENV === "development"

const state = new PluginState()

export function quiDocsPlugin(opts?: QuiDocsPluginOptions): PluginOption {
  state.init(fixPath(opts?.cwd ?? process.cwd()))

  // https://vitejs.dev/guide/api-plugin#virtual-modules-convention

  const configLoader = new ConfigLoader(opts || {})
  const config = configLoader.loadConfig()
  state.createIndexer(config)

  let viteConfig: ResolvedConfig

  function getPublicDir() {
    return viteConfig.publicDir || join(state.getCwd(), "public")
  }

  function isNavFile(file: string) {
    return (
      basename(file) === NAV_FILE_NAME &&
      fixPath(file).startsWith(`${state.routesDir}/`)
    )
  }

  function reloadNavConfig(server: ViteDevServer) {
    state.reloadIndexer({
      onComplete: () => {
        server.ws.send({type: "full-reload"})
        state.debouncedGenerateKnowledge(getPublicDir())
      },
    })
  }

  /**
   * Route loaders run in the SSR environment, which `server.moduleGraph` doesn't
   * cover.
   */
  function invalidateOpenApiModule(server: ViteDevServer) {
    for (const environment of Object.values(server.environments)) {
      const {moduleGraph} = environment
      for (const [id, module] of moduleGraph.idToModuleMap) {
        if (
          id === OPENAPI_VIRTUAL_MODULE_ID ||
          id.startsWith(`\0${OPENAPI_OPERATION_MODULE_PREFIX}`)
        ) {
          moduleGraph.invalidateModule(module)
        }
      }
    }
  }

  function isOpenApiSpecFile(file: string) {
    return state.indexer.openApiSpecFiles.has(fixPath(file))
  }

  function getApiIntroPathnames() {
    return Object.keys(state.indexer.openApiNav).sort().join("\n")
  }

  /**
   * `withOpenApiRoutes` adds operation routes based on frontmatter, but React
   * Router only re-evaluates the route config when an app file is added or
   * removed, or when one of the config's own imports changes. A page gaining or
   * losing `openApi` is neither, so the server restarts to pick up its routes.
   */
  function restartForApiRoutes(server: ViteDevServer) {
    console.debug("OpenAPI pages changed, restarting to update the routes")
    void server.restart()
  }

  function reloadPages(server: ViteDevServer) {
    state.handleChange({
      onComplete: () => {
        invalidateOpenApiModule(server)
        server.ws.send({type: "full-reload"})
        state.debouncedGenerateKnowledge(getPublicDir())
      },
    })
  }

  return {
    apply(config, env) {
      return (
        (env.mode === "development" && env.command === "serve") ||
        (env.mode === "production" && env.command === "build")
      )
    },
    buildStart: async () => {
      await state.buildIndex(state.buildCount > 0)
      state.buildCount++

      const navConfigErrorCount = state.indexer.navConfigErrorCount
      if (!isDev && navConfigErrorCount) {
        throw new Error(
          `@qualcomm-ui/mdx-vite: found ${navConfigErrorCount} invalid ${NAV_FILE_NAME} file${navConfigErrorCount === 1 ? "" : "s"}. See the output above.`,
        )
      }

      const lintErrorCount = state.indexer.lintErrorCount
      if (!isDev && lintErrorCount) {
        throw new Error(
          `@qualcomm-ui/mdx-vite: found ${lintErrorCount} lint error${lintErrorCount === 1 ? "" : "s"} in MDX pages. See the output above, or adjust "lint" in your qui-docs config.`,
        )
      }

      if (!isDev && state.knowledgeConfig) {
        await state.generateKnowledge(getPublicDir())
      }
    },
    configResolved(resolved) {
      viteConfig = resolved
      state.setPublicDir(resolved.publicDir)
    },
    configureServer: async (server) => {
      if (!isDev) {
        return
      }
      state.initWatchers(opts?.configFile)

      if (state.knowledgeConfig) {
        await state.generateKnowledge(getPublicDir())
      }

      server.middlewares.use("/__qui-docs/pages", (_req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(state.pages))
      })

      server.middlewares.use("/__qui-docs/sections", (_req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(state.sections))
      })

      const onFileAddedOrRemoved = (path: string) => {
        if (isNavFile(path)) {
          reloadNavConfig(server)
        } else if (isOpenApiSpecFile(path) || path.endsWith(".mdx")) {
          reloadPages(server)
        }
      }
      server.watcher.on("add", onFileAddedOrRemoved)
      server.watcher.on("unlink", onFileAddedOrRemoved)
      state.servers.push(server)
      // A failed restart keeps the old server running, so it is only dropped
      // once it actually closes.
      server.httpServer?.once("close", () => {
        state.servers = state.servers.filter((s) => s !== server)
      })
    },
    handleHotUpdate: async ({file: updateFile, modules, server}) => {
      if (updateFile.endsWith(".css")) {
        return modules
      }
      const file = fixPath(updateFile)
      if (
        (!config.hotUpdateIgnore || !config.hotUpdateIgnore.test(file)) &&
        file !== state.configFilePath
      ) {
        if (
          state.docPropsDirectory &&
          file.startsWith(state.docPropsFilePath)
        ) {
          return []
        }

        if (isNavFile(file)) {
          reloadNavConfig(server)
          return []
        }

        if (isOpenApiSpecFile(file)) {
          reloadPages(server)
          return []
        }

        if (updateFile.endsWith(".mdx")) {
          state.debouncedGenerateKnowledge(getPublicDir())
          const apiIntroPathnames = getApiIntroPathnames()
          const files = await state.buildIndex(true)

          if (getApiIntroPathnames() !== apiIntroPathnames) {
            restartForApiRoutes(server)
            return []
          }

          invalidateOpenApiModule(server)

          const moduleByFile = server.moduleGraph.getModulesByFile(updateFile)
          if (!moduleByFile?.size) {
            console.debug("no module found for file, returning", updateFile)
            return []
          }

          const virtualModule = server.moduleGraph.getModuleById(
            PLUGIN_VIRTUAL_MODULE_ID,
          )
          if (virtualModule) {
            server.moduleGraph.invalidateModule(virtualModule)

            server.ws.send({
              data: state.siteData,
              event: "qui-docs-plugin:refresh-site-data",
              type: "custom",
            })
          }
          if (files.some((file) => file.metadata.changed.frontmatter)) {
            console.debug(
              "Frontmatter changed, reloading plugin to reflect changes in the page configuration",
            )
            if (virtualModule) {
              server.moduleGraph.invalidateModule(virtualModule)
            }
            server.ws.send({type: "full-reload"})
            return []
          }
          return virtualModule ? [virtualModule] : []
        }
      }
      return []
    },
    load: (id) => {
      if (id === PLUGIN_VIRTUAL_MODULE_ID) {
        return {
          code: `export const siteData = ${JSON.stringify(state.siteData)}`,
          map: {mappings: ""},
        }
      }
      if (id === OPENAPI_VIRTUAL_MODULE_ID) {
        return getOpenApiModuleCode(
          Object.keys(state.indexer.openApiOperations),
        )
      }
      if (id.startsWith(`\0${OPENAPI_OPERATION_MODULE_PREFIX}`)) {
        const pathname = decodeURIComponent(
          id.slice(OPENAPI_OPERATION_MODULE_PREFIX.length + 1),
        )
        return getOperationModuleCode(
          state.indexer.openApiOperations[pathname] ?? null,
        )
      }
      if (id === CONFIG_VIRTUAL_MODULE_ID) {
        return {
          code: `export const quiDocsConfig = ${JSON.stringify({...state.config, cwd: state.cwd, publicDir: viteConfig.publicDir})}`,
          map: {mappings: ""},
        }
      }
      if (id === EXPORTS_VIRTUAL_MODULE_ID) {
        if (isDev) {
          // serve the sections/pages as middleware for faster updates in dev mode.
          // This prevents the vite dev server from slowing down from frequent,
          // large module invalidations.
          const {host = "localhost", port = 5173} = viteConfig.server
          const hostname = host === true ? "localhost" : host || "localhost"
          const base = `${viteConfig.server.https ? "https" : "http"}://${hostname}:${port}`
          return {
            code: dedent`
              export const getSections = () => fetch('${base}/__qui-docs/sections').then(r => r.json())
              export const getPages = () => fetch('${base}/__qui-docs/pages').then(r => r.json())
            `,
            map: {mappings: ""},
          }
        }
        return {
          code: dedent`
            export const getSections = () => Promise.resolve(${JSON.stringify(state.sections)})
            export const getPages = () => Promise.resolve(${JSON.stringify(state.pages)})
          `,
          map: {mappings: ""},
        }
      }
      return undefined
    },
    name: "qui-mdx-vite-plugin",
    resolveId: (id) => {
      if (id === PLUGIN_VIRTUAL_MODULE_ID.substring(1)) {
        return PLUGIN_VIRTUAL_MODULE_ID
      }
      if (id === CONFIG_VIRTUAL_MODULE_ID.substring(1)) {
        return CONFIG_VIRTUAL_MODULE_ID
      }
      if (id === EXPORTS_VIRTUAL_MODULE_ID.substring(1)) {
        return EXPORTS_VIRTUAL_MODULE_ID
      }
      if (id === OPENAPI_VIRTUAL_MODULE_ID.substring(1)) {
        return OPENAPI_VIRTUAL_MODULE_ID
      }
      if (id.startsWith(OPENAPI_OPERATION_MODULE_PREFIX)) {
        return `\0${id}`
      }
      return undefined
    },
  }
}
