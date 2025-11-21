// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {glob} from "glob"
import {readFile} from "node:fs/promises"
import {basename, resolve} from "node:path"
import {createHighlighter, type Highlighter} from "shiki"
import * as ts from "typescript"
import type {Plugin} from "vite"

import {quiCustomDarkTheme, type ReactDemoData} from "@qualcomm-ui/mdx-common"
import {dedent} from "@qualcomm-ui/utils/dedent"

import {getShikiTransformers} from "../docs-plugin"

import {LOG_PREFIX, VIRTUAL_MODULE_IDS} from "./demo-plugin-constants"
import type {QuiDemoPluginOptions} from "./demo-plugin-types"
import {
  createDemoName,
  extractFileImports,
  extractPageId,
  getScriptKind,
  isCssAsset,
  isDemoFile,
} from "./demo-plugin-utils"

interface HandleUpdateOptions {
  demoName?: string
  filePath: string
}

let highlighter: Highlighter | null = null
let initializingHighlighter = false

const demoRegistry = new Map<string, ReactDemoData>()
const pageFiles = new Map<string, string[]>()
const relativeImportDependents = new Map<string, Set<string>>()

/**
 * Generates virtual modules for React demo components. Virtual modules contain
 * highlighted source code and metadata about each demo.
 */
export function reactDemoPlugin({
  demoPattern = "src/routes/**/demos/*.tsx",
  routesDir = "src/routes",
  theme = {
    dark: quiCustomDarkTheme,
    light: "github-light-high-contrast",
  },
  transformers = [],
  transformLine,
}: QuiDemoPluginOptions = {}): Plugin {
  return {
    apply(config, env) {
      return (
        (env.mode === "development" && env.command === "serve") ||
        (env.mode === "production" && env.command === "build")
      )
    },
    async buildStart() {
      if (!highlighter && !initializingHighlighter) {
        initializingHighlighter = true
        try {
          highlighter = await createHighlighter({
            langs: ["tsx", "typescript"],
            themes: [theme.dark, theme.light],
          }).finally(() => {
            initializingHighlighter = false
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

      await collectReactDemos()
    },

    async handleHotUpdate({file, modules, server}) {
      if (isCssAsset(file)) {
        return modules
      }

      if (isDemoFile(file)) {
        await handleDemoAdditionOrUpdate({filePath: file})
      } else {
        const normalizedFile = resolve(file)
        const dependentDemos = relativeImportDependents.get(normalizedFile)
        if (!dependentDemos?.size) {
          return modules
        }
        for (const demoName of Array.from(dependentDemos)) {
          const demo = demoRegistry.get(demoName)
          if (demo) {
            await handleDemoAdditionOrUpdate({
              filePath: demo.filePath,
            })
          }
        }
      }

      const autoModule = server.moduleGraph.getModuleById(
        VIRTUAL_MODULE_IDS.AUTO,
      )
      if (autoModule) {
        server.moduleGraph.invalidateModule(autoModule)
        await server.reloadModule(autoModule)
      }
      return modules
    },

    async load(id) {
      if (id === VIRTUAL_MODULE_IDS.AUTO) {
        return generateAutoScopeModule()
      }
    },

    name: "auto-demo-scope",

    resolveId(id) {
      if (id === "virtual:qui-demo-scope/auto") {
        return VIRTUAL_MODULE_IDS.AUTO
      }
    },

    writeBundle() {
      console.log(
        `${chalk.blue.bold(LOG_PREFIX)} Successfully integrated ${chalk.green(demoRegistry.size)} component demos`,
      )
    },
  }

  async function handleDemoAdditionOrUpdate({
    filePath,
  }: HandleUpdateOptions): Promise<void> {
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
        transformers: [
          ...getShikiTransformers(),
          {
            enforce: "post",
            name: "shiki-transformer-trim",
            preprocess(code) {
              return code.trim()
            },
          },
          ...transformers,
        ],
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
    if (demoRegistry.size) {
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
  }

  function generateAutoScopeModule(): string {
    const registryCode = generateDemoRegistry(demoRegistry)
    return [
      "// Auto-generated demo scope resolver (PROD MODE)",
      registryCode,
      generateExportedFunctions(),
    ].join("\n\n")
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
          } catch {}
        }
      }

      return {
        demoName: createDemoName(filePath),
        fileName,
        filePath,
        imports,
        sourceCode,
      }
    } catch {
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
      return {
        imports: [],
        strippedCode: code,
      }
    }
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
          pageId: "",
          sourceCode: [],
        }
      }
      return demo
    }
  `
  }
}
