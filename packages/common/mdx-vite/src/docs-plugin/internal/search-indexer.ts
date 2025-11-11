// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"

import type {
  NavItem,
  PageFrontmatter,
  PageMap,
  PageSection,
  QuiPropTypes,
} from "@qualcomm-ui/mdx-docs-common"

import type {
  RouteMetaInternal,
  RouteMetaNavInternal,
  SearchIndexerOptions,
} from "../types"

import {
  DocPropsIndexer,
  filterFileGlob,
  getCategoriesFromPathSegments,
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
  getRouteMeta,
  type IndexedPage,
  type IndexedSection,
  MarkdownFileReader,
  MarkdownIndexer,
  NavBuilder,
} from "./services"
import {transformRouteMetaArray} from "./transform-route-meta-array"
import {defined, fixPath} from "./utils"

export class SearchIndexer {
  private readonly docPropsIndexer: DocPropsIndexer
  private readonly markdownIndexer: MarkdownIndexer
  private readonly navBuilder: NavBuilder
  private readonly fileCache: MarkdownFileReader
  private readonly allowedHeadings: Set<string>
  private readonly metaJson: RouteMetaInternal
  private readonly routeMetaNav: Record<string, RouteMetaNavInternal> = {}

  get cachedFileCount(): number {
    return this.fileCache.cachedFileCount
  }

  get pageDocProps(): Record<string, Record<string, QuiPropTypes>> {
    return this._pageDocProps
  }
  private _pageDocProps: Record<string, Record<string, QuiPropTypes>> = {}

  get mdxFileCount(): number {
    return this._mdxFileCount
  }
  private _mdxFileCount: number = 0

  get navItems(): NavItem[] {
    return this.navBuilder.navItems
  }

  get pageMap(): PageMap {
    return this._pageMap
  }
  private _pageMap: PageMap = {}

  get searchIndex(): PageSection[] {
    return this._searchIndex
  }
  private _searchIndex: PageSection[] = []

  reset(): void {
    this.fileCache.reset()
    this._pageMap = {}
    this._searchIndex = []
  }

  constructor(
    public config: SearchIndexerOptions,
    public logWarnings = true,
    // enable composition by making these classes replaceable
    addons: {
      docPropsIndexer?: DocPropsIndexer
      fileCache?: MarkdownFileReader
      markdownIndexer?: MarkdownIndexer
      navBuilder?: NavBuilder
    } = {},
  ) {
    this.allowedHeadings = new Set<string>(
      Array.from(config?.headings || ["h2", "h3", "h4"]),
    )
    this.metaJson = transformRouteMetaArray(
      this.config.navConfig ?? [],
      this.routeMetaNav,
    )

    this.markdownIndexer =
      addons.markdownIndexer || new MarkdownIndexer(this.allowedHeadings)
    this.navBuilder =
      addons.navBuilder || new NavBuilder(this.metaJson, this.routeMetaNav)
    this.docPropsIndexer =
      addons.docPropsIndexer ||
      new DocPropsIndexer(this.config.typeDocProps ?? {})
    this.fileCache =
      addons.fileCache ||
      new MarkdownFileReader(
        process.env.NODE_ENV === "development" && !this.config.disableCache,
      )
  }

  /**
   * Resolves a page's properties from the combined frontmatter and RouteMeta.
   * RouteMeta properties take precedence.
   */
  private getPageEntry(
    filepath: string,
    frontmatter: Partial<PageFrontmatter>,
  ): PageSection {
    const pagePath = filepath.replace(this.config.srcDir, "")

    const pathSegments = getPathSegmentsFromFileName(
      pagePath,
      this.config.pageDirectory,
      this.config.routingStrategy,
    )

    const pathname = getPathnameFromPathSegments(pathSegments)

    const routeMeta =
      getRouteMeta(
        pathSegments.length === 0
          ? frontmatter.id
            ? [frontmatter.id]
            : ["_index"]
          : pathSegments,
        this.metaJson,
      ) ?? {}

    return {
      categories:
        frontmatter.categories ??
        getCategoriesFromPathSegments(
          pathSegments,
          this.metaJson,
          routeMeta?.title || frontmatter.title || "",
        ),
      hidden: defined(routeMeta.hidden) ? routeMeta.hidden : frontmatter.hidden,
      hideBreadcrumbs: defined(routeMeta.hideBreadcrumbs)
        ? routeMeta.hideBreadcrumbs
        : frontmatter.hideBreadcrumbs,
      hideFromSearch: defined(routeMeta.hideFromSearch)
        ? routeMeta.hideFromSearch
        : frontmatter.hideFromSearch,
      hidePageLinks: defined(routeMeta.hidePageLinks)
        ? routeMeta.hidePageLinks
        : frontmatter.hidePageLinks,
      hideSideNav: defined(routeMeta.hideSideNav)
        ? routeMeta.hideSideNav
        : frontmatter.hideSideNav,
      hideToc: defined(routeMeta.hideToc)
        ? routeMeta.hideToc
        : frontmatter.hideToc,
      id: pagePath,
      pathname,
      pathSegments,
      restricted: defined(routeMeta.restricted)
        ? routeMeta.restricted
        : frontmatter.restricted,
      title: defined(routeMeta.title)
        ? routeMeta.title || ""
        : frontmatter.title || "",
    }
  }

  /**
   * Parses an MDX file to extract the site data for the nav items, doc props,
   * breadcrumbs, and search index.
   */
  private compileMdxFile(filepath: string): PageSection[] {
    const {cached, fileContents, frontmatter} =
      this.fileCache.readFile(filepath)

    this.docPropsIndexer.reset()
    this.markdownIndexer.reset()

    const defaultSection: PageSection = this.getPageEntry(filepath, frontmatter)
    if (!defaultSection.categories.length && defaultSection.title) {
      defaultSection.categories = [defaultSection.title]
    }

    if (!defaultSection.hidden) {
      this.navBuilder.add(defaultSection, frontmatter)
    }

    this._pageMap[defaultSection.pathname] = defaultSection

    let indexedPage: IndexedPage

    try {
      indexedPage = cached?.page
        ? cached.page
        : this.markdownIndexer.parseMarkdown(fileContents, frontmatter)
    } catch (error) {
      console.debug(
        `${chalk.yellowBright.bold(
          "Failed to parse mdx page content.",
        )} ${chalk.blueBright.bold(filepath)}`,
      )

      return [defaultSection]
    }

    const {sections, toc} = indexedPage

    if (toc.length) {
      this._pageMap[defaultSection.pathname].toc = toc
    }

    let docPropSections: IndexedSection[] = []
    let docProps: Record<string, QuiPropTypes> = {}

    if (this.config.typeDocProps) {
      docPropSections =
        cached?.pageDocPropSections ||
        (this.docPropsIndexer.build(fileContents, toc) ?? [])
      docProps = cached?.pageDocProps || this.docPropsIndexer.getDocProps()
    }

    if (docPropSections.length) {
      this._pageDocProps[defaultSection.pathname] = docProps
    }

    this.fileCache.updateCache(filepath, fileContents, {
      frontmatter,
      page: indexedPage,
      pageDocProps: docProps,
      pageDocPropSections: docPropSections,
    })

    // omit entries from pages that are explicitly omitted from the index.
    if (frontmatter.hideFromSearch) {
      return [defaultSection]
    }

    if (!sections.length && !docPropSections.length) {
      return [defaultSection]
    }

    const sectionReturn: PageSection[] = [
      ...this.formatSections(sections, defaultSection, false),
    ]

    if (this.config.typeDocPropsOptions?.includeInSearchIndex) {
      sectionReturn.push(
        ...this.formatSections(docPropSections, defaultSection, true),
      )
    }

    return sectionReturn
  }

  private formatSections(
    sections: IndexedSection[],
    {toc: _toc, ...defaultSection}: PageSection,
    isDocProp: boolean,
  ): PageSection[] {
    return sections.map((section, index): PageSection => {
      const content = section.content.map((c) => c.text.join(" ")).join(" ")
      return {
        ...defaultSection,
        content: content || undefined,
        heading: section.heading?.textContent ?? defaultSection.title,
        headingLevel: section.heading?.headingLevel,
        href:
          section.heading &&
          (this.allowedHeadings.has(section.heading.tagName) || isDocProp)
            ? `${defaultSection.pathname}#${section.heading.id}`
            : defaultSection.pathname,
        id: `${defaultSection.id}-${index}${isDocProp ? "-prop" : ""}`,
        isDocProp: isDocProp || undefined,
      }
    })
  }

  private compileTsxFile(filepath: string) {
    const entry = this.getPageEntry(filepath, {})

    const routeMeta = getRouteMeta(
      entry.pathSegments.length === 0 ? ["_index"] : entry.pathSegments,
      this.metaJson,
    )

    if (!routeMeta) {
      return null
    }

    if (!entry.hidden) {
      this.navBuilder.add(entry, {}, routeMeta)
    }

    this._pageMap[entry.pathname] = entry

    return entry
  }

  buildIndex(inputFileGlob: string[], logWarnings: boolean = true): void {
    this.logWarnings = logWarnings
    this.fileCache.logWarnings = logWarnings
    // Windows path fix
    const fileGlob = inputFileGlob.map(fixPath)
    this.navBuilder.reset()
    this.reset()
    const mdxFileGlob = filterFileGlob(
      fileGlob,
      "mdx",
      this.config.srcDir,
      this.config.routingStrategy,
    )
    this._mdxFileCount = mdxFileGlob.length
    const mdxIndex = mdxFileGlob.map((file) => this.compileMdxFile(file)).flat()
    filterFileGlob(
      fileGlob,
      "tsx",
      this.config.srcDir,
      this.config.routingStrategy,
    ).map((file) => this.compileTsxFile(file))

    this._searchIndex.push(...mdxIndex.filter((entry) => !entry.hideFromSearch))
    this.navBuilder.build()
  }
}
