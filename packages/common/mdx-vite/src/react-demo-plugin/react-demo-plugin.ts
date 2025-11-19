// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {transformerRenderIndentGuides} from "@shikijs/transformers"
import chalk from "chalk"
import {type FSWatcher, watch} from "chokidar"
import {glob} from "glob"
import {readFile} from "node:fs/promises"
import {basename, resolve} from "node:path"
import {createHighlighter, type Highlighter} from "shiki"
import * as ts from "typescript"
import type {Plugin} from "vite"

import {quiCustomDarkTheme, type ReactDemoData} from "@qualcomm-ui/mdx-common"
import {dedent} from "@qualcomm-ui/utils/dedent"
import {debounce} from "@qualcomm-ui/utils/functions"

import {LOG_PREFIX, VIRTUAL_MODULE_IDS} from "./demo-plugin-constants"
import type {QuiDemoPluginOptions} from "./demo-plugin-types"
import {
  addReactImports,
  createDemoName,
  createEmptyScopeModule,
  createUniqueModuleName,
  extractAllImports,
  extractFileImports,
  extractPageId,
  getScriptKind,
  isCssAsset,
  isDemoFile,
  type RelativeImport,
  sanitizeIdentifier,
} from "./demo-plugin-utils"

const isDev = process.env.NODE_ENV === "development"

let highlighter: Highlighter | null = null
let initCount = 0

interface HmrState {
  windowScrollY: number
}

const hmrState: HmrState = {
  windowScrollY: 0,
}
const demoRegistry = new Map<string, ReactDemoData>()
const pageScopes = new Map<string, string>()
const pageFiles = new Map<string, string[]>()
const relativeImportDependents = new Map<string, Set<string>>()

let hasWatcherInitialized = false

/**
 * Logs in dev mode only after the watcher has been initialized. Vite runs setup
 * hooks multiple times (once for each environment), so we use this approach to
 * ensure that certain messages are only logged once.
 */
function logDev(...args: any[]) {
  if (!hasWatcherInitialized) {
    return
  }
  console.log(...args)
}

/**
 * Generates virtual modules for React demos with isolated scopes.
 *
 * ## Why This Is Complex
 *
 * Demo scopes contain live module references (components, hooks, utilities) that
 * must be bundled at build time. Can't serialize over WebSocket, can't be
 * dynamically required. When a demo's imports change, the entire virtual module
 * regenerates.
 *
 * ## Core Constraints
 *
 * - **Adding/removing demos:** Structure changes, module regenerates, full reload
 * - **Editing demo imports:** Dependencies change, scope rebuilds, module
 * regenerates - **Editing demo code:** Still regenerates scope (even if imports
 * unchanged)
 *
 * Vite's HMR assumes stable module structure. We violate this assumption.
 *
 * ## Design Choices
 *
 * Lazy per-page (dev only): Loading 300 demos upfront kills dev server
 * performance. Split into ~30 page modules. Cost: dual code paths, regeneration
 * affects whole page.
 *
 * Manual dependency tracking: Map utility files → demos directly instead of
 * traversing Vite's graph (`utility.ts -> demo.tsx -> virtual:page:...`). Faster
 * but can drift.
 *
 * Custom HMR events: Return `[]` from `handleHotUpdate` to prevent Vite's
 * default HMR, manually invalidate modules, send WebSocket events for scroll
 * restoration.
 *
 * **Global state:** `demoRegistry`, `pageScopes`, etc. are module-level. If Vite
 * creates multiple plugin instances (SSR/client), they share state incorrectly.
 *
 * ## Alternatives Considered
 *
 * - `import.meta.glob`: Still requires regeneration when files added/removed
 * - Per-demo virtual modules: 300 modules, but would allow granular HMR (might be
 * worth it) - Runtime scope building: Defeats bundling, slower, no tree-shaking
 * - Server components: Demos need client interactivity
 *
 * ## Performance (dev mode)
 *
 * - Initial scan: ~2-3s for 300 demos
 * - Page navigation: ~100-300ms to load page module
 * - Demo edit: ~50-200ms to regenerate + HMR
 */
export function reactDemoPlugin({
  demoPattern = "src/routes/**/demos/*.tsx",
  lazyLoadDevModules = true,
  routesDir = "src/routes",
  theme = {
    dark: quiCustomDarkTheme,
    light: "github-light-high-contrast",
  },
  transformers = [],
  transformLine,
}: QuiDemoPluginOptions = {}): Plugin {
  let watcher: FSWatcher | null = null

  return {
    async buildEnd() {
      if (watcher) {
        await watcher.close()
        watcher = null
        hasWatcherInitialized = false
      }
    },

    async buildStart() {
      if (initCount === 0) {
        initCount++
        return
      }

      if (!highlighter) {
        try {
          highlighter = await createHighlighter({
            langs: ["tsx", "typescript"],
            themes: [theme.dark, theme.light],
          })
          console.log(
            `${chalk.magenta.bold(LOG_PREFIX)} Shiki highlighter initialized`,
          )
        } catch (error) {
          console.warn(
            `${chalk.magenta.bold(LOG_PREFIX)} Failed to initialize highlighter:`,
            error,
          )
        }
      }

      try {
        await collectReactDemos()
        if (isDev && !hasWatcherInitialized) {
          hasWatcherInitialized = true
          await setupFileWatcher()
        } else if (isDev) {
          logDev(
            `${chalk.magenta.bold(LOG_PREFIX)} skipping watch: watcher already initialized by another instance`,
          )
        }
      } catch (error) {
        if (watcher) {
          await watcher.close()
          watcher = null
          hasWatcherInitialized = false
        }
        throw error
      }
    },

    configureServer(server) {
      const debouncedRestore = debounce((data: {scrollY: number}) => {
        hmrState.windowScrollY = data.scrollY
      }, 100)
      server.ws.on("custom:store-scroll-position", debouncedRestore)

      server.ws.on("custom:request-scroll-position", () => {
        server.ws.send({
          data: hmrState.windowScrollY,
          event: "custom:restore-scroll-position",
          type: "custom",
        })
      })
    },
    enforce: "pre",

    /**
     * The primary issue is that scoped demos need their dependencies re-evaluated,
     * which means module invalidation. Vite's HMR isn't designed for this pattern.
     * We can work around this by invalidating the entire page scope for the
     * affected demo, and then re-evaluating the demo itself.
     */
    async handleHotUpdate({file, modules, server}) {
      if (isCssAsset(file)) {
        return server.moduleGraph.getModulesByFile(file)?.values()?.toArray()
      }

      if (!lazyLoadDevModules) {
        let shouldUpdate = false
        if (isDemoFile(file)) {
          await handleFileAdditionOrUpdate(file, false)
          shouldUpdate = true
        }
        const normalizedFile = resolve(file)
        const dependents = relativeImportDependents.get(normalizedFile)
        if (dependents) {
          shouldUpdate = true
        }

        if (shouldUpdate) {
          const autoModule = server.moduleGraph.getModuleById(
            VIRTUAL_MODULE_IDS.AUTO,
          )
          if (autoModule) {
            server.moduleGraph.invalidateModule(autoModule)
            await server.reloadModule(autoModule)
          }
          return modules
        }
      }

      if (isDemoFile(file)) {
        logDev(
          `${chalk.magenta.bold(LOG_PREFIX)} Processing change: ${chalk.blueBright.bold(file)}`,
        )

        const pageId = extractPageId(file, routesDir)
        const demoName = createDemoName(file)
        const wasNew = !demoRegistry.has(demoName)
        await handleFileAdditionOrUpdate(file, false)

        const pageModule = server.moduleGraph.getModuleById(
          `${VIRTUAL_MODULE_IDS.PAGE_PREFIX}${pageId}`,
        )
        if (pageModule) {
          console.debug(
            "invalidating:",
            `virtual:qui-demo-scope/page:${pageId}`,
          )
          server.moduleGraph.invalidateModule(pageModule)
          await server.reloadModule(pageModule)
        }
        if (wasNew) {
          const autoModule = server.moduleGraph.getModuleById(
            VIRTUAL_MODULE_IDS.AUTO,
          )
          if (autoModule) {
            server.moduleGraph.invalidateModule(autoModule)
            await server.reloadModule(autoModule)
          }
        }

        server.ws.send({
          data: demoRegistry.get(createDemoName(file)),
          event: "custom:qui-demo-update",
          type: "custom",
        })
      } else {
        const normalizedFile = resolve(file)
        const dependents = relativeImportDependents.get(normalizedFile)
        if (!dependents?.size) {
          return modules
        }
        const pageId = extractPageId(file, routesDir)
        const allPageFiles = pageFiles.get(pageId)!
        const scope = await generateScopeForPage(pageId, allPageFiles)
        pageScopes.set(pageId, scope)
        const pageModule = server.moduleGraph.getModuleById(
          `${VIRTUAL_MODULE_IDS.PAGE_PREFIX}${pageId}`,
        )
        if (pageModule) {
          console.debug(
            "invalidating:",
            `virtual:qui-demo-scope/page:${pageId}`,
          )
          server.moduleGraph.invalidateModule(pageModule)
          await server.reloadModule(pageModule)
        }

        if (dependents) {
          for (const demoName of dependents) {
            server.ws.send({
              data: demoRegistry.get(demoName),
              event: "custom:qui-demo-update",
              type: "custom",
            })
            server.ws.send({
              data: {demoName},
              event: "custom:qui-demo-scope-changed",
              type: "custom",
            })
          }
        }
      }

      return modules
    },

    async load(id) {
      if (id === VIRTUAL_MODULE_IDS.AUTO) {
        return generateAutoScopeModule()
      }
      if (id.startsWith(VIRTUAL_MODULE_IDS.PAGE_PREFIX)) {
        const pageId = id.replace(VIRTUAL_MODULE_IDS.PAGE_PREFIX, "")
        return pageScopes.get(pageId) || createEmptyScopeModule()
      }
      if (id === VIRTUAL_MODULE_IDS.CONFIG) {
        return generateConfigModule()
      }
    },

    name: "auto-demo-scope",

    resolveId(id) {
      if (id === "virtual:qui-demo-scope/auto") {
        return VIRTUAL_MODULE_IDS.AUTO
      }
      if (id.startsWith("virtual:qui-demo-scope/page:")) {
        return `\0${id}`
      }
      if (id === "virtual:qui-demo-scope/config") {
        return VIRTUAL_MODULE_IDS.CONFIG
      }
    },

    writeBundle() {
      console.log(
        `${chalk.blue.bold(LOG_PREFIX)} Successfully integrated ${chalk.green(demoRegistry.size)} component demos`,
      )
    },
  }

  async function setupFileWatcher() {
    watcher = watch(routesDir, {
      ignoreInitial: true,
      persistent: true,
    })

    watcher.on("ready", () => {
      logDev(
        `${chalk.blue.bold(LOG_PREFIX)} Registered ${chalk.green(demoRegistry.size)} demo files. Watching for file changes...`,
      )
    })

    watcher.on("addDir", (dirPath: string) => {
      if (dirPath.endsWith("/demos")) {
        logDev(
          `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.greenBright("New demo directory detected:")} ${chalk.blueBright.bold(dirPath)}`,
        )
      }
    })

    watcher.on("unlink", async (filePath: string) => {
      if (isDemoFile(filePath)) {
        logDev(
          `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.redBright("Demo file deleted:")} ${chalk.blueBright.bold(filePath)}`,
        )
        await handleFileDeletion(filePath)
      }
    })

    watcher.on("add", async (filePath: string) => {
      if (isDemoFile(filePath)) {
        logDev(
          `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.greenBright("Demo file added:")} ${chalk.blueBright.bold(filePath)}`,
        )
        await handleFileAdditionOrUpdate(filePath, true).catch(() => {
          console.debug("failed to add file", filePath)
        })
      }
    })
  }

  /**
   * True if the scope changed
   */
  async function handleFileAdditionOrUpdate(
    filePath: string,
    isAdd?: boolean,
  ): Promise<boolean> {
    const pageId = extractPageId(filePath, routesDir)
    const demoName = createDemoName(filePath)

    const existingFiles = pageFiles.get(pageId) ?? []
    if (!existingFiles.includes(filePath)) {
      existingFiles.push(filePath)
      pageFiles.set(pageId, existingFiles)
    }

    const fileData = await extractFileData(filePath)
    if (fileData) {
      demoRegistry.set(demoName, {
        ...fileData,
        demoName,
        pageId,
      })

      const fileImports = await extractFileImports(filePath)
      if (fileImports) {
        for (const relativeImport of fileImports.relativeImports) {
          const dependents =
            relativeImportDependents.get(relativeImport.resolvedPath) ??
            new Set()
          dependents.add(demoName)
          relativeImportDependents.set(relativeImport.resolvedPath, dependents)
        }
      }
    }

    const previousScope = pageScopes.get(pageId)
    const allPageFiles = pageFiles.get(pageId)!
    const scope = await generateScopeForPage(pageId, allPageFiles)
    pageScopes.set(pageId, scope)

    logDev(
      `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.greenBright(isAdd ? "Added demo:" : "Updated demo:")} ${chalk.greenBright.bold(demoName)}`,
    )

    return previousScope !== scope
  }

  async function handleFileDeletion(deletedFile: string) {
    const demoName = createDemoName(deletedFile)
    const pageId = extractPageId(deletedFile, routesDir)

    demoRegistry.delete(demoName)

    for (const [importPath, dependents] of relativeImportDependents.entries()) {
      dependents.delete(demoName)
      if (dependents.size === 0) {
        relativeImportDependents.delete(importPath)
      }
    }

    const files = pageFiles.get(pageId)
    if (files) {
      const updatedFiles = files.filter((f) => f !== deletedFile)
      if (updatedFiles.length === 0) {
        pageFiles.delete(pageId)
        pageScopes.delete(pageId)
        logDev(
          `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.redBright("Removed empty page:")} ${chalk.blueBright.bold(pageId)}`,
        )
      } else {
        pageFiles.set(pageId, updatedFiles)
        const scope = await generateScopeForPage(pageId, updatedFiles)
        pageScopes.set(pageId, scope)
      }
    }

    logDev(
      `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.redBright("Cleaned up deleted file:")} ${chalk.blueBright.bold(deletedFile)}`,
    )
  }

  function isPreviewLine(trimmedLine: string): boolean {
    return (
      trimmedLine === "// preview" ||
      /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine)
    )
  }

  function extractPreviewsAndCleanSource(code: string): {
    formattedPreview: string
    sourceWithoutSnippetComments: string
  } {
    const lines = code.split("\n")
    const previewBlocks: string[] = []
    const cleanedLines: string[] = []
    let inPreview = false
    let currentBlock: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (isPreviewLine(trimmedLine)) {
        if (inPreview) {
          previewBlocks.push(currentBlock.join("\n"))
          currentBlock = []
          inPreview = false
        } else {
          inPreview = true
        }
        continue
      }

      cleanedLines.push(line)
      if (inPreview) {
        currentBlock.push(line)
      }
    }

    const joined = previewBlocks.join("\n")
    const split = joined.split("\n")
    if (!split.at(-1)?.trim()) {
      split.pop()
    }

    return {
      formattedPreview: dedent(split.join("\n")).trim(),
      sourceWithoutSnippetComments: cleanedLines.join("\n"),
    }
  }

  async function highlightCode(code: string): Promise<string> {
    if (!highlighter) {
      return code
    }
    try {
      return highlighter.codeToHtml(code, {
        defaultColor: "light-dark()",
        lang: "tsx",
        themes: {
          dark: theme.dark,
          light: theme.light,
        },
        transformers: [transformerRenderIndentGuides(), ...transformers],
      })
    } catch (error) {
      console.warn(
        `${chalk.magenta.bold(LOG_PREFIX)} Failed to highlight code:`,
        error,
      )
      return code
    }
  }

  async function collectReactDemos() {
    if (demoRegistry.size && pageScopes.size && pageFiles.size) {
      logDev(
        `${chalk.magenta.bold(LOG_PREFIX)} Using cached ${chalk.cyanBright.bold(demoRegistry.size)} demos`,
      )
      return
    }

    const demoFiles = (await glob(demoPattern)).filter(isDemoFile)

    for (const filePath of demoFiles) {
      const pageId = extractPageId(filePath, routesDir)
      const existingFiles = pageFiles.get(pageId) ?? []
      existingFiles.push(filePath)
      pageFiles.set(pageId, existingFiles)

      const fileData = await extractFileData(filePath)
      if (fileData) {
        const demoName = createDemoName(filePath)
        demoRegistry.set(demoName, {
          ...fileData,
          pageId,
        })
      }

      const fileImports = await extractFileImports(filePath)
      if (fileImports) {
        for (const relativeImport of fileImports.relativeImports) {
          const demoName = createDemoName(filePath)
          const dependents =
            relativeImportDependents.get(relativeImport.resolvedPath) ??
            new Set()
          dependents.add(demoName)
          relativeImportDependents.set(relativeImport.resolvedPath, dependents)
        }
      }
    }

    // Generate one scope module per page
    for (const [pageId, files] of pageFiles.entries()) {
      const scope = await generateScopeForPage(pageId, files)
      pageScopes.set(pageId, scope)
    }
  }

  async function generateScopeForPage(
    pageId: string,
    files: string[],
  ): Promise<string> {
    const demosData = []

    // Collect all imports from all demos
    const allThirdPartyImports = new Map<
      string,
      Set<{imported: string; local: string}>
    >()
    const allRelativeImports: RelativeImport[] = []
    const demoImportData = new Map<
      string,
      {
        relative: Array<{
          resolvedPath: string
          specifiers: Array<{imported: string; local: string}>
        }>
        thirdParty: Array<{
          source: string
          specifiers: Array<{imported: string; local: string}>
        }>
      }
    >()

    for (const file of files) {
      const demoName = createDemoName(file)
      const demo = demoRegistry.get(demoName)
      if (!demo) {
        continue
      }

      demosData.push({
        demoName,
        fileName: demo.fileName,
        imports: demo.imports,
        pageId: demo.pageId,
        sourceCode: demo.sourceCode,
      })

      const {importMap, relativeImports} = await extractAllImports([file])

      demoImportData.set(demoName, {
        relative: relativeImports.map((r) => ({
          resolvedPath: r.resolvedPath,
          specifiers: r.specifiers,
        })),
        thirdParty: Array.from(importMap.entries()).map(([source, specs]) => ({
          source,
          specifiers: Array.from(specs),
        })),
      })

      for (const [source, specifiers] of importMap) {
        if (!allThirdPartyImports.has(source)) {
          allThirdPartyImports.set(source, new Set())
        }
        for (const spec of specifiers) {
          allThirdPartyImports.get(source)!.add(spec)
        }
      }
      for (const relImport of relativeImports) {
        if (
          !allRelativeImports.some(
            (r) => r.resolvedPath === relImport.resolvedPath,
          )
        ) {
          allRelativeImports.push(relImport)
        }
      }
    }

    const pageImports: string[] = []
    const reactScopeEntries: string[] = []
    addReactImports(pageImports, reactScopeEntries)

    const moduleNames = new Map<string, string>()
    const moduleRegistryEntries: string[] = []

    for (const [source] of Array.from(allThirdPartyImports.entries()).sort(
      ([a], [b]) => a.localeCompare(b),
    )) {
      const moduleName = createUniqueModuleName(source)
      moduleNames.set(source, moduleName)
      pageImports.push(`import * as ${moduleName} from "${source}"`)
      moduleRegistryEntries.push(`  "${source}": ${moduleName}`)
    }

    for (const {resolvedPath} of allRelativeImports) {
      const moduleName = createUniqueModuleName(resolvedPath)
      moduleNames.set(resolvedPath, moduleName)
      pageImports.push(`import * as ${moduleName} from "${resolvedPath}"`)
      moduleRegistryEntries.push(`  "${resolvedPath}": ${moduleName}`)
    }

    const demosJson = JSON.stringify(demosData)
    const demoImportDataJson = JSON.stringify(
      Array.from(demoImportData.entries()),
    )
    const reactScopeEntriesCode = reactScopeEntries
      .map((e) => `  ${e}`)
      .join(",\n")

    return `// Auto-generated page scope for ${pageId}
${pageImports.join("\n")}

const modules = {
${moduleRegistryEntries.join(",\n")}
}

const demosData = ${demosJson}
const demoImportData = new Map(${demoImportDataJson})

const reactScope = {
${reactScopeEntriesCode}
}

const scopeCache = new Map()

function createScope(demoName) {
  if (scopeCache.has(demoName)) {
    return scopeCache.get(demoName)
  }
  
  const imports = demoImportData.get(demoName)
  if (!imports) return {}
  
  const scope = {...reactScope}
  
  for (const {source, specifiers} of imports.thirdParty) {
    const mod = modules[source]
    if (!mod) continue
    
    for (const {imported, local} of specifiers) {
      if (imported === 'default') {
        scope[local] = mod.default
      } else if (imported === '*') {
        Object.assign(scope, mod)
      } else {
        scope[local] = mod[imported]
      }
    }
  }
  
  for (const {resolvedPath, specifiers} of imports.relative) {
    const mod = modules[resolvedPath]
    if (!mod) continue
    
    for (const {imported, local} of specifiers) {
      if (imported === 'default') {
        scope[local] = mod.default
      } else if (imported === '*') {
        Object.assign(scope, mod)
      } else {
        scope[local] = mod[imported]
      }
    }
  }
  
  scopeCache.set(demoName, scope)
  return scope
}

export function getDemo(demoName) {
  const demo = demosData.find(d => d.demoName === demoName)
  if (!demo) return null
  return {
    ...demo,
    scope: createScope(demoName)
  }
}

export function getDemos() {
  return demosData.map(demo => ({
    ...demo,
    scope: createScope(demo.demoName)
  }))
}
`
  }

  async function generateAutoScopeModule(): Promise<string> {
    if (isDev && lazyLoadDevModules) {
      return [
        "// Auto-generated demo scope resolver (DEV MODE - Lazy by Page)",
        generateLazyPageLoaders(),
        generateDemoToPageMap(),
        generateDevGetDemo(),
      ].join("\n\n")
    }

    const registryCode = generateDemoRegistry(demoRegistry)
    return [
      "// Auto-generated demo scope resolver (PROD MODE)",
      generatePageImports(),
      generateScopeMap(),
      registryCode,
      generateExportedFunctions(),
    ].join("\n\n")
  }

  function generateConfigModule(): string {
    return dedent`
      export function getReactDemoConfig() {
        return {lazyLoadDevModules: ${lazyLoadDevModules}}
      }
    `
  }

  function generateLazyPageLoaders(): string {
    const pageIds = Array.from(pageFiles.keys()).sort()

    if (pageIds.length === 0) {
      return "export const lazyDemoLoader = {}"
    }
    const entries = pageIds
      .map((pageId) => {
        return `  "${pageId}": () => import("virtual:qui-demo-scope/page:${pageId}")`
      })
      .join(",\n")
    return `export const lazyDemoLoader = {\n${entries}\n}`
  }

  function generateDemoToPageMap(): string {
    const entries = Array.from(demoRegistry.entries())
      .map(([demoName, {pageId}]) => {
        return `  "${demoName}": "${pageId}"`
      })
      .join(",\n")

    return `const demoToPageMap = {\n${entries}\n}`
  }

  function generateDevGetDemo(): string {
    return dedent`
    export async function getDemo(demoName) {
      const pageId = demoToPageMap[demoName]
      if (!pageId) {
        return {
          fileName: "",
          imports: [],
          errorMessage: \`Demo "\${demoName}" not found.\`,
          scope: {},
          pageId: "",
          sourceCode: [],
        }
      }
      
      const loader = lazyDemoLoader[pageId]
      if (!loader) {
        return {
          fileName: "",
          imports: [],
          errorMessage: \`Page "\${pageId}" not found.\`,
          scope: {},
          pageId: "",
          sourceCode: [],
        }
      }
      
      const pageModule = await loader()
      const demo = pageModule.getDemo(demoName)
      
      return demo || {
        fileName: "",
        imports: [],
        errorMessage: \`Demo "\${demoName}" not found in page.\`,
        scope: {},
        pageId: "",
        sourceCode: [],
      }
    }
  `
  }

  function extractHighlightedVariants(highlightedHtml: string): {
    highlightedPreview: string
    highlightedWithoutPreview: string
  } {
    const preMatch = highlightedHtml.match(/^<pre[^>]*><code>/)?.[0] || ""
    const postMatch = highlightedHtml.match(/<\/code><\/pre>$/)?.[0] || ""
    const content = highlightedHtml.slice(preMatch.length, -postMatch.length)
    const lines = content.split("\n")
    const previewLines: string[] = []
    const withoutPreviewLines: string[] = []
    let inPreview = false

    for (const line of lines) {
      const textContent = line
        .replace(/<[^>]*>/g, "")
        .replace(/&#x3C;/g, "<")
        .replace(/&#x3E;/g, ">")
        .trim()
      if (textContent === "// preview" || textContent === "{/* preview */}") {
        inPreview = !inPreview
        continue
      }
      if (inPreview) {
        previewLines.push(line)
      }
      withoutPreviewLines.push(line)
    }

    const normalizedPreviewLines = normalizeIndentation(previewLines)
    const highlightedPreview =
      normalizedPreviewLines.length > 0
        ? `${preMatch}${normalizedPreviewLines.join("\n")}${postMatch}`
        : ""
    const highlightedWithoutPreview = `${preMatch}${withoutPreviewLines.join("\n")}${postMatch}`
    return {highlightedPreview, highlightedWithoutPreview}
  }

  function normalizeIndentation(lines: string[]): string[] {
    if (lines.length === 0) {
      return []
    }
    const nonEmptyLines = lines.filter(
      (line) => line.replace(/<[^>]*>/g, "").trim().length > 0,
    )
    if (nonEmptyLines.length === 0) {
      return lines
    }
    let minIndent = Infinity
    for (const line of nonEmptyLines) {
      const matches = line.match(/<span class="indent">/g)
      if (matches) {
        minIndent = Math.min(minIndent, matches.length)
      } else {
        minIndent = 0
        break
      }
    }
    if (minIndent === 0 || minIndent === Infinity) {
      return lines
    }
    return lines.map((line) => {
      let result = line
      for (let i = 0; i < minIndent; i++) {
        result = result.replace(/<span class="indent">(\s*)<\/span>/, "")
      }
      return result
    })
  }

  function transformLines(code: string): string {
    if (!transformLine) {
      return code
    }
    const result: string[] = []
    for (const line of code.split("\n")) {
      if (line.trim()) {
        const transformed = transformLine(line)
        if (transformed) {
          result.push(transformed)
        }
      } else {
        // include all empty lines
        result.push(line)
      }
    }
    return result.join("\n")
  }

  async function extractFileData(
    filePath: string,
  ): Promise<Omit<ReactDemoData, "pageId"> | null> {
    try {
      const code = await readFile(filePath, "utf-8").then(transformLines)

      const {imports, strippedCode: codeWithoutImports} = stripImports(
        code,
        filePath,
      )
      const fileName = basename(filePath)
      const {formattedPreview, sourceWithoutSnippetComments} =
        extractPreviewsAndCleanSource(code)

      const highlightedFull = await highlightCode(code)

      const {highlightedPreview, highlightedWithoutPreview} =
        extractHighlightedVariants(highlightedFull)

      const sourceCode = [
        {
          fileName,
          highlighted: {
            full: highlightedWithoutPreview,
            preview: highlightedPreview,
          },
          raw: {
            full: sourceWithoutSnippetComments,
            preview: formattedPreview,
            withoutImports: codeWithoutImports,
          },
        },
      ]

      const fileImports = await extractFileImports(filePath)
      if (fileImports) {
        for (const relativeImport of fileImports.relativeImports) {
          try {
            const importedCode = await readFile(
              relativeImport.resolvedPath,
              "utf-8",
            ).then(transformLines)

            const {strippedCode: importedCodeWithoutImports} = stripImports(
              importedCode,
              relativeImport.resolvedPath,
            )
            const {
              sourceWithoutSnippetComments: importedSourceWithoutSnippets,
            } = extractPreviewsAndCleanSource(importedCode)
            const importedFileName = basename(relativeImport.resolvedPath)
            const highlightedImportedSource = await highlightCode(
              importedSourceWithoutSnippets,
            )
            sourceCode.push({
              fileName: importedFileName,
              highlighted: {
                full: highlightedImportedSource,
                preview: "",
              },
              raw: {
                full: importedSourceWithoutSnippets,
                preview: "",
                withoutImports: importedCodeWithoutImports,
              },
            })
          } catch (error) {
            logDev(
              `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.yellowBright("Failed to process relative import:")} ${chalk.blueBright.bold(relativeImport.resolvedPath)}`,
            )
          }
        }
      }

      return {
        demoName: createDemoName(filePath),
        fileName,
        imports,
        sourceCode,
      }
    } catch (e) {
      logDev(
        `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.yellowBright("Failed to parse")} ${chalk.blueBright.bold(filePath)}. ${chalk.yellowBright("Removing from registry")}`,
      )
      return null
    }
  }

  function stripImports(
    code: string,
    fileName: string,
  ): {
    imports: string[]
    strippedCode: string
  } {
    try {
      const sourceFile = ts.createSourceFile(
        fileName,
        code,
        ts.ScriptTarget.Latest,
        true,
        getScriptKind(fileName),
      )

      const importRanges: Array<{end: number; start: number}> = []

      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
          importRanges.push({
            end: node.getEnd(),
            start: node.getFullStart(),
          })
        }
        ts.forEachChild(node, visit)
      }

      visit(sourceFile)

      const imports = importRanges.map((range) => {
        let endPos = range.end
        if (code[endPos] === "\n") {
          endPos++
        }
        return code.slice(range.start, endPos).trim()
      })

      importRanges.sort((a, b) => b.start - a.start)

      let strippedCode = code
      for (const range of importRanges) {
        let endPos = range.end
        if (strippedCode[endPos] === "\n") {
          endPos++
        }
        strippedCode =
          strippedCode.slice(0, range.start) + strippedCode.slice(endPos)
      }

      strippedCode = strippedCode.trim()

      return {
        imports,
        strippedCode: strippedCode.replace(/^\n+/, ""),
      }
    } catch (error) {
      logDev(
        `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.redBright("Failed to strip imports from")} ${chalk.blueBright.bold(fileName)}:`,
        error,
      )
      return {
        imports: [],
        strippedCode: code,
      }
    }
  }

  function generatePageImports(): string {
    const pageIds = Array.from(pageScopes.keys())
    return pageIds
      .map((pageId) => {
        const safeName = sanitizeIdentifier(pageId)
        return `import * as page_${safeName} from "virtual:qui-demo-scope/page:${pageId}"`
      })
      .join("\n")
  }

  function generateScopeMap(): string {
    const pageIds = Array.from(pageScopes.keys())
    if (pageIds.length === 0) {
      return "const pageModules = {}"
    }

    const entries = pageIds
      .map((pageId) => {
        const safeName = sanitizeIdentifier(pageId)
        return `  "${pageId}": page_${safeName}`
      })
      .join(",\n")

    return `const pageModules = {\n${entries}\n}`
  }

  function generateDemoRegistry(registry: Map<string, ReactDemoData>): string {
    const entries = Array.from(registry.entries())
      .map(([demoName, {fileName, imports, pageId, sourceCode}]) => {
        return `  ["${demoName}", { fileName: "${fileName}", imports: ${JSON.stringify(imports)}, pageId: "${pageId}", sourceCode: ${JSON.stringify(sourceCode)}, demoName: "${demoName}" }]`
      })
      .join(",\n")
    return `const demoRegistry = new Map([\n${entries}\n])`
  }

  function generateExportedFunctions(): string {
    return dedent`
    export function getDemo(demoName) {
      const demo = demoRegistry.get(demoName)
      if (!demo) {
        return {
          fileName: "",
          imports: [],
          errorMessage: \`Demo "\${demoName}" not found.\`,
          scope: {},
          pageId: "",
          sourceCode: [],
        }
      }
      
      const pageModule = pageModules[demo.pageId]
      if (!pageModule) {
        return {
          fileName: "",
          imports: [],
          errorMessage: \`Page module not found.\`,
          scope: {},
          pageId: demo.pageId,
          sourceCode: [],
        }
      }
      
      return pageModule.getDemo(demoName) || {
        fileName: demo.fileName,
        imports: demo.imports,
        scope: {},
        pageId: demo.pageId,
        sourceCode: demo.sourceCode,
      }
    }
  `
  }
}
