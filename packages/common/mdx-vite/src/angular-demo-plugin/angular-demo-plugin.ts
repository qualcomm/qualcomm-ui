// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {transformerRenderIndentGuides} from "@shikijs/transformers"
import chalk from "chalk"
import {type FSWatcher, watch} from "chokidar"
import {glob} from "glob"
import {existsSync} from "node:fs"
import {readFile, stat} from "node:fs/promises"
import {basename, dirname, join, relative, resolve} from "node:path"
import {
  createHighlighter,
  type Highlighter,
  type ThemeRegistration,
  type ThemeRegistrationRaw,
  type ThemeRegistrationResolved,
} from "shiki"
import * as ts from "typescript"
import type {Plugin, ViteDevServer} from "vite"

import {
  type AngularDemoInfo,
  type ExtractedPreview,
  type PreviewContext,
  quiCustomDarkTheme,
  type SourceCodeData,
} from "@qualcomm-ui/mdx-common"

export interface AngularDemoPluginOptions {
  demoPattern?: string | string[]
  /**
   * A mapping of <demoId, initialHtml>, which will be used for the initial
   * serverside render of each demo to prevent FOUC.
   */
  initialHtml?: Record<string, string>
  routesDir?: string
  theme?: {
    dark:
      | ThemeRegistrationRaw
      | ThemeRegistration
      | ThemeRegistrationResolved
      | string
    light:
      | ThemeRegistrationRaw
      | ThemeRegistration
      | ThemeRegistrationResolved
      | string
  }
}

interface RelativeImport {
  resolvedPath: string
  source: string
}

interface PathAlias {
  pattern: RegExp
  replacement: string
}

const VIRTUAL_MODULE_ID = "\0virtual:angular-demo-registry"
const VIRTUAL_MODULE_PREFIX = "virtual:angular-demo-registry/"
const LOG_PREFIX = "[angular-demo]"

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

let demoDimensionsCache: Record<string, DOMRect> = {}
let highlighter: Highlighter | null = null
let initCount = 0
const demoRegistry = new Map<string, AngularDemoInfo>()

let hotUpdateDemoIds: string[] = []

export function angularDemoPlugin({
  demoPattern = "src/routes/**/demos/*.ts",
  initialHtml,
  routesDir = "src/routes",
  theme = {
    dark: quiCustomDarkTheme,
    light: "github-light-high-contrast",
  },
}: AngularDemoPluginOptions = {}): Plugin {
  let watcher: FSWatcher | null = null
  let devServer: ViteDevServer | null = null

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
            langs: ["angular-ts", "angular-html"],
            themes: [theme.dark, theme.light],
          })
          logDev(`${chalk.blue.bold(LOG_PREFIX)} Shiki highlighter initialized`)
        } catch (error) {
          console.warn(
            `${chalk.blue.bold(LOG_PREFIX)} Failed to initialize highlighter:`,
            error,
          )
        }
      }

      logDev(`${chalk.blue.bold(LOG_PREFIX)} Initializing Angular demo scanner`)
      await collectAngularDemos()

      if (process.env.NODE_ENV === "development") {
        if (!hasWatcherInitialized) {
          hasWatcherInitialized = true
          await setupAngularWatcher()
        } else {
          logDev(
            `${chalk.blue.bold(LOG_PREFIX)} Watcher already initialized by another instance`,
          )
        }
      }
    },

    configureServer(server) {
      devServer = server
      let dimensionUpdateTimeout: NodeJS.Timeout | null = null

      server.ws.on(
        "custom:store-demo-dimensions",
        (data: {demoId: string; dimensions: DOMRect}) => {
          const demoId = data.demoId
          demoDimensionsCache[demoId] = data.dimensions

          if (dimensionUpdateTimeout) {
            clearTimeout(dimensionUpdateTimeout)
          }

          dimensionUpdateTimeout = setTimeout(() => {
            const module = server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
            if (module) {
              server.moduleGraph.invalidateModule(module)
            }
          }, 50)
        },
      )

      server.ws.on("custom:reset-demo-dimensions", () => {
        demoDimensionsCache = {}
        const module = server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          server.reloadModule(module)
        }
      })
    },

    async handleHotUpdate({file, modules, server}) {
      if (!isAngularDemoFile(file)) {
        if (isCssAsset(file)) {
          return modules
        } else if (file.endsWith("main.js")) {
          const ids = [...hotUpdateDemoIds]
          server.ws.send({
            data: {
              demoInfo: ids.reduce(
                (acc: Record<string, AngularDemoInfo | undefined>, current) => {
                  acc[current] = demoRegistry.get(current)
                  return acc
                },
                {},
              ),
            },
            event: "demo-bundle-updated",
            type: "custom",
          })
        }
        return []
      }

      logDev(
        `${chalk.blue.bold(LOG_PREFIX)} Processing Angular demo change: ${chalk.cyan(file)}`,
      )

      const code = await readFile(file, "utf-8")
      const demoInfo = await parseAngularDemo(file, code)

      if (!demoInfo) {
        // might be an imported file
        const affectedDemos: AngularDemoInfo[] =
          await scanDemosForFileImport(file)

        if (affectedDemos.length > 0) {
          hotUpdateDemoIds = []
          for (const demo of affectedDemos) {
            hotUpdateDemoIds.push(demo.id)
          }
        }

        server.ws.send({
          data: {
            ids: [...hotUpdateDemoIds],
          },
          event: "demo-bundle-updating",
          type: "custom",
        })

        return
      }

      delete demoDimensionsCache[demoInfo.id]
      demoRegistry.set(demoInfo.id, demoInfo)
      hotUpdateDemoIds = [demoInfo.id]

      server.ws.send({
        data: {
          ids: [...hotUpdateDemoIds],
        },
        event: "demo-bundle-updating",
        type: "custom",
      })

      const mainModule = server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
      if (mainModule) {
        server.moduleGraph.invalidateModule(mainModule)
        await server.reloadModule(mainModule)
      }

      const pageModuleId = `\0${VIRTUAL_MODULE_PREFIX}${demoInfo.pageId}`
      const pageModule = server.moduleGraph.getModuleById(pageModuleId)
      if (pageModule) {
        server.moduleGraph.invalidateModule(pageModule)
        await server.reloadModule(pageModule)
      }

      const demoModule = server.moduleGraph.getModuleById(file)
      if (demoModule) {
        server.moduleGraph.invalidateModule(demoModule)
      }

      return []
    },

    async load(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return generateRegistryModule()
      }
      if (id.startsWith(`\0${VIRTUAL_MODULE_PREFIX}`)) {
        const pageId = id.slice(`\0${VIRTUAL_MODULE_PREFIX}`.length)
        return generatePageRegistryModule(pageId)
      }
    },

    name: "angular-demo-plugin",

    resolveId(id) {
      if (id === "virtual:angular-demo-registry") {
        return VIRTUAL_MODULE_ID
      }
      if (id.startsWith(VIRTUAL_MODULE_PREFIX)) {
        const pageId = id.slice(VIRTUAL_MODULE_PREFIX.length)
        return `\0${VIRTUAL_MODULE_PREFIX}${pageId}`
      }
    },

    writeBundle() {
      console.log(
        `${chalk.blue.bold(LOG_PREFIX)} Successfully integrated ${chalk.green(demoRegistry.size)} component demos`,
      )
    },
  }

  async function collectAngularDemos() {
    if (demoRegistry.size) {
      logDev(
        `${chalk.magenta.bold(LOG_PREFIX)} Using cached ${chalk.cyanBright.bold(demoRegistry.size)} demos`,
      )
      return
    }

    const demoFiles = await glob(demoPattern)
    demoRegistry.clear()

    for (const filePath of demoFiles) {
      const code = await readFile(filePath, "utf-8")
      const demoInfo = await parseAngularDemo(filePath, code)
      if (demoInfo) {
        demoRegistry.set(demoInfo.id, demoInfo)
      }
    }
  }

  async function scanDemosForFileImport(
    file: string,
  ): Promise<AngularDemoInfo[]> {
    const affectedDemos: AngularDemoInfo[] = []
    for (const [demoId, demo] of demoRegistry.entries()) {
      if (demo.sourceCode.find((entry) => entry.filePath === file)) {
        logDev(
          `${chalk.blue.bold(LOG_PREFIX)} Re-parsing demo ${chalk.cyan(demoId)} due to imported file change: ${chalk.yellow(file)}`,
        )
        const code = await readFile(demo.filePath, "utf-8")
        const updatedDemo = await parseAngularDemo(demo.filePath, code)
        if (updatedDemo) {
          delete demoDimensionsCache[updatedDemo.id]
          demoRegistry.set(updatedDemo.id, updatedDemo)
          affectedDemos.push(updatedDemo)
          hotUpdateDemoIds.push(updatedDemo.id)
        }
      }
    }
    return affectedDemos
  }

  async function highlightCode(
    code: string,
    language: "angular-ts" | "angular-html" = "angular-ts",
  ): Promise<string> {
    if (!highlighter) {
      return code
    }

    try {
      return highlighter.codeToHtml(code, {
        defaultColor: "light-dark()",
        lang: language,
        themes: {
          dark: theme.dark,
          light: theme.light,
        },
        transformers: [transformerRenderIndentGuides()],
      })
    } catch (error) {
      console.warn(
        `${chalk.blue.bold(LOG_PREFIX)} Failed to highlight code with ${language} language:`,
        error,
      )
      return code
    }
  }

  function extractAngularPreviewsAndCleanSource(
    code: string,
  ): ExtractedPreview {
    const lines = code.split("\n")
    const previewBlocks: PreviewContext[] = []
    const cleanedLines: string[] = []
    let inPreview = false
    let currentBlock: string[] = []
    let startLine = -1
    let currentContext: "template" | "typescript" = "typescript"
    let inTemplate = false
    let templateDepth = 0
    let omitNextLine = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      if (/template\s*:\s*[`"']/.test(line)) {
        inTemplate = true
        templateDepth = 0
      }

      if (inTemplate && line.includes("`")) {
        const backticks = (line.match(/`/g) || []).length
        templateDepth += backticks
        if (templateDepth % 2 === 0 && backticks > 0) {
          inTemplate = false
        }
      }

      if (inTemplate && /['"]\s*[,}]/.test(line)) {
        inTemplate = false
      }

      if (omitNextLine) {
        omitNextLine = false
        continue
      }

      if (isOmitNextLine(trimmedLine)) {
        omitNextLine = true
        continue
      }

      if (isPreviewLine(trimmedLine)) {
        if (inPreview) {
          const normalizedContent = normalizeIndentation(currentBlock)
          previewBlocks.push({
            content: normalizedContent,
            context: currentContext,
            endLine: i - 1,
            startLine,
          })
          currentBlock = []
          inPreview = false
        } else {
          inPreview = true
          startLine = i + 1
          currentContext = inTemplate ? "template" : "typescript"
        }
      } else {
        cleanedLines.push(line)
        if (inPreview) {
          currentBlock.push(line)
        }
      }
    }

    function normalizeIndentation(lines: string[]): string {
      if (lines.length === 0) {
        return ""
      }
      const nonEmptyLines = lines.filter((line) => line.trim().length > 0)
      if (nonEmptyLines.length === 0) {
        return lines.join("\n")
      }
      let minIndent = Infinity
      for (const line of nonEmptyLines) {
        const match = line.match(/^(\s*)/)
        const indent = match ? match[1].length : 0
        minIndent = Math.min(minIndent, indent)
      }
      const normalizedLines = lines.map((line) => {
        if (line.trim().length === 0) {
          return line
        }
        return line.slice(minIndent)
      })
      return normalizedLines.join("\n")
    }

    const formattedPreview = previewBlocks.length
      ? previewBlocks.map((block) => block.content).join("\n")
      : ""

    return {
      formattedPreview,
      previewBlocks,
      sourceWithoutPreviews: cleanedLines.join("\n"),
    }
  }

  function isPreviewLine(trimmedLine: string): boolean {
    return (
      trimmedLine === "// preview" ||
      /^\/\*\s*preview\s*\*\/$/.test(trimmedLine) ||
      /^<!--\s*preview\s*-->$/.test(trimmedLine)
    )
  }

  async function extractRelativeImports(
    filePath: string,
  ): Promise<RelativeImport[]> {
    try {
      const content = await readFile(filePath, "utf-8")
      const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      )

      const relativeImports: RelativeImport[] = []

      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier
          if (ts.isStringLiteral(moduleSpecifier)) {
            const source = moduleSpecifier.text
            if (isRelativeImport(source)) {
              const resolvedPath = resolveRelativeImport(source, filePath)
              relativeImports.push({resolvedPath, source})
            } else if (!isNodeBuiltin(source)) {
              const pathAliases = loadTsConfigPaths(filePath)
              if (isPathAliasImport(source, pathAliases)) {
                const resolvedPath = resolvePathAlias(source, pathAliases)
                if (resolvedPath) {
                  relativeImports.push({resolvedPath, source})
                }
              }
            }
          }
        }
        ts.forEachChild(node, visit)
      }

      visit(sourceFile)
      return relativeImports
    } catch (error) {
      logDev(
        `${chalk.blue.bold(LOG_PREFIX)} ${chalk.yellowBright("Failed to extract imports from")} ${chalk.cyan(filePath)}:`,
        error,
      )
      return []
    }
  }

  async function collectAllImports(
    filePath: string,
    visited = new Set<string>(),
  ): Promise<string[]> {
    if (visited.has(filePath)) {
      return []
    }
    visited.add(filePath)

    const directImports = await extractRelativeImports(filePath)

    for (const {resolvedPath} of directImports) {
      await collectAllImports(resolvedPath, visited)
    }

    return Array.from(visited).slice(1)
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
        ts.ScriptKind.TS,
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
        `${chalk.blue.bold(LOG_PREFIX)} ${chalk.redBright("Failed to strip imports from")} ${chalk.cyan(fileName)}:`,
        error,
      )
      return {
        imports: [],
        strippedCode: code,
      }
    }
  }

  async function parseAngularDemo(
    filePath: string,
    code: string,
  ): Promise<AngularDemoInfo | null> {
    try {
      const {formattedPreview, sourceWithoutPreviews} =
        extractAngularPreviewsAndCleanSource(code)

      const sourceFile = ts.createSourceFile(
        filePath,
        sourceWithoutPreviews,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      )

      let componentClass = ""
      let selector = ""
      let isStandalone = true
      let templateUrl: string | null = null
      const imports: string[] = []
      let hasDefaultExport = false

      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
          imports.push(node.getFullText(sourceFile).trim())
        }

        if (ts.isClassDeclaration(node)) {
          const decorators = node.modifiers?.filter(ts.isDecorator)
          const componentDecorator = decorators?.find((decorator) => {
            if (ts.isCallExpression(decorator.expression)) {
              const expression = decorator.expression.expression
              return (
                ts.isIdentifier(expression) && expression.text === "Component"
              )
            }
            return false
          })

          if (componentDecorator && node.name) {
            componentClass = node.name.text

            if (
              ts.isCallExpression(componentDecorator.expression) &&
              componentDecorator.expression.arguments[0] &&
              ts.isObjectLiteralExpression(
                componentDecorator.expression.arguments[0],
              )
            ) {
              const properties =
                componentDecorator.expression.arguments[0].properties

              const selectorProp = properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === "selector",
              ) as ts.PropertyAssignment | undefined

              if (
                selectorProp &&
                ts.isStringLiteral(selectorProp.initializer)
              ) {
                selector = selectorProp.initializer.text
              }

              const templateUrlProp = properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === "templateUrl",
              ) as ts.PropertyAssignment | undefined

              if (templateUrlProp) {
                if (ts.isStringLiteral(templateUrlProp.initializer)) {
                  templateUrl = templateUrlProp.initializer.text
                } else if (
                  ts.isNoSubstitutionTemplateLiteral(
                    templateUrlProp.initializer,
                  )
                ) {
                  templateUrl = templateUrlProp.initializer.text
                }
              }

              const standaloneProp = properties.find(
                (prop) =>
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === "standalone",
              ) as ts.PropertyAssignment | undefined

              if (standaloneProp) {
                if (
                  standaloneProp.initializer.kind === ts.SyntaxKind.FalseKeyword
                ) {
                  isStandalone = false
                }
              }
            }
          }
        }

        if (ts.isExportAssignment(node) && !node.isExportEquals) {
          hasDefaultExport = true
        }

        ts.forEachChild(node, visit)
      }

      visit(sourceFile)

      if (!componentClass || !selector) {
        return null
      }

      const demoId = componentClass
      const pageId = extractPageId(filePath, routesDir)
      const importPath = relative(process.cwd(), filePath).replace(/\\/g, "/")
      const fileName = basename(filePath)

      const {strippedCode: codeWithoutImports} = stripImports(code, filePath)

      const highlightedFull = await highlightCode(code, "angular-ts")
      const {highlightedPreview, highlightedWithoutPreview} =
        extractHighlightedVariants(highlightedFull)

      const sourceCode: SourceCodeData[] = [
        {
          fileName,
          filePath,
          highlighted: {
            full: highlightedWithoutPreview,
            preview: highlightedPreview,
          },
          raw: {
            full: sourceWithoutPreviews,
            preview: formattedPreview || "",
            withoutImports: codeWithoutImports,
          },
        },
      ]

      if (templateUrl) {
        const templatePath = resolveTemplateFile(templateUrl, filePath)

        if (existsSync(templatePath)) {
          try {
            const templateCode = await readFile(templatePath, "utf-8")

            const {
              formattedPreview: templatePreview,
              sourceWithoutPreviews: templateWithoutPreviews,
            } = extractAngularPreviewsAndCleanSource(templateCode)

            const highlightedTemplate = await highlightCode(
              templateCode,
              "angular-html",
            )

            const {
              highlightedPreview: highlightedTemplatePreview,
              highlightedWithoutPreview: highlightedTemplateWithoutPreview,
            } = extractHighlightedVariants(highlightedTemplate)

            sourceCode.push({
              fileName: basename(templatePath),
              highlighted: {
                full: highlightedTemplateWithoutPreview,
                preview: highlightedTemplatePreview,
              },
              raw: {
                full: templateWithoutPreviews,
                preview: templatePreview || "",
                withoutImports: templateCode,
              },
            })
          } catch (error) {
            console.log(
              `${chalk.blue.bold(LOG_PREFIX)} ${chalk.redBright("Failed to read template file:")} ${chalk.cyan(templatePath)}`,
              error,
            )
          }
        }
      }

      const relativeImports = await collectAllImports(filePath)

      for (const resolvedPath of relativeImports) {
        try {
          const importedCode = await readFile(resolvedPath, "utf-8")
          const {strippedCode: importedCodeWithoutImports} = stripImports(
            importedCode,
            resolvedPath,
          )

          const {sourceWithoutPreviews: importedSourceWithoutSnippets} =
            extractAngularPreviewsAndCleanSource(importedCode)

          const importedFileName = basename(resolvedPath)
          const highlightedImportedSource = await highlightCode(
            importedSourceWithoutSnippets,
            "angular-ts",
          )

          sourceCode.push({
            fileName: importedFileName,
            filePath: resolvedPath,
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
            `${chalk.blue.bold(LOG_PREFIX)} ${chalk.yellowBright("Failed to process relative import:")} ${chalk.cyan(resolvedPath)}`,
          )
        }
      }

      return {
        componentClass,
        filePath: importPath.startsWith(".") ? importPath : `./${importPath}`,
        hasDefaultExport,
        id: demoId,
        imports,
        initialHtml: initialHtml?.[demoId] || undefined,
        isStandalone,
        lastModified: Date.now(),
        pageId,
        selector,
        sourceCode,
      }
    } catch (error) {
      console.error(
        `${chalk.blue.bold(LOG_PREFIX)} Failed to parse Angular demo ${filePath}:`,
        error,
      )
      return null
    }
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
    let omitNextLine = false

    for (const line of lines) {
      const textContent = line
        .replace(/<[^>]*>/g, "")
        .replace(/&#x3C;/g, "<")
        .replace(/&#x3E;/g, ">")
        .trim()

      if (omitNextLine) {
        omitNextLine = false
        continue
      }

      if (textContent === "// qui-docs::omit-next-line") {
        omitNextLine = true
        continue
      }

      if (
        textContent === "// preview" ||
        textContent === "/* preview */" ||
        textContent === "<!-- preview -->"
      ) {
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

  function generateRegistryModule(): string {
    const demos = Array.from(demoRegistry.values())
    return `// Auto-generated Angular demo registry
export const ANGULAR_DEMOS = {
${demos
  .map(
    (demo) =>
      `  "${demo.id}": ${JSON.stringify(
        {
          componentClass: demo.componentClass,
          dimensions: demoDimensionsCache[demo.id],
          filePath: demo.filePath,
          hasDefaultExport: demo.hasDefaultExport,
          id: demo.id,
          imports: demo.imports,
          initialHtml: demo.initialHtml,
          isStandalone: demo.isStandalone,
          lastModified: demo.lastModified,
          pageId: demo.pageId,
          selector: demo.selector,
          sourceCode: demo.sourceCode,
        },
        null,
        4,
      )}`,
  )
  .join(",\n")}
}

export function isAngularDemo(demoId) {
  return demoId in ANGULAR_DEMOS
}

export function getAngularDemoInfo(demoId) {
  return ANGULAR_DEMOS[demoId] || null
}

export function getAllAngularDemos() {
  return Object.values(ANGULAR_DEMOS)
}

export const availableAngularDemos = Object.keys(ANGULAR_DEMOS)

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('[angular-demo-registry] Registry updated via HMR')
  })
  
  if (typeof window !== 'undefined') {
    import.meta.hot.on('angular-demo-update', (data) => {
      console.log('[angular-demo-registry] Demo updated:', data.demoId)
    })
  }
}`
  }

  function generatePageRegistryModule(pageId: string): string {
    const pageDemos = Array.from(demoRegistry.values()).filter(
      (demo) => demo.pageId === pageId,
    )

    if (pageDemos.length === 0) {
      return `export function getAngularDemoInfo() { return null }
export const ANGULAR_DEMOS = {}`
    }

    return `// Auto-generated Angular demo registry for ${pageId}
export const ANGULAR_DEMOS = {
${pageDemos
  .map(
    (demo) =>
      `  "${demo.id}": ${JSON.stringify(
        {
          componentClass: demo.componentClass,
          dimensions: demoDimensionsCache[demo.id],
          filePath: demo.filePath,
          hasDefaultExport: demo.hasDefaultExport,
          id: demo.id,
          imports: demo.imports,
          initialHtml: demo.initialHtml,
          isStandalone: demo.isStandalone,
          lastModified: demo.lastModified,
          pageId: demo.pageId,
          selector: demo.selector,
          sourceCode: demo.sourceCode,
        },
        null,
        4,
      )}`,
  )
  .join(",\n")}
}

export function getAngularDemoInfo(demoId) {
  return ANGULAR_DEMOS[demoId] || null
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('[angular-demo-registry/${pageId}] Registry updated')
  })
}`
  }

  function extractPageId(filePath: string, routesDir: string): string {
    const relativePath = relative(routesDir, filePath)
    const pathParts = relativePath.split("/")
    const demoIndex = pathParts.findIndex((part) => part.includes("demos"))

    if (demoIndex === -1) {
      return pathParts.at(-2) || pathParts.join("/")
    }

    return pathParts.slice(0, demoIndex).join("/")
  }

  function isAngularDemoFile(filePath: string): boolean {
    return (
      filePath.includes("/demos/") &&
      (filePath.endsWith(".ts") || filePath.endsWith("html"))
    )
  }

  function isCssAsset(filePath: string) {
    return filePath.endsWith(".css")
  }

  function isRelativeImport(source: string): boolean {
    return source.startsWith("./") || source.startsWith("../")
  }

  function isNodeBuiltin(source: string): boolean {
    const NODE_BUILTINS = [
      "assert",
      "buffer",
      "child_process",
      "cluster",
      "crypto",
      "dgram",
      "dns",
      "domain",
      "events",
      "fs",
      "http",
      "https",
      "net",
      "os",
      "path",
      "punycode",
      "querystring",
      "readline",
      "stream",
      "string_decoder",
      "timers",
      "tls",
      "tty",
      "url",
      "util",
      "v8",
      "vm",
      "zlib",
    ]
    return source.startsWith("node:") || NODE_BUILTINS.includes(source)
  }

  function resolveRelativeImport(source: string, fromFile: string): string {
    const fromDir = dirname(fromFile)
    const resolved = resolve(fromDir, source)
    const extensions = [".ts", ".tsx", ".js", ".jsx"]

    for (const ext of extensions) {
      const withExt = resolved + ext
      if (existsSync(withExt)) {
        return withExt
      }
    }

    for (const ext of extensions) {
      const indexFile = join(resolved, `index${ext}`)
      if (existsSync(indexFile)) {
        return indexFile
      }
    }

    return resolved
  }

  function loadTsConfigPaths(fromFile: string): PathAlias[] {
    let currentDir = dirname(fromFile)
    const pathAliases: PathAlias[] = []

    while (currentDir !== dirname(currentDir)) {
      const tsconfigPath = join(currentDir, "tsconfig.json")

      if (existsSync(tsconfigPath)) {
        try {
          const configContent = ts.sys.readFile(tsconfigPath)
          if (!configContent) {
            currentDir = dirname(currentDir)
            continue
          }

          const parseResult = ts.parseConfigFileTextToJson(
            tsconfigPath,
            configContent,
          )

          if (parseResult.error) {
            currentDir = dirname(currentDir)
            continue
          }

          const paths = parseResult.config?.compilerOptions?.paths
          const baseUrl = parseResult.config?.compilerOptions?.baseUrl || "./"
          const resolvedBaseUrl = resolve(currentDir, baseUrl)

          if (paths) {
            for (const [alias, targets] of Object.entries(paths)) {
              if (Array.isArray(targets) && targets.length > 0) {
                const target = targets[0]
                const pattern = new RegExp(
                  `^${alias
                    .replace("*", "(.*)")
                    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                    .replace("\\(\\*\\)", "(.*)")}$`,
                )
                const replacement = resolve(
                  resolvedBaseUrl,
                  target.replace("*", "$1"),
                )
                pathAliases.push({pattern, replacement})
              }
            }
          }

          const extendsPath = parseResult.config?.extends
          if (extendsPath) {
            const resolvedExtends = resolve(currentDir, extendsPath)
            const extendedAliases = loadTsConfigPathsFromFile(resolvedExtends)
            pathAliases.push(...extendedAliases)
          }

          return pathAliases
        } catch (error) {
          currentDir = dirname(currentDir)
          continue
        }
      }

      currentDir = dirname(currentDir)
    }

    return pathAliases
  }

  async function setupAngularWatcher() {
    watcher = watch(routesDir, {
      ignoreInitial: true,
      persistent: true,
    })

    watcher.on("ready", () => {
      logDev(
        `${chalk.blue.bold(LOG_PREFIX)} Registered ${chalk.green(demoRegistry.size)} demo files. Watching for file changes...`,
      )
    })

    watcher.on("add", async (filePath: string) => {
      const fileStats = await stat(filePath)
      if (fileStats.size === 0) {
        return
      }

      if (isAngularDemoFile(filePath)) {
        logDev(
          `${chalk.blue.bold(LOG_PREFIX)} New Angular demo: ${chalk.green(filePath)}`,
        )
        await handleAngularDemoUpdate(filePath)
        triggerRegistryUpdate()
      }
    })

    watcher.on("unlink", (filePath: string) => {
      if (isAngularDemoFile(filePath)) {
        const demoEntry = Array.from(demoRegistry.entries()).find(
          ([, info]) => info.filePath === filePath,
        )

        if (demoEntry) {
          const [demoId] = demoEntry
          demoRegistry.delete(demoId)
          logDev(
            `${chalk.blue.bold(LOG_PREFIX)} Removed demo: ${chalk.red(demoId)}`,
          )
          triggerRegistryUpdate()
        }
      }
    })
  }

  async function handleAngularDemoUpdate(filePath: string) {
    const code = await readFile(filePath, "utf-8")
    const demoInfo = await parseAngularDemo(filePath, code)
    if (demoInfo) {
      demoRegistry.set(demoInfo.id, demoInfo)
    }
  }

  function triggerRegistryUpdate() {
    if (devServer) {
      const mainModule = devServer.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
      if (mainModule) {
        devServer.moduleGraph.invalidateModule(mainModule)
        mainModule.lastHMRTimestamp = Date.now()
        devServer.reloadModule(mainModule)
      }

      const pageIds = new Set(
        Array.from(demoRegistry.values()).map((demo) => demo.pageId),
      )
      for (const pageId of pageIds) {
        const pageModuleId = `\0${VIRTUAL_MODULE_PREFIX}${pageId}`
        const pageModule = devServer.moduleGraph.getModuleById(pageModuleId)
        if (pageModule) {
          devServer.moduleGraph.invalidateModule(pageModule)
          pageModule.lastHMRTimestamp = Date.now()
          devServer.reloadModule(pageModule)
        }
      }
    }
  }
}

function loadTsConfigPathsFromFile(tsconfigPath: string): PathAlias[] {
  const pathAliases: PathAlias[] = []
  const configDir = dirname(tsconfigPath)

  try {
    const configContent = ts.sys.readFile(tsconfigPath)
    if (!configContent) {
      return pathAliases
    }

    const parseResult = ts.parseConfigFileTextToJson(
      tsconfigPath,
      configContent,
    )

    if (parseResult.error) {
      return pathAliases
    }

    const paths = parseResult.config?.compilerOptions?.paths
    const baseUrl = parseResult.config?.compilerOptions?.baseUrl || "./"
    const resolvedBaseUrl = resolve(configDir, baseUrl)

    if (paths) {
      for (const [alias, targets] of Object.entries(paths)) {
        if (Array.isArray(targets) && targets.length > 0) {
          const target = targets[0]
          const pattern = new RegExp(
            `^${alias
              .replace("*", "(.*)")
              .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              .replace("\\(\\*\\)", "(.*)")}$`,
          )
          const replacement = resolve(
            resolvedBaseUrl,
            target.replace("*", "$1"),
          )
          pathAliases.push({pattern, replacement})
        }
      }
    }

    const extendsPath = parseResult.config?.extends
    if (extendsPath) {
      let resolvedExtends = resolve(configDir, extendsPath)
      if (!resolvedExtends.endsWith(".json")) {
        resolvedExtends += ".json"
      }
      if (existsSync(resolvedExtends)) {
        const extendedAliases = loadTsConfigPathsFromFile(resolvedExtends)
        pathAliases.push(...extendedAliases)
      }
    }
  } catch (error) {
    return pathAliases
  }

  return pathAliases
}

function isPathAliasImport(source: string, pathAliases: PathAlias[]): boolean {
  return pathAliases.some((alias) => alias.pattern.test(source))
}

function resolvePathAlias(
  source: string,
  pathAliases: PathAlias[],
): string | null {
  for (const alias of pathAliases) {
    if (alias.pattern.test(source)) {
      const resolvedPath = source.replace(alias.pattern, alias.replacement)
      const extensions = [".ts", ".tsx", ".js", ".jsx"]

      for (const ext of extensions) {
        const withExt = resolvedPath + ext
        if (existsSync(withExt)) {
          return withExt
        }
      }

      for (const ext of extensions) {
        const indexFile = join(resolvedPath, `index${ext}`)
        if (existsSync(indexFile)) {
          return indexFile
        }
      }

      return resolvedPath
    }
  }

  return null
}

function resolveTemplateFile(templateUrl: string, fromFile: string): string {
  const fromDir = dirname(fromFile)
  const resolved = resolve(fromDir, templateUrl)

  if (existsSync(resolved)) {
    return resolved
  }

  if (!resolved.endsWith(".html")) {
    const withHtml = `${resolved}.html`
    if (existsSync(withHtml)) {
      return withHtml
    }
  }

  return resolved
}

function isOmitNextLine(trimmedLine: string): boolean {
  return trimmedLine === "// qui-docs::omit-next-line"
}
