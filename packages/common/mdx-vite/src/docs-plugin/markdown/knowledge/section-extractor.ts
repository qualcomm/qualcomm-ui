// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Code, Link, Parent, Root, RootContent, Text} from "mdast"
import {toString} from "mdast-util-to-string"
import remarkGfm from "remark-gfm"
import remarkStringify from "remark-stringify"
import {type Plugin, unified} from "unified"
import {visit} from "unist-util-visit"

import type {
  CodeExample,
  PageEntry,
  PageHeading,
  SectionEntry,
  SectionTypes,
  SimplifiedProp,
} from "@qualcomm-ui/mdx-common"

import {isSpoilerBlock, isStepBlock} from "../../remark"
import {SlugGenerator, slugify} from "../create-slug"

import {computeMd5} from "./utils"

export interface SectionExtractorOptions {
  /**
   * Header depths that define section boundaries.
   * @default [1, 2, 3, 4]
   */
  depths?: number[]

  /**
   * Minimum content length to create a section entry.
   * @default 0
   */
  minContentLength?: number

  /**
   * Prefix to use for page IDs.
   */
  pageIdPrefix?: string
}

export interface PageInfo {
  frontmatter: Record<string, unknown>
  id: string
  pathname: string
  title: string
  url?: string
}

interface HeaderInfo {
  depth: number
  text: string
}

interface PendingSection {
  anchorId?: string
  headerPath: string[]
  headingLevel: number
  nodes: RootContent[]
  startIndex: number
}

export interface ExtractionResult {
  sections: SectionEntry[]
  toc: PageHeading[]
}

/**
 * Extracts sections from processed markdown content, organized by headers.
 */
export class SectionExtractor {
  private readonly depths: Set<number>
  private readonly minContentLength: number
  private readonly pageIdPrefix: string

  constructor(options?: SectionExtractorOptions) {
    const defaultDepths = [1, 2, 3, 4]
    this.depths = new Set(options?.depths ?? defaultDepths)
    this.minContentLength = options?.minContentLength ?? 0
    this.pageIdPrefix = options?.pageIdPrefix ?? ""
  }

  /**
   * Extracts sections from a parsed AST and generates a table of contents.
   */
  extract(tree: Root, pageInfo: PageInfo): ExtractionResult {
    const sections: SectionEntry[] = []
    const toc: PageHeading[] = []
    const headerStack: HeaderInfo[] = [{depth: 1, text: pageInfo.title}]
    const slugGenerator = new SlugGenerator()

    let pendingSection: PendingSection | null = null

    const finalizeSection = () => {
      if (!pendingSection || pendingSection.nodes.length === 0) {
        return
      }

      const entry = this.buildSectionEntry(pendingSection, pageInfo)
      if (entry && entry.content.length >= this.minContentLength) {
        sections.push(entry)
      }
    }

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i]

      if (node.type === "yaml") {
        continue
      }

      if (node.type === "heading") {
        const heading = node

        if (!this.depths.has(heading.depth)) {
          if (pendingSection) {
            pendingSection.nodes.push(node)
          } else {
            pendingSection = {
              headerPath: headerStack.map((h) => h.text),
              headingLevel: headerStack[headerStack.length - 1]?.depth ?? 1,
              nodes: [],
              startIndex: i,
            }
          }
          continue
        }

        finalizeSection()

        while (
          headerStack.length > 0 &&
          headerStack[headerStack.length - 1].depth >= heading.depth
        ) {
          headerStack.pop()
        }

        const headingText = toString(heading)
        headerStack.push({depth: heading.depth, text: headingText})

        let anchorId: string | undefined
        // h1 headings are page titles — don't include in ToC
        if (heading.depth > 1) {
          anchorId = slugGenerator.createSlug(headingText)
          toc.push({
            headingLevel: heading.depth,
            id: anchorId,
            tagName: `h${heading.depth}`,
            textContent: headingText,
          })
        }

        pendingSection = {
          anchorId,
          headerPath: headerStack.map((h) => h.text),
          headingLevel: heading.depth,
          nodes: [],
          startIndex: i,
        }
      } else if (pendingSection) {
        pendingSection.nodes.push(node)
      } else {
        pendingSection = {
          headerPath: headerStack.map((h) => h.text),
          headingLevel: headerStack[headerStack.length - 1]?.depth ?? 1,
          nodes: [node],
          startIndex: i,
        }
      }
    }

    finalizeSection()

    return {sections, toc}
  }

  /**
   * Extracts the entire page as a single entry with full raw markdown content.
   */
  extractPage(tree: Root, pageInfo: PageInfo): PageEntry | null {
    const nodes = tree.children.filter((node) => node.type !== "yaml")

    if (nodes.length === 0) {
      return null
    }

    const content = this.nodesToRawContent(nodes).trim()

    if (!content) {
      return null
    }

    const hashData = {
      content,
      pageId: `${this.pageIdPrefix}${pageInfo.id}`,
      pathname: pageInfo.pathname,
    }
    const hash = computeMd5(JSON.stringify(hashData))

    return {
      content,
      hash,
      pageId: `${this.pageIdPrefix}${pageInfo.id}`,
      pathname: pageInfo.pathname,
      title: pageInfo.title,
    }
  }

  private buildSectionEntry(
    section: PendingSection,
    pageInfo: PageInfo,
  ): SectionEntry | null {
    const {nodes, terms} = this.extractTerms(section.nodes)

    const contentNodes: RootContent[] = []
    const codeExamples: CodeExample[] = []

    const sectionTypes: SectionTypes[] = []
    for (const node of nodes) {
      if (node.type === "code") {
        const codeNode = node as Code & {
          data?: {typeDocProps?: {name: string; props: SimplifiedProp[]}}
        }

        if (codeNode.data?.typeDocProps) {
          const {name, props} = codeNode.data.typeDocProps
          sectionTypes.push({props, type: name})
        }

        codeExamples.push({
          code: codeNode.value,
          language: codeNode.lang ?? "",
        })
      } else if (
        node.type === "text" &&
        (isStepBlock(node.value.trim()) || isSpoilerBlock(node.value.trim()))
      ) {
        // continue
      } else {
        contentNodes.push(node)
      }
    }

    const rawContent = this.nodesToRawContent(nodes)
    const content = this.nodesToContent(contentNodes)

    const sectionId = this.generateSectionId(section.headerPath)
    const url =
      pageInfo.url && section.anchorId
        ? `${pageInfo.url}#${section.anchorId}`
        : undefined

    const hashData = {
      headerPath: section.headerPath,
      pageFrontmatter: Object.keys(pageInfo.frontmatter).length
        ? pageInfo.frontmatter
        : undefined,
      pageId: `${this.pageIdPrefix}${pageInfo.id}`,
      rawContent: rawContent.trim(),
      terms: terms.length ? terms : undefined,
      types: sectionTypes.length ? sectionTypes : undefined,
      url,
    }
    const sectionHash = computeMd5(JSON.stringify(hashData))

    return {
      ...hashData,
      codeExamples: codeExamples.length ? codeExamples : undefined,
      content: content.trim(),
      hash: sectionHash,
      headingLevel: section.headingLevel,
      sectionId,
    }
  }

  private extractTerms(nodes: RootContent[]): {
    nodes: RootContent[]
    terms: string[]
  } {
    const filteredNodes: RootContent[] = []
    const terms: string[] = []

    for (const node of nodes) {
      if (node.type === "paragraph") {
        const children = (node as Parent).children ?? []
        const firstChild = children[0]
        if (firstChild?.type === "text") {
          const firstText = firstChild.value
          const termsMatch = firstText.match(/^:::\s*terms\s*/)

          if (termsMatch) {
            // Collect text from all children (handles soft breaks in multiline
            // blocks)
            let fullText = firstText
            for (let i = 1; i < children.length; i++) {
              const child = children[i] as {type: string; value?: string}
              if (child.type === "text") {
                fullText += child.value
              } else if (child.type === "softBreak") {
                fullText += "\n"
              }
            }

            const parsedTerms = this.parseTermsBlock(fullText)
            terms.push(...parsedTerms)
            continue
          }
        }
      }
      filteredNodes.push(node)
    }

    return {nodes: filteredNodes, terms}
  }

  private parseTermsBlock(text: string): string[] {
    const afterOpen = text.replace(/^:::\s*terms\s*/, "")
    const closeIndex = afterOpen.lastIndexOf(":::")
    const content =
      closeIndex !== -1 ? afterOpen.slice(0, closeIndex) : afterOpen

    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== ":::")
  }

  /**
   * Convert links to inline code. URLs are not relevant for text embeddings
   * and will muddy the vector storage.
   */
  private transformLinks(): Plugin {
    return () => (tree) => {
      visit(tree, "link", (node: Link) => {
        let text = ""
        visit(node, "text", (textNode: Text) => {
          text += textNode.value
        })

        Object.assign(node, {
          children: undefined,
          type: "inlineCode",
          url: undefined,
          value: text,
        })
      })
    }
  }

  private nodesToRawContent(nodes: RootContent[]): string {
    const tree: Root = {children: nodes, type: "root"}
    const processor = unified().use(remarkGfm).use(remarkStringify)
    return processor.stringify(tree)
  }

  private nodesToContent(nodes: RootContent[]): string {
    const tree: Root = {children: structuredClone(nodes), type: "root"}
    const processor = unified()
      .use(remarkGfm)
      .use(this.transformLinks())
      .use(remarkStringify)
    const transformed = processor.runSync(tree) as Root
    return processor.stringify(transformed)
  }

  private generateSectionId(headerPath: string[]): string {
    return headerPath.map((h) => slugify(h)).join("-")
  }
}
