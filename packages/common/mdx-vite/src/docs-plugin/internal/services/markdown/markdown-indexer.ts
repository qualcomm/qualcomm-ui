// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Element} from "hast"
import {fromHtml} from "hast-util-from-html"
import {toText} from "hast-util-to-text"
import {clone, size} from "lodash-es"
import rehypeParse from "rehype-parse"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import {unified} from "unified"

import type {PageFrontmatter, PageHeading} from "@qualcomm-ui/mdx-common"

import {rehypeSlug} from "../../../rehype/rehype-slug"
import {remarkAlerts} from "../../../remark/remark-alerts"

import type {IndexedPage, IndexedSection} from "./markdown.types"
import {remarkRemoveMermaidCodeBlocks} from "./remark-remove-code-blocks"
import {remarkRemoveJsx} from "./remark-remove-jsx"

/**
 * Parses an html string into an AST and builds the search index from the tree.
 */
export class MarkdownIndexer {
  private sections: IndexedSection[] = []
  private currentSection!: IndexedSection
  private readonly headingLevels: Set<string>

  reset(): void {
    this.sections = []
    this._toc = []
    this.resetSection()
  }

  resetSection(): void {
    this.currentSection = {
      content: [],
      heading: null,
    }
  }

  get toc(): PageHeading[] {
    return this._toc
  }
  private _toc: PageHeading[] = []

  constructor(headingLevels: Set<string>) {
    this.resetSection()
    this.headingLevels = headingLevels
  }

  private appendTocItem(heading: PageHeading) {
    this._toc.push(heading)
  }

  private warn(...data: any[]) {
    if (process.env.DEBUG) {
      console.warn(...data)
    }
    // TODO: remove
    console.warn(...data)
  }

  private isHeading(element: Element): boolean {
    return this.headingLevels.has(element.tagName)
  }

  private isRootHeading(element: Element) {
    return element.tagName === "h1"
  }

  /**
   * Parses a heading Element node into the indexed heading data structure.
   */
  private parseHeading(headingElement: Element): PageHeading {
    const id = headingElement.properties.id
    const text = toText(headingElement)

    return {
      headingLevel: parseInt(headingElement.tagName.charAt(1)),
      id: id ? `${id}` : "",
      tagName: headingElement.tagName,
      textContent: text,
    }
  }

  private parseElementNode(element: Element) {
    const isRootHeading = this.isRootHeading(element)
    if (this.isHeading(element) || isRootHeading) {
      const currentSection = this.currentSection
      if (currentSection.heading) {
        // the old section is now done, so we add it and start a new one.
        this.sections.push(clone(this.currentSection))
        this.resetSection()
      }
      const heading = this.parseHeading(element)
      if (!isRootHeading) {
        this.appendTocItem(heading)
      }
      this.currentSection.heading = heading
      return
    }

    const text = toText(element, {whitespace: "pre-wrap"})
      .replaceAll("\n", "\t")
      .split("\t")
      .filter(size)

    if (text.length) {
      this.currentSection.content.push({
        tagName: element.tagName,
        text,
      })
    }
  }

  parseMarkdown(
    fileContents: string | Buffer,
    frontmatter: PageFrontmatter,
  ): IndexedPage {
    const file = unified()
      .use(remarkMdx)
      .use(remarkRemoveJsx)
      .use(remarkRemoveMermaidCodeBlocks)
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkAlerts)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(fileContents)

    let contents = file.toString()

    contents = contents.substring(contents.indexOf("<h1>"))

    for (const [key, value] of Object.entries(frontmatter)) {
      if (typeof value === "string" || typeof value === "number") {
        contents = contents.replaceAll(`frontmatter.${key}`, `${value}`)
      }
    }

    const htmlAst = unified()
      .data("settings", {fragment: true})
      .use(rehypeParse)
      .use(rehypeStringify)
      .use(rehypeSlug)
      .processSync(contents)

    contents = htmlAst.toString()

    return this.build(contents)
  }

  build(html: string): IndexedPage {
    const tree = fromHtml(html, {fragment: true})

    for (const child of tree.children) {
      if (child.type === "element") {
        this.parseElementNode(child)
      }
    }

    // The parser processes sections in order and only appends the content once a
    // new section is encountered. We manually account for the final section here.
    if (this.currentSection.heading?.textContent) {
      this.sections.push(clone(this.currentSection))
    }

    return {
      sections: this.sections,
      toc: this.toc,
    }
  }
}
