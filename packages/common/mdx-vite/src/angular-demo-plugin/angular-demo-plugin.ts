// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear
import chalk from "chalk"
import {type FSWatcher, watch} from "chokidar"
import {glob} from "glob"
import {existsSync, statSync} from "node:fs"
import {readFile} from "node:fs/promises"
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
  quiCustomDarkTheme,
  type SourceCodeData,
} from "@qualcomm-ui/mdx-common"
import {dedent} from "@qualcomm-ui/utils/dedent"

import {getShikiTransformers} from "../docs-plugin/index.js"
import {
  extractPreviewFromHighlightedHtml,
  transformerCodeAttribute,
  transformerPreviewBlock,
} from "../docs-plugin/shiki/index.js"
import {createShikiTailwindTransformer} from "../docs-plugin/shiki/internal/index.js"

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
  /**
   * When enabled, transforms Tailwind class names to inline styles in the
   * highlighted code. Non-inlineable classes (hover:, sm:, etc.) are kept as
   * className and their CSS rules are aggregated into a residual-css entry.
   */
  transformTailwindStyles?: boolean
}

interface RelativeImport {
  resolvedPath: string
  source: string
}

interface PathAlias {
  pattern: RegExp
  replacement: string
}

interface HighlightCodeResult {
  full: string
  preview?: string | null
}

const VIRTUAL_MODULE_ID = "\0virtual:angular-demo-registry"
const LOG_PREFIX = "[angular-demo]"

let hasWatcherInitialized = false

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
  transformTailwindStyles,
}: AngularDemoPluginOptions = {}): Plugin {
  let watcher: FSWatcher | null = null
  let devServer: ViteDevServer | null = null

  const defaultShikiOptions = {
    defaultColor: "light-dark()",
    themes: {
      dark: theme.dark,
      light: theme.light,
    },
  }

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
            langs: ["angular-ts", "angular-html", "css"],
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
          setupAngularWatcher()
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
          void server.reloadModule(module)
        }
      })
    },
    async handleHotUpdate({file, modules, server}) {
      if (!isAngularDemoFile(file)) {
        if (isCssAsset(file)) {
          return modules
        }

        if (file.endsWith("main.js")) {
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

      if (!demoInfo || !isAngularDemoEntrypoint(file)) {
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
      }

      const demoModule = server.moduleGraph.getModuleById(file)
      if (demoModule) {
        server.moduleGraph.invalidateModule(demoModule)
      }

      return []
    },
    load(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return generateRegistryModule()
      }
    },
    name: "angular-demo-plugin",
    resolveId(id) {
      if (id === "virtual:angular-demo-registry") {
        return VIRTUAL_MODULE_ID
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
          `${chalk.blue.bold(LOG_PREFIX)} Reloading demo ${chalk.cyan(demoId)} due to imported file change: ${chalk.yellow(file)}`,
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
    language: "angular-ts" | "angular-html" | "css" = "angular-ts",
    options: {
      onClassesDetected?: (detected: boolean) => void
      onResidualCss?: (rules: Map<string, string>) => void
    } = {},
  ): Promise<HighlightCodeResult> {
    const {onClassesDetected, onResidualCss} = options

    if (!highlighter) {
      return {full: code}
    }

    let previewCode: string | null = null

    const tailwindTransformers = []
    if (transformTailwindStyles && onResidualCss) {
      const transformer = await createShikiTailwindTransformer({
        onClassesDetected: (detected) => {
          onClassesDetected?.(detected)
        },
        onResidualCss,
        styleFormat: "html",
        styles: dedent`
          @layer theme, base, components, utilities;
          @import "tailwindcss/theme.css" layer(theme);
          @import "tailwindcss/utilities.css" layer(utilities);
          @import "@qualcomm-ui/tailwind-plugin/qui-strict.css";
        `,
      })
      tailwindTransformers.push(transformer)
    }

    try {
      const highlightedCode = highlighter.codeToHtml(code, {
        ...defaultShikiOptions,
        lang: language,
        transformers: [
          ...getShikiTransformers(),
          ...tailwindTransformers,
          transformerPreviewBlock({
            attributeName: "data-preview",
            onComplete: (extractedPreview) => {
              previewCode = extractedPreview
            },
          }),
          transformerCodeAttribute({
            attributeName: "data-code",
          }),
          {
            enforce: "post",
            name: "shiki-transformer-trim",
            preprocess(inner) {
              return inner.trim()
            },
          },
        ],
      })

      return {
        full: highlightedCode,
        preview: previewCode
          ? extractPreviewFromHighlightedHtml(highlightedCode)
          : null,
      }
    } catch (error) {
      console.warn(
        `${chalk.blue.bold(LOG_PREFIX)} Failed to highlight code with ${language} language:`,
        error,
      )
      return {full: code}
    }
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

  function stripImports(code: string, fileName: string): string[] {
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

      return importRanges.map((range) => {
        let endPos = range.end
        if (code[endPos] === "\n") {
          endPos++
        }
        return code.slice(range.start, endPos).trim()
      })
    } catch (error) {
      logDev(
        `${chalk.blue.bold(LOG_PREFIX)} ${chalk.redBright("Failed to strip imports from")} ${chalk.cyan(fileName)}:`,
        error,
      )
      return []
    }
  }

  async function parseAngularDemo(
    filePath: string,
    code: string,
  ): Promise<AngularDemoInfo | null> {
    try {
      const {
        componentClass,
        hasDefaultExport,
        isStandalone,
        selector,
        templateUrl,
      } = parseAngularComponentMeta(filePath, code)

      if (!componentClass || !selector) {
        return null
      }

      const demoId = componentClass
      const importPath = relative(process.cwd(), filePath).replace(/\\/g, "/")
      const fileName = basename(filePath)
      const importsWithoutStrip = stripImports(code, filePath)

      const sourceCode: SourceCodeData[] = []
      // Use Map for deduplication across all files in this demo
      const aggregatedRules = new Map<string, string>()

      const mainSourceEntry = await buildAngularSourceEntry({
        code,
        fileName,
        filePath,
        language: "angular-ts",
      })
      sourceCode.push(mainSourceEntry.sourceCodeData)
      if (mainSourceEntry.residualRules) {
        for (const [className, rule] of mainSourceEntry.residualRules) {
          aggregatedRules.set(className, rule)
        }
      }

      if (templateUrl) {
        const templateEntry = await maybeBuildTemplateSourceEntry(
          templateUrl,
          filePath,
        )
        if (templateEntry) {
          sourceCode.push(templateEntry.sourceCodeData)
          if (templateEntry.residualRules) {
            for (const [className, rule] of templateEntry.residualRules) {
              aggregatedRules.set(className, rule)
            }
          }
        }
      }

      const importedEntries = await buildImportedSourceEntries(filePath)
      for (const entry of importedEntries) {
        sourceCode.push(entry.sourceCodeData)
        if (entry.residualRules) {
          for (const [className, rule] of entry.residualRules) {
            aggregatedRules.set(className, rule)
          }
        }
      }

      // Convert aggregated rules to CSS string
      const aggregatedResidualCss =
        aggregatedRules.size > 0
          ? [...aggregatedRules.values()].join("\n\n")
          : undefined

      if (aggregatedResidualCss) {
        const cssHighlighted = await highlightCode(aggregatedResidualCss, "css")
        sourceCode.push({
          fileName: "styles.css",
          highlighted: cssHighlighted,
          type: "residual-css",
        })
      }

      return {
        componentClass,
        filePath: importPath.startsWith(".") ? importPath : `./${importPath}`,
        hasDefaultExport,
        id: demoId,
        imports: importsWithoutStrip,
        initialHtml: initialHtml?.[demoId] || undefined,
        isStandalone,
        lastModified: Date.now(),
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

  function parseAngularComponentMeta(
    filePath: string,
    source: string,
  ): {
    componentClass: string
    hasDefaultExport: boolean
    importsFromAst: string[]
    isStandalone: boolean
    selector: string
    templateUrl: string | null
  } {
    const sourceFile = ts.createSourceFile(
      filePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    )

    let componentClass = ""
    let selector = ""
    let isStandalone = true
    let templateUrl: string | null = null
    let hasDefaultExport = false
    const importsFromAst: string[] = []

    function visit(node: ts.Node) {
      if (ts.isImportDeclaration(node)) {
        importsFromAst.push(node.getFullText(sourceFile).trim())
      }

      if (ts.isClassDeclaration(node)) {
        const decorators = node.modifiers?.filter(ts.isDecorator)
        const componentDecorator = decorators?.find((decorator) => {
          if (!ts.isCallExpression(decorator.expression)) {
            return false
          }
          const expression = decorator.expression.expression
          return ts.isIdentifier(expression) && expression.text === "Component"
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

            if (selectorProp && ts.isStringLiteral(selectorProp.initializer)) {
              selector = selectorProp.initializer.text
            }

            const templateUrlProp = properties.find(
              (prop) =>
                ts.isPropertyAssignment(prop) &&
                ts.isIdentifier(prop.name) &&
                prop.name.text === "templateUrl",
            ) as ts.PropertyAssignment | undefined

            if (templateUrlProp) {
              const init = templateUrlProp.initializer
              if (ts.isStringLiteral(init)) {
                templateUrl = init.text
              } else if (ts.isNoSubstitutionTemplateLiteral(init)) {
                templateUrl = init.text
              }
            }

            const standaloneProp = properties.find(
              (prop) =>
                ts.isPropertyAssignment(prop) &&
                ts.isIdentifier(prop.name) &&
                prop.name.text === "standalone",
            ) as ts.PropertyAssignment | undefined

            if (
              standaloneProp &&
              standaloneProp.initializer.kind === ts.SyntaxKind.FalseKeyword
            ) {
              isStandalone = false
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

    return {
      componentClass,
      hasDefaultExport,
      importsFromAst,
      isStandalone,
      selector,
      templateUrl,
    }
  }

  interface BuildAngularSourceEntryParams {
    code: string
    fileName: string
    filePath: string
    language: "angular-ts" | "angular-html"
  }

  interface ExtractedSourceCode {
    residualRules?: Map<string, string>
    sourceCodeData: SourceCodeData
  }

  async function buildAngularSourceEntry(
    params: BuildAngularSourceEntryParams,
  ): Promise<ExtractedSourceCode> {
    const {code, fileName, filePath, language} = params

    const baseResult = await highlightCode(code, language)

    let inlineResult: HighlightCodeResult | undefined
    let classesDetected = false
    let residualRules: Map<string, string> | undefined

    if (transformTailwindStyles) {
      inlineResult = await highlightCode(code, language, {
        onClassesDetected: (detected) => {
          classesDetected = detected
        },
        onResidualCss: (rules) => {
          residualRules = rules
        },
      })
    }

    return {
      residualRules,
      sourceCodeData: {
        fileName,
        filePath,
        highlighted: {
          full: baseResult.full,
          preview: baseResult.preview,
        },
        highlightedInline:
          classesDetected && inlineResult
            ? {
                full: inlineResult.full,
                preview: inlineResult.preview,
              }
            : undefined,
        type: "file",
      },
    }
  }

  async function maybeBuildTemplateSourceEntry(
    templateUrl: string,
    fromFilePath: string,
  ): Promise<ExtractedSourceCode | null> {
    const templatePath = resolveTemplateFile(templateUrl, fromFilePath)
    if (!existsSync(templatePath)) {
      return null
    }

    try {
      const templateCode = await readFile(templatePath, "utf-8")

      return buildAngularSourceEntry({
        code: templateCode,
        fileName: basename(templatePath),
        filePath: templatePath,
        language: "angular-html",
      })
    } catch (error) {
      console.log(
        `${chalk.blue.bold(LOG_PREFIX)} ${chalk.redBright("Failed to read template file:")} ${chalk.cyan(templatePath)}`,
        error,
      )
      return null
    }
  }

  async function buildImportedSourceEntries(
    fromFilePath: string,
  ): Promise<ExtractedSourceCode[]> {
    const entries: ExtractedSourceCode[] = []
    const relativeImports = await collectAllImports(fromFilePath)

    for (const resolvedPath of relativeImports) {
      try {
        const importedCode = await readFile(resolvedPath, "utf-8")

        const entry = await buildAngularSourceEntry({
          code: importedCode,
          fileName: basename(resolvedPath),
          filePath: resolvedPath,
          language: "angular-ts",
        })

        entries.push(entry)
      } catch {
        logDev(
          `${chalk.blue.bold(LOG_PREFIX)} ${chalk.yellowBright("Failed to process relative import:")} ${chalk.cyan(resolvedPath)}`,
        )
      }
    }

    return entries
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
}`
  }

  function isAngularDemoFile(filePath: string): boolean {
    return (
      filePath.includes("/demos/") &&
      (filePath.endsWith(".ts") || filePath.endsWith("html"))
    )
  }

  function isAngularDemoEntrypoint(filePath: string): boolean {
    return filePath.endsWith("-demo.ts") || filePath.endsWith("-demo.html")
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
    const extensions = [".ts", ".js"]

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
        } catch {
          currentDir = dirname(currentDir)
          continue
        }
      }

      currentDir = dirname(currentDir)
    }

    return pathAliases
  }

  function setupAngularWatcher() {
    watcher = watch(routesDir, {
      ignoreInitial: true,
      persistent: true,
    })

    watcher.on("ready", () => {
      logDev(
        `${chalk.blue.bold(LOG_PREFIX)} Registered ${chalk.green(demoRegistry.size)} demo files. Watching for file changes...`,
      )
    })

    watcher.on("add", (filePath: string) => {
      try {
        const fileStats = statSync(filePath)
        if (!fileStats || fileStats.size === 0) {
          console.debug("Failed to read file stats", filePath)
          return
        }

        if (isAngularDemoFile(filePath)) {
          logDev(
            `${chalk.blue.bold(LOG_PREFIX)} New Angular demo: ${chalk.green(filePath)}`,
          )
          void handleAngularDemoUpdate(filePath).then(() => {
            triggerRegistryUpdate()
          })
        }
      } catch {
        console.debug("Failed to update registry file stats")
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
    if (!devServer) {
      return
    }

    const mainModule = devServer.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
    if (mainModule) {
      devServer.moduleGraph.invalidateModule(mainModule)
      mainModule.lastHMRTimestamp = Date.now()
      void devServer.reloadModule(mainModule)
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
  } catch {
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
      const extensions = [".ts", ".js"]

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
