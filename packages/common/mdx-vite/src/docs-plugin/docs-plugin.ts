// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {join} from "node:path"
import type {PluginOption, ResolvedConfig} from "vite"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {ConfigLoader, type QuiDocsPluginOptions} from "./config/index.js"
import {fixPath} from "./path-utils.js"
import {
  CONFIG_VIRTUAL_MODULE_ID,
  EXPORTS_VIRTUAL_MODULE_ID,
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

  return {
    apply(config, env) {
      return (
        (env.mode === "development" && env.command === "serve") ||
        (env.mode === "production" && env.command === "build")
      )
    },
    buildStart: async () => {
      state.buildIndex(state.buildCount > 0)
      state.buildCount++

      if (!isDev && state.knowledgeConfig) {
        await state.generateKnowledge(getPublicDir())
      }
    },
    configResolved(resolved) {
      viteConfig = resolved
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

      server.watcher.on("add", (path: string) => {
        if (path.endsWith(".mdx")) {
          state.handleChange({
            onComplete: () => {
              server.ws.send({type: "full-reload"})
              state.debouncedGenerateKnowledge(getPublicDir())
            },
          })
        }
      })
      server.watcher.on("unlink", (path: string) => {
        if (path.endsWith(".mdx")) {
          state.handleChange({
            onComplete: () => {
              server.ws.send({type: "full-reload"})
              state.debouncedGenerateKnowledge(getPublicDir())
            },
          })
        }
      })
      state.servers.push(server)
    },
    handleHotUpdate: ({file: updateFile, modules, server}) => {
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

        if (updateFile.endsWith(".mdx")) {
          state.debouncedGenerateKnowledge(getPublicDir())
          const files = state.buildIndex(true)

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
    load: (id): string | undefined => {
      if (id === PLUGIN_VIRTUAL_MODULE_ID) {
        return `export const siteData = ${JSON.stringify(state.siteData)}`
      }
      if (id === CONFIG_VIRTUAL_MODULE_ID) {
        return `export const quiDocsConfig = ${JSON.stringify({...state.config, cwd: state.cwd, publicDir: viteConfig.publicDir})}`
      }
      if (id === EXPORTS_VIRTUAL_MODULE_ID) {
        if (isDev) {
          // serve the sections/pages as middleware for faster updates in dev mode.
          // This prevents the vite dev server from slowing down from frequent,
          // large module invalidations.
          const {host = "localhost", port = 5173} = viteConfig.server
          const hostname = host === true ? "localhost" : host || "localhost"
          const base = `${viteConfig.server.https ? "https" : "http"}://${hostname}:${port}`
          return dedent`
            export const getSections = () => fetch('${base}/__qui-docs/sections').then(r => r.json())
            export const getPages = () => fetch('${base}/__qui-docs/pages').then(r => r.json())
          `
        }
        return dedent`
          export const getSections = () => Promise.resolve(${JSON.stringify(state.sections)})
          export const getPages = () => Promise.resolve(${JSON.stringify(state.pages)})
        `
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
      return undefined
    },
  }
}
