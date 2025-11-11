// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {kebabCase} from "change-case"
import {
  access,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import {basename, dirname, extname, join, resolve} from "node:path"
import remarkFrontmatter from "remark-frontmatter"
import remarkParse from "remark-parse"
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkStringify from "remark-stringify"
import {unified} from "unified"

import type {
  QuiComment,
  QuiCommentDisplayPart,
} from "@qualcomm-ui/mdx-docs-common"

import {remarkSelfLinkHeadings} from "../docs-plugin"
import {
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
} from "../docs-plugin/internal"

import {loadEnv} from "./common"
import {loadKnowledgeConfigFromEnv} from "./load-config-from-env"
import type {WebUiKnowledgeConfig} from "./types"

interface PageInfo {
  demosFolder?: string
  mdxFile: string
  name: string
  path: string
  url: string | undefined
}

interface ProcessedPage {
  content: string
  demoFiles: string[]
  frontmatter: Record<string, string>
  title: string
}

interface ImportedModule {
  content: string
  path: string
}

interface ComponentProps {
  input?: PropInfo[]
  name: string
  output?: PropInfo[]
  props?: PropInfo[]
}

interface DocProps {
  props: Record<string, ComponentProps>
}

interface PropInfo {
  comment?: QuiComment
  defaultValue?: string
  name: string
  resolvedType?: {
    baseType?: string
    name?: string
    prettyType?: string
    required?: boolean
    type?: string
  }
  type: string
}

interface SimplifiedProp {
  defaultValue?: string
  description: string
  name: string
  propType?: "input" | "output" | undefined
  required: boolean | undefined
  type: string
}

async function exists(dirPath: string): Promise<boolean> {
  return access(dirPath)
    .then(() => true)
    .catch(() => false)
}

async function loadDocProps(
  routesFolder: string,
  docPropsPath: string | undefined,
  verbose: boolean | undefined,
): Promise<DocProps | null> {
  const resolvedDocPropsPath = docPropsPath
    ? (await exists(docPropsPath))
      ? docPropsPath
      : resolve(process.cwd(), docPropsPath)
    : join(dirname(routesFolder), "doc-props.json")

  if (!(await exists(resolvedDocPropsPath))) {
    if (verbose) {
      console.log(`Doc props file not found at: ${resolvedDocPropsPath}`)
    }
    return null
  }

  try {
    const content = await readFile(resolvedDocPropsPath, "utf-8")
    const docProps = JSON.parse(content) as DocProps
    if (verbose) {
      console.log(`Loaded doc props from: ${resolvedDocPropsPath}`)
      console.log(`Found ${Object.keys(docProps.props).length} component types`)
    }
    return docProps
  } catch (error) {
    if (verbose) {
      console.log(`Error loading doc props: ${error}`)
    }
    return null
  }
}

function formatComment(comment: QuiComment | null): string {
  if (!comment) {
    return ""
  }

  const parts: string[] = []

  // Format summary
  if (comment.summary && comment.summary.length > 0) {
    const summaryText = formatCommentParts(comment.summary)
    if (summaryText.trim()) {
      parts.push(summaryText.trim())
    }
  }

  // Format block tags
  if (comment.blockTags && comment.blockTags.length > 0) {
    for (const blockTag of comment.blockTags) {
      const tagContent = formatCommentParts(blockTag.content)
      if (tagContent.trim()) {
        const tagName = blockTag.tag.replace("@", "")

        // Skip default tags since they're handled separately
        if (tagName === "default" || tagName === "defaultValue") {
          continue
        }

        // Special handling for other tags
        if (tagName === "example") {
          parts.push(`**Example:**\n\`\`\`\n${tagContent.trim()}\n\`\`\``)
        } else {
          parts.push(`**${tagName}:** ${tagContent.trim()}`)
        }
      }
    }
  }

  return parts.join("\n\n")
}

function formatCommentParts(parts: QuiCommentDisplayPart[]): string {
  return parts
    .map((part) => {
      switch (part.kind) {
        case "text":
          return part.text
        case "code":
          // Clean up malformed code blocks like "```ts\ntrue\n```"
          const codeText = part.text
            .replace(/```\w*\n?/g, "") // Remove opening code blocks with optional language
            .replace(/\n?```/g, "") // Remove closing code blocks
            .trim()

          // If it's still multi-line after cleanup, use code block
          if (codeText.includes("\n")) {
            return `\`\`\`\n${codeText}\n\`\`\``
          } else {
            return codeText
          }
        default:
          if (
            "tag" in part &&
            part.tag === "@link" &&
            typeof part.target === "string"
          ) {
            return `[${part.text}](${part.target})`
          }
          return part.text
      }
    })
    .join("")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function convertPropInfo(
  propInfo: PropInfo,
  isPartial: boolean,
  propType: "input" | "output" | undefined = undefined,
): SimplifiedProp {
  return {
    name: propInfo.name,
    type: extractBestType(propInfo),
    ...(propInfo.defaultValue && {
      defaultValue: cleanDefaultValue(propInfo.defaultValue),
    }),
    description: formatComment(propInfo.comment || null),
    propType,
    required: extractRequired(propInfo, isPartial) || undefined,
  }
}

function extractBestType(propInfo: PropInfo): string {
  const type = propInfo.resolvedType?.prettyType || propInfo.type

  return cleanType(type.startsWith("| ") ? type.substring(2) : type)
}

function extractRequired(propInfo: PropInfo, isPartial: boolean): boolean {
  return Boolean(propInfo.resolvedType?.required && !isPartial)
}

function cleanType(type: string): string {
  return type.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
}

function cleanDefaultValue(defaultValue: string): string {
  return defaultValue.replace(/^\n+/, "").replace(/\n+$/, "").trim()
}

async function scanPages(
  routesFolder: string,
  verbose: boolean | undefined,
  excludePatterns: string[] = [],
  baseUrl: string | undefined,
): Promise<PageInfo[]> {
  const components: PageInfo[] = []

  function shouldExclude(dirPath: string): boolean {
    const dirName = basename(dirPath)
    return excludePatterns.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
        return regex.test(dirName)
      }
      return dirName === pattern
    })
  }

  async function scanDirectory(dirPath: string): Promise<void> {
    if (shouldExclude(dirPath)) {
      if (verbose) {
        console.log(`Excluding directory: ${basename(dirPath)}`)
      }
      return
    }

    const entries = await readdir(dirPath, {withFileTypes: true})
    const mdxFiles = entries.filter((f) => f.name.endsWith(".mdx"))

    if (mdxFiles.length > 0) {
      const mdxFile = mdxFiles[0]
      const demosFolder = entries.find((f) => f.name === "demos")
      const demosFolderPath = demosFolder
        ? join(dirPath, demosFolder.name)
        : undefined

      // TODO: load routing strategy from qui-docs config.
      const segments = getPathSegmentsFromFileName(
        join(dirPath, mdxFile.name),
        routesFolder,
      )
      const url = getPathnameFromPathSegments(segments)

      components.push({
        demosFolder: demosFolderPath,
        mdxFile: join(dirPath, mdxFile.name),
        name: segments.at(-1)!,
        path: dirPath,
        url: baseUrl ? new URL(url, baseUrl).toString() : undefined,
      })

      if (verbose) {
        console.log(`Found component: ${basename(dirPath)}`)
        console.log(`  Demos folder: ${demosFolderPath || "NOT FOUND"}`)
      }
    }

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      const stats = await stat(fullPath)
      if (stats.isDirectory()) {
        await scanDirectory(fullPath)
      }
    }
  }

  await scanDirectory(routesFolder)
  return components
}

function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine) ||
    /^<!--\s*preview\s*-->$/.test(trimmedLine)
  )
}

function extractProps(
  props: ComponentProps,
  isPartial: boolean,
): SimplifiedProp[] {
  const propsInfo: SimplifiedProp[] = []

  if (props.props?.length) {
    propsInfo.push(
      ...props.props.map((prop) => convertPropInfo(prop, isPartial)),
    )
  }
  if (props.input?.length) {
    propsInfo.push(
      ...props.input.map((prop) => convertPropInfo(prop, isPartial, "input")),
    )
  }
  if (props.output?.length) {
    propsInfo.push(
      ...props.output.map((prop) => convertPropInfo(prop, isPartial, "output")),
    )
  }

  return propsInfo
}

function removePreviewLines(code: string): string {
  return code
    .split("\n")
    .filter((line) => !isPreviewLine(line.trim()))
    .join("\n")
}

function getIntroLines(
  pages: Array<ProcessedPage>,
  projectName?: string,
  description?: string,
  baseUrl?: string,
) {
  const lines: string[] = []

  if (projectName) {
    lines.push(`# ${projectName}`)
    lines.push("")
  }

  if (description) {
    lines.push(`> ${description}`)
    lines.push("")
  }

  lines.push("## Components and Integrations")
  lines.push("")

  for (const page of pages) {
    const url = baseUrl
      ? `${baseUrl}/${kebabCase(page.title)}`
      : `#${kebabCase(page.title)}`
    if (page.title.includes("Introduction")) {
      lines.push(`- [${page.title}](${url}): introduction and getting started`)
    } else if (page.title.includes("Tailwind")) {
      lines.push(
        `- [${page.title}](${url}): integration documentation and examples`,
      )
    } else {
      lines.push(
        `- [${page.title}](${url}): component documentation and examples`,
      )
    }
  }

  return lines.join("\n")
}

async function generateLlmsTxt(
  pages: Array<ProcessedPage>,
  projectName?: string,
  description?: string,
  baseUrl?: string,
): Promise<string> {
  const lines: string[] = [
    getIntroLines(pages, projectName, description, baseUrl),
  ]

  lines.push("## Documentation Content")
  lines.push("")

  for (const page of pages) {
    lines.push(`# ${page.title}`)
    lines.push("")
    lines.push(page.content)
    lines.push("")
  }

  return lines.join("\n")
}

interface ProcessedPage {
  content: string
  demoFiles: string[]
  frontmatter: Record<string, string>
  title: string
}

interface ImportedModule {
  content: string
  path: string
}

function extractRelativeImports(content: string): string[] {
  const imports: string[] = []
  const importRegex =
    /^import\s+(?:{[^}]*}|[\w*]+|\*\s+as\s+\w+)?\s*(?:,\s*{[^}]*})?\s*from\s+["'](\.[^"']+)["']/gm
  let match: RegExpExecArray | null
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1])
  }
  return imports
}

async function resolveModulePath(
  importPath: string,
  fromFile: string,
): Promise<string | null> {
  const fromDir = dirname(fromFile)
  const baseResolved = resolve(fromDir, importPath)
  const extensions = [".ts", ".tsx", ".js", ".jsx", ""]
  for (const ext of extensions) {
    const fullPath = baseResolved + ext
    if (await exists(fullPath)) {
      return fullPath
    }
  }
  if (await exists(baseResolved)) {
    const indexPath = join(baseResolved, "index.ts")
    if (await exists(indexPath)) {
      return indexPath
    }
  }
  return null
}

async function collectRelativeImports(
  filePath: string,
  visited: Set<string> = new Set(),
  verbose: boolean | undefined,
): Promise<ImportedModule[]> {
  const normalizedPath = resolve(filePath)
  if (visited.has(normalizedPath)) {
    return []
  }
  visited.add(normalizedPath)
  const modules: ImportedModule[] = []
  try {
    const content = await readFile(normalizedPath, "utf-8")
    const relativeImports = extractRelativeImports(content)
    for (const importPath of relativeImports) {
      const resolvedPath = await resolveModulePath(importPath, normalizedPath)
      if (!resolvedPath) {
        if (verbose) {
          console.log(
            `  Could not resolve import: ${importPath} from ${normalizedPath}`,
          )
        }
        continue
      }
      const importContent = await readFile(resolvedPath, "utf-8")
      modules.push({
        content: importContent,
        path: resolvedPath,
      })
      const nestedModules = await collectRelativeImports(
        resolvedPath,
        visited,
        verbose,
      )
      modules.push(...nestedModules)
    }
  } catch (error) {
    if (verbose) {
      console.log(`  Error processing ${normalizedPath}: ${error}`)
    }
  }
  return modules
}

async function processMdxContent(
  mdxContent: string,
  pageUrl: string | undefined,
  demosFolder: string | undefined,
  docProps: DocProps | null,
  verbose: boolean | undefined,
): Promise<{content: string; demoFiles: string[]}> {
  let processedContent = mdxContent
  const demoFiles: string[] = []

  const lines = processedContent.split("\n")
  const titleLine = lines.findIndex((line) => line.startsWith("# "))
  processedContent =
    titleLine >= 0 ? lines.slice(titleLine + 1).join("\n") : processedContent
  if (pageUrl) {
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(\.\/#([^)]+)\)/g,
      (_, text, anchor) => `[${text}](${pageUrl}#${anchor})`,
    )
  }
  if (docProps) {
    const typeDocRegex =
      /<TypeDocProps\s+name=["']([^"']+)["'](?:\s+partial)?[^>]*\/>/g
    processedContent = processedContent.replace(
      typeDocRegex,
      (match, propsName) => {
        const isPartial = /\spartial(?:\s|\/|>)/.test(match)
        const componentProps = docProps.props[propsName]
        if (!componentProps) {
          if (verbose) {
            console.log(`  TypeDocProps not found: ${propsName}`)
          }
          return ""
        }
        const propsDoc = extractProps(componentProps, isPartial)
        if (verbose) {
          console.log(
            `  Replaced TypeDocProps ${propsName} with API documentation`,
          )
        }
        return `**Component Props:**\n\`\`\`json\n${JSON.stringify(propsDoc, null, 2)}\n\`\`\`\n`
      },
    )
  } else {
    processedContent = processedContent.replace(/<TypeDocProps\s+[^>]*\/>/g, "")
  }
  let demoRegex = /<(?:QdsDemo|CodeDemo)\s+[^>]*name="(\w+)"[^>]*\/>/g
  let demoMatches = Array.from(processedContent.matchAll(demoRegex))
  if (!demoMatches.length) {
    demoRegex = /<(?:QdsDemo|CodeDemo)\s+[^>]*node=\{Demo\.(\w+)\}[^>]*\/>/g
    demoMatches = Array.from(processedContent.matchAll(demoRegex))
  }
  const replacements = await Promise.all(
    demoMatches.map(async (match) => {
      const [fullMatch, demoName] = match
      const kebabName = kebabCase(demoName)
      let filePath = `${kebabName}.tsx`
      if (!demosFolder) {
        if (verbose) {
          console.log(`  No demos folder for ${demoName}`)
        }
        return {match: fullMatch, replacement: ""}
      }
      let demoFilePath = join(demosFolder, filePath)
      let isAngularDemo = false
      if (!(await exists(demoFilePath))) {
        demoFilePath = join(demosFolder, `${kebabName}.ts`)
        if (await exists(demoFilePath)) {
          isAngularDemo = true
          filePath = `${kebabCase(demoName).replace("-component", ".component")}.ts`
          demoFilePath = join(demosFolder, filePath)
        } else {
          console.log(`  Demo not found ${demoName}`)
          return {match: fullMatch, replacement: ""}
        }
      }
      try {
        const demoCode = await readFile(demoFilePath, "utf-8")
        const cleanedCode = removePreviewLines(demoCode)
        const codeBlock = `\`\`\`${isAngularDemo ? "angular-ts" : "tsx"}\n${cleanedCode}\`\`\``
        if (verbose) {
          console.log(`  Replaced demo ${demoName} with source code`)
        }
        demoFiles.push(demoFilePath)
        return {match: fullMatch, replacement: codeBlock}
      } catch (error) {
        if (verbose) {
          console.log(`  Error reading demo ${demoName}: ${error}`)
        }
        return {match: fullMatch, replacement: ""}
      }
    }),
  )
  for (const {match, replacement} of replacements) {
    processedContent = processedContent.replace(match, replacement)
  }
  processedContent = processedContent.replace(/\n\s*\n\s*\n/g, "\n\n")
  return {content: processedContent, demoFiles}
}

async function processComponent(
  component: PageInfo,
  docProps: DocProps | null,
  verbose: boolean | undefined,
): Promise<ProcessedPage> {
  try {
    const mdxContent = await readFile(component.mdxFile, "utf-8")
    if (verbose) {
      console.log(`Processing page: ${component.name}`)
    }
    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(remarkParseFrontmatter)
      .use(remarkSelfLinkHeadings(component.url))
      .use(remarkStringify)
    const parsed = await processor.process(mdxContent)
    const frontmatter = (parsed.data as any)?.frontmatter || {}
    const {content: processedContent, demoFiles} = await processMdxContent(
      String(parsed),
      component.url,
      component.demosFolder,
      docProps,
      verbose,
    )
    const contentWithoutFrontmatter = processedContent.replace(
      /^---[\s\S]*?---\n/,
      "",
    )
    const title = frontmatter.title || component.name

    return {
      content: contentWithoutFrontmatter.trim(),
      demoFiles,
      frontmatter,
      title,
    }
  } catch (error) {
    console.error(`Error processing component ${component.name}:`, error)
    throw error
  }
}

async function generatePerPageExports({
  includeImports,
  metadata,
  outputPath,
  pages,
  pageTitlePrefix,
  processedPages,
  verbose,
}: {
  includeImports?: boolean
  metadata: string[][]
  outputPath: string
  pages: PageInfo[]
  pageTitlePrefix?: string
  processedPages: ProcessedPage[]
  verbose: boolean | undefined
}) {
  await mkdir(dirname(outputPath), {recursive: true}).catch()
  const count = processedPages.length
  let totalSize = 0
  await Promise.all(
    processedPages.map(async (processedPage, index) => {
      const page = pages[index]
      const lines: string[] = []
      if (metadata.length || page.url) {
        lines.push("---")
        if (page.url) {
          lines.push(`url: ${page.url}`)
        }
        if (metadata.length) {
          for (const [key, value] of metadata) {
            lines.push(`${key}: ${value}`)
          }
        }
        lines.push("---")
        lines.push("")
      }

      lines.push(`# ${processedPage.title}`)
      lines.push("")
      if (processedPage.frontmatter?.title) {
        page.name = processedPage.frontmatter.title
      }
      let content = processedPage.content
      if (pageTitlePrefix) {
        content = content.replace(
          `# ${page.name}`,
          `# ${pageTitlePrefix} ${page.name}`,
        )
        page.name = `${pageTitlePrefix} ${page.name}`
      }
      lines.push(content)
      lines.push("")

      if (includeImports && processedPage.demoFiles.length > 0) {
        if (verbose) {
          console.log(
            `Collecting imports for ${page.name} from ${processedPage.demoFiles.length} demo files`,
          )
        }

        const allImports: ImportedModule[] = []
        for (const demoFile of processedPage.demoFiles) {
          const imports = await collectRelativeImports(
            demoFile,
            new Set(),
            verbose,
          )
          allImports.push(...imports)
        }

        const uniqueImports = Array.from(
          new Map(allImports.map((m) => [m.path, m])).values(),
        )

        if (verbose) {
          console.log(
            `  Collected ${uniqueImports.length} unique import modules`,
          )
        }

        if (uniqueImports.length > 0) {
          lines.push("## Related Source Files")
          lines.push("")
          for (const importedModule of uniqueImports) {
            const ext = extname(importedModule.path).slice(1)
            lines.push(`### ${basename(importedModule.path)}`)
            lines.push("")
            lines.push(`\`\`\`${ext}`)
            lines.push(importedModule.content)
            lines.push("```")
            lines.push("")
          }
        }
      }

      const outfile = `${resolve(outputPath)}/${kebabCase(page.name)}.md`
      await writeFile(outfile, lines.join("\n"), "utf-8")
      const stats = await stat(outfile)
      totalSize += stats.size / 1024
    }),
  )
  console.log(`Generated ${count} component(s) in ${outputPath}`)
  console.log(`Folder size: ${totalSize.toFixed(1)} KB`)
}

function extractMetadata(metadata: string[] | undefined): string[][] {
  return (metadata ?? []).map((current) => {
    const [key, value] = current.split("=")
    return [key, value]
  })
}

export async function generate({
  baseUrl,
  clean,
  description,
  docPropsPath,
  exclude,
  includeImports,
  metadata,
  name,
  outputMode,
  outputPath,
  pageTitlePrefix,
  routeDir,
  verbose,
}: WebUiKnowledgeConfig): Promise<void> {
  const extractedMetadata = extractMetadata(metadata)
  if (verbose) {
    console.log(`Scanning pages in: ${routeDir}`)
    if (exclude?.length) {
      console.log(`Excluding patterns: ${exclude.join(", ")}`)
    }
  }
  const [docProps, pages] = await Promise.all([
    loadDocProps(routeDir, docPropsPath, verbose),
    scanPages(routeDir, verbose, exclude, baseUrl),
  ])
  if (pages.length === 0) {
    console.log("No pages found.")
    return
  }
  if (verbose) {
    console.log(`Found ${pages.length} page(s)`)
  }
  const processedPages: ProcessedPage[] = []
  for (const page of pages) {
    try {
      const processed = await processComponent(page, docProps, verbose)
      processedPages.push(processed)
    } catch (error) {
      console.error(`Failed to process page: ${page.name}`)
      process.exit(1)
    }
  }
  if (clean) {
    await rm(outputPath, {force: true, recursive: true}).catch()
  }
  if (outputMode === "aggregated") {
    const llmsTxtContent = await generateLlmsTxt(
      processedPages,
      name,
      description,
      baseUrl,
    )
    await mkdir(dirname(outputPath), {recursive: true}).catch()
    await writeFile(outputPath, llmsTxtContent, "utf-8")
    const outputStats = await stat(outputPath)
    const outputSizeKb = (outputStats.size / 1024).toFixed(1)
    console.log(
      `Generated ${outputPath} with ${pages.length} component(s) at: ${outputPath}`,
    )
    console.log(`File size: ${outputSizeKb} KB`)
  } else {
    await mkdir(outputPath, {recursive: true}).catch()
    await generatePerPageExports({
      includeImports,
      metadata: extractedMetadata,
      outputPath,
      pages,
      pageTitlePrefix,
      processedPages,
      verbose,
    })
  }
}

export function addGenerateKnowledgeCommand() {
  program
    .description("Generate llms.txt from QUI Docs documentation")
    .command("generate-llms-txt")
    .option("-n, --name <name>", "Project name for llms.txt header")
    .requiredOption("-m, --output-mode <outputMode>")
    .option("-o, --outputPath <outputPath>", "Output file or directory.")
    .option(
      "-d, --description <description>",
      "Project description for llms.txt",
    )
    .option("-v, --verbose", "Enable verbose logging", false)
    .option(
      "--exclude <patterns...>",
      "Exclude folder patterns (supports * wildcards)",
      [],
    )
    .option("--base-url <url>", "Base URL for component documentation links")
    .option("--metadata <pairs...>", "metadata key-value pairs")
    .option("--clean", "Clean the output path before generating")
    .option("--include-imports", "Include relative import source files", true)
    .action(async (options) => {
      loadEnv()
      const knowledgeConfig = loadKnowledgeConfigFromEnv({
        ...options,
        outputMode:
          options.outputMode === "per-page" ? "per-page" : "aggregated",
      })
      await generate(knowledgeConfig)
    })
}
