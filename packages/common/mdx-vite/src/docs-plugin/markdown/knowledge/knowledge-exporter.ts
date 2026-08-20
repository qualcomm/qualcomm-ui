// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Link, Parent, Root} from "mdast"
import {minimatch} from "minimatch"
import {readdir} from "node:fs/promises"
import {join, relative} from "node:path"
import {visit} from "unist-util-visit"

import type {
  KnowledgePageData,
  KnowledgePages,
  KnowledgeSections,
  PageEntry,
  PageFrontmatter,
  SectionEntry,
} from "@qualcomm-ui/mdx-common"

import type {
  KnowledgeExtraFile,
  KnowledgeFrontmatterConfig,
  PagesExportConfig,
  SectionExportConfig,
} from "../../config/index.js"
import {
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
} from "../../nav-builder/index.js"
import {remarkSerializeJsxKnowledge} from "../../remark/index.js"
import type {MdxFileReader} from "../markdown-file-reader.js"
import {createRemarkProcessor} from "../remark-pipeline.js"

import {filterFrontmatter} from "./filter-frontmatter.js"
import {
  filterTextDirectives,
  formatDemos,
  formatNpmInstallTabs,
  formatThemeNodes,
  PropFormatter,
} from "./plugins/index.js"
import {SectionExtractor} from "./section-extractor.js"
import type {
  KnowledgePageCache,
  MdxFlowExpression,
  ProcessedPage,
} from "./types.js"
import {computeMd5} from "./utils.js"

export interface KnowledgeExporterConfig {
  baseUrl?: string
  docPropsPath?: string
  exclude?: string[]
  extraFiles?: KnowledgeExtraFile[]
  frontmatter?: KnowledgeFrontmatterConfig
  pageIdPrefix?: string
  pages?: PagesExportConfig
  routeDir: string
  sections?: SectionExportConfig
  verbose?: boolean
}

/**
 * Processes MDX documentation pages into structured JSON data (sections + pages).
 * Does not write files — the caller handles persistence.
 */
export class KnowledgeExporter {
  private readonly cache: KnowledgePageCache
  private readonly config: KnowledgeExporterConfig
  private readonly fileReader: MdxFileReader
  private readonly propFormatter: PropFormatter

  constructor(
    config: KnowledgeExporterConfig,
    fileReader: MdxFileReader,
    cache?: KnowledgePageCache,
  ) {
    this.cache = cache ?? new Map()
    this.config = config
    this.fileReader = fileReader
    this.propFormatter = new PropFormatter({
      docPropsPath: config.docPropsPath,
      routeDir: config.routeDir,
      verbose: config.verbose,
    })
  }

  async generate(): Promise<{
    cachedPageCount: number
    pages: KnowledgePages
    sections: KnowledgeSections
    totalPageCount: number
  }> {
    if (this.config.verbose) {
      console.log(`Scanning pages in: ${this.config.routeDir}`)
      if (this.config.exclude?.length) {
        console.log(`Excluding patterns: ${this.config.exclude.join(", ")}`)
      }
    }

    const [pageInfos] = await Promise.all([
      this.scanPages(),
      this.propFormatter.loadDocProps(),
    ])

    if (pageInfos.length === 0) {
      console.log("No pages found.")
    } else if (this.config.verbose) {
      console.log(`Found ${pageInfos.length} page(s)`)
    }

    let cachedCount = 0
    const currentFiles = new Set<string>()
    const allSections: SectionEntry[] = []
    const allPages: PageEntry[] = []

    const sectionsConfig = this.config.sections ?? {}
    const extractor = new SectionExtractor({
      depths: sectionsConfig.depths,
      minContentLength: sectionsConfig.minContentLength,
      pageIdPrefix: this.config.pageIdPrefix,
    })

    for (const page of pageInfos) {
      currentFiles.add(page.mdxFile)

      try {
        if (this.config.verbose) {
          console.log(`Processing page: ${page.name}`)
        }

        const {fileContents, frontmatter} = this.fileReader.readFileSync(
          page.mdxFile,
        )
        const contentHash = computeMd5(fileContents)
        const cached = this.cache.get(page.mdxFile)

        if (cached && cached.contentHash === contentHash) {
          cachedCount++
          allSections.push(...cached.sections)
          if (cached.pageEntry) {
            allPages.push(cached.pageEntry)
          }
          continue
        }

        const processed = await this.processMdxPage(page, {
          fileContents,
          frontmatter,
        })

        const filteredFrontmatter = filterFrontmatter(
          processed.frontmatter,
          this.config.frontmatter,
        )
        const pageInfo = {
          frontmatter: filteredFrontmatter,
          id: page.id,
          pathname: page.pathname,
          title: processed.title,
          url: processed.url,
        }

        const {sections: pageSections} = extractor.extract(
          processed.sectionAst,
          pageInfo,
        )
        allSections.push(...pageSections)

        const pageEntry = extractor.extractPage(processed.sectionAst, pageInfo)
        if (pageEntry) {
          pageEntry.content = `# ${processed.title}\n\n${pageEntry.content}`
          allPages.push(pageEntry)
        }

        this.cache.set(page.mdxFile, {
          contentHash,
          pageEntry: pageEntry ?? null,
          processedPage: processed,
          sections: pageSections,
        })
      } catch (error) {
        console.error(`Failed to process page: ${page.name}`)
        throw error
      }
    }

    // Prune cache entries for deleted files
    for (const key of this.cache.keys()) {
      if (!currentFiles.has(key)) {
        this.cache.delete(key)
      }
    }

    // Process extra files
    if (this.config.extraFiles?.length) {
      await this.processExtraFiles(
        this.config.extraFiles,
        extractor,
        allSections,
        allPages,
      )
    }

    const sectionsHash = computeMd5(JSON.stringify(allSections))
    const pagesHash = computeMd5(JSON.stringify(allPages))

    return {
      cachedPageCount: cachedCount,
      pages: {
        generatedAt: new Date().toISOString(),
        hash: pagesHash,
        pages: allPages,
        totalPages: allPages.length,
        version: 1,
      },
      sections: {
        generatedAt: new Date().toISOString(),
        hash: sectionsHash,
        sections: allSections,
        totalSections: allSections.length,
        version: 1,
      },
      totalPageCount: pageInfos.length,
    }
  }

  private async scanPages(): Promise<KnowledgePageData[]> {
    const components: KnowledgePageData[] = []
    const excludePatterns = this.config.exclude ?? []

    const shouldExclude = (absolutePath: string): boolean => {
      if (excludePatterns.length === 0) {
        return false
      }
      const relativePath = relative(this.config.routeDir, absolutePath)
      return excludePatterns.some((pattern) =>
        minimatch(relativePath, pattern, {matchBase: true}),
      )
    }

    const scanDirectory = async (dirPath: string): Promise<void> => {
      if (shouldExclude(dirPath)) {
        if (this.config.verbose) {
          console.log(
            `Excluding directory: ${relative(this.config.routeDir, dirPath)}`,
          )
        }
        return
      }

      const entries = await readdir(dirPath, {withFileTypes: true})
      const mdxFiles =
        entries.filter(
          (f) =>
            f.name.endsWith(".mdx") && !shouldExclude(join(dirPath, f.name)),
        ) ?? []

      for (const mdxFile of mdxFiles) {
        const demosFolder = entries.find((f) => f.name === "demos")
        const demosFolderPath = demosFolder
          ? join(dirPath, demosFolder.name)
          : undefined

        const segments = getPathSegmentsFromFileName(
          join(dirPath, mdxFile.name),
          this.config.routeDir,
        )
        const url = getPathnameFromPathSegments(segments)

        components.push({
          demosFolder: demosFolderPath,
          filePath: dirPath,
          id: segments.join("-").trim(),
          mdxFile: join(dirPath, mdxFile.name),
          name: segments.at(-1)!,
          pathname: url,
          url: this.config.baseUrl
            ? new URL(url, this.config.baseUrl).toString()
            : undefined,
        })

        if (this.config.verbose) {
          console.log(`Found file: ${segments.at(-1)}`)
          console.log(`  Demos folder: ${demosFolderPath || "NOT FOUND"}`)
        }
      }

      for (const entry of entries) {
        if (entry.isDirectory()) {
          await scanDirectory(join(dirPath, entry.name))
        }
      }
    }

    await scanDirectory(this.config.routeDir)
    return components
  }

  private formatFrontmatterExpressions(
    frontmatter: Record<string, unknown> | PageFrontmatter,
  ) {
    return () => (tree: Root) => {
      visit(
        tree,
        "mdxFlowExpression",
        (
          node: MdxFlowExpression,
          index: number | undefined,
          parent: Parent | undefined,
        ) => {
          if (
            node.value.trim() !== "frontmatter.description" ||
            index === undefined ||
            !parent
          ) {
            return
          }

          if (frontmatter.description) {
            parent.children.splice(index, 1, {
              children: [
                {type: "text", value: frontmatter.description as string},
              ],
              type: "paragraph",
            })
          } else {
            parent.children.splice(index, 1)
          }
        },
      )

      const root = tree as Parent
      const h1Index = root.children.findIndex((node) => {
        if (node.type !== "heading" || node.depth !== 1) {
          return false
        }
        return node.children?.some(
          (child) =>
            child.type === "mdxTextExpression" &&
            child.value?.includes("frontmatter"),
        )
      })
      if (h1Index >= 0) {
        root.children.splice(h1Index, 1)
      }
    }
  }

  private transformRelativeUrls() {
    const baseUrl = this.config.baseUrl
    return () => (tree: Root) => {
      if (!baseUrl) {
        return
      }
      visit(tree, "link", (node: Link) => {
        if (node.url.startsWith("/")) {
          node.url = `${baseUrl}${node.url}`
        }
      })
    }
  }

  private async processMdxContent(
    mdxContent: string,
    pageInfo: KnowledgePageData,
    frontmatter: Record<string, unknown> | PageFrontmatter,
  ): Promise<Root> {
    const themePlugin = await formatThemeNodes()

    const processor = createRemarkProcessor({
      frontmatter: true,
      gfm: true,
      mdx: true,
      plugins: [
        remarkSerializeJsxKnowledge,
        formatNpmInstallTabs,
        this.propFormatter.propsToMarkdownList(),
        this.formatFrontmatterExpressions(frontmatter),
        themePlugin,
        formatDemos(pageInfo.demosFolder, this.config.verbose),
        filterTextDirectives,
        this.transformRelativeUrls(),
      ],
    })

    return (await processor.run(processor.parse(mdxContent))) as Root
  }

  private async processMdxPage(
    pageInfo: KnowledgePageData,
    preRead?: {
      fileContents: string
      frontmatter: Record<string, unknown> | PageFrontmatter
    },
  ): Promise<ProcessedPage> {
    const {fileContents, frontmatter} =
      preRead ?? this.fileReader.readFileSync(pageInfo.mdxFile)
    const ast = await this.processMdxContent(
      fileContents,
      pageInfo,
      frontmatter,
    )

    const jsxAndMetaProcessor = createRemarkProcessor({
      extractMeta: {},
      frontmatter: true,
      gfm: true,
      mdx: true,
      output: "md",
      removeJsx: true,
    })
    const sectionAst = jsxAndMetaProcessor.runSync(ast) as Root
    const processed = String(jsxAndMetaProcessor.stringify(sectionAst))
    const rawContent = processed
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
      .replace(/(^#{1,6} .*\\<[^>]+)>/gm, "$1\\>")

    // Strip meta blocks from raw content for the prose-only field
    const stripMetaProcessor = createRemarkProcessor({
      extractMeta: {},
      output: "md",
    })
    const strippedContent = String(await stripMetaProcessor.process(rawContent))

    const title = (frontmatter.title as string) || pageInfo.name

    return {
      content: strippedContent.trim(),
      frontmatter: frontmatter as unknown as Record<string, unknown>,
      rawContent: rawContent.trim(),
      sectionAst,
      title,
      url: pageInfo.url,
    }
  }

  private async processExtraFiles(
    extraFiles: KnowledgeExtraFile[],
    extractor: SectionExtractor,
    allSections: SectionEntry[],
    allPages: PageEntry[],
  ): Promise<void> {
    await Promise.all(
      extraFiles.map(async (extraFile) => {
        let contents = extraFile.contents
        if (extraFile.processAsMdx) {
          const removeJsxProcessor = createRemarkProcessor({
            frontmatter: true,
            gfm: true,
            mdx: true,
            output: "md",
            plugins: [this.transformRelativeUrls()],
            removeJsx: true,
          })

          contents = String(await removeJsxProcessor.process(contents))
        }

        const lines: string[] = []
        if (extraFile.title) {
          lines.push(`# ${extraFile.title}`)
          lines.push("")
        }
        lines.push(contents)
        const content = lines.join("\n")

        const processor = createRemarkProcessor({gfm: true, output: "md"})
        const tree = processor.parse(content)

        const pageInfo = {
          frontmatter: {},
          id: extraFile.id,
          title: extraFile.title || extraFile.id,
        }

        const {sections: pageSections} = extractor.extract(tree, pageInfo)
        allSections.push(...pageSections)

        const pageEntry = extractor.extractPage(tree, pageInfo)
        if (pageEntry) {
          allPages.push(pageEntry)
        }
      }),
    )
  }
}
