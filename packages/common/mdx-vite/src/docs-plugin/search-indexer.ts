// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import type {Root} from "mdast"

import type {
  NavItem,
  PageFrontmatter,
  PageMap,
  PageSection,
  SectionEntry,
} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"
import {defined} from "@qualcomm-ui/utils/guard"

import type {SearchIndexerOptions} from "./config"
import {DocPropsIndexer} from "./doc-props"
import {
  buildGitMetadataMap,
  type CompiledMdxFile,
  type CompiledMdxFileMetadata,
  createRemarkProcessor,
  type IndexedPage,
  type IndexedSection,
  MdxFileReader,
} from "./markdown"
import {
  type PageInfo,
  SectionExtractor,
} from "./markdown/knowledge/section-extractor"
import {
  filterFileGlob,
  getCategoriesFromPathSegments,
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
  getRouteMeta,
  NavBuilder,
  transformRouteMetaArray,
} from "./nav-builder"
import type {RouteMetaInternal, RouteMetaNavInternal} from "./nav-builder/types"
import {fixPath} from "./path-utils"

export class SearchIndexer {
  private readonly docPropsIndexer: DocPropsIndexer
  private readonly sectionExtractor: SectionExtractor
  private readonly navBuilder: NavBuilder
  private readonly mdxFileReader: MdxFileReader
  private readonly allowedHeadings: Set<string>
  private readonly metaJson: RouteMetaInternal
  private readonly routeMetaNav: Record<string, RouteMetaNavInternal> = {}
  readonly config: SearchIndexerOptions
  logWarnings: boolean

  get cachedFileCount(): number {
    return this.mdxFileReader.cachedFileCount
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
    this.mdxFileReader.reset()
    this._pageMap = {}
    this._searchIndex = []
  }

  constructor(
    config: SearchIndexerOptions,
    logWarnings = true,
    // enable composition by making these classes replaceable
    addons: {
      docPropsIndexer?: DocPropsIndexer
      mdxFileReader?: MdxFileReader
      navBuilder?: NavBuilder
      sectionExtractor?: SectionExtractor
    } = {},
  ) {
    this.config = config
    this.logWarnings = logWarnings
    this.allowedHeadings = new Set<string>(
      Array.from(config?.headings || ["h2", "h3", "h4"]),
    )
    this.metaJson = transformRouteMetaArray(
      this.config.navConfig ?? [],
      this.routeMetaNav,
    )

    const headingDepths = Array.from(this.allowedHeadings).map((h) =>
      parseInt(h.charAt(1)),
    )
    this.sectionExtractor =
      addons.sectionExtractor ||
      new SectionExtractor({depths: [1, ...headingDepths]})
    this.navBuilder =
      addons.navBuilder || new NavBuilder(this.metaJson, this.routeMetaNav)
    this.docPropsIndexer =
      addons.docPropsIndexer ||
      new DocPropsIndexer(this.config.typeDocProps ?? {})
    this.mdxFileReader =
      addons.mdxFileReader ||
      new MdxFileReader(
        process.env.NODE_ENV === "development" && !this.config.disableCache,
        this.config.pageTimestampMetadata,
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
      description: frontmatter.description,
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
      updatedBy: frontmatter.updatedBy,
      updatedOn: frontmatter.updatedOn,
    }
  }

  /**
   * Parses an MDX file to extract the site data for the nav items, doc props,
   * breadcrumbs, and search index.
   */
  private compileMdxFile(filePath: string): CompiledMdxFile {
    const {cached, fileContents, frontmatter} =
      this.mdxFileReader.readFileSync(filePath)

    const metadata: CompiledMdxFileMetadata = {
      changed: {},
      filePath,
    }

    let previousPage: IndexedPage | undefined = undefined

    if (!cached) {
      const previousData = this.mdxFileReader.readCache(filePath)
      if (previousData) {
        const cachedFm = JSON.stringify(previousData.frontmatter)
        const currentFm = JSON.stringify(frontmatter)
        previousPage = previousData.page
        if (cachedFm !== currentFm) {
          metadata.changed.frontmatter = true
        }
      }
    }

    this.docPropsIndexer.reset()

    const defaultSection: PageSection = this.getPageEntry(filePath, frontmatter)
    if (!defaultSection.categories.length && defaultSection.title) {
      defaultSection.categories = [defaultSection.title]
    }

    if (!defaultSection.hidden) {
      this.navBuilder.add(defaultSection, frontmatter)
    }

    this._pageMap[defaultSection.pathname] = defaultSection

    let indexedPage: IndexedPage

    try {
      if (cached?.page) {
        indexedPage = cached.page
      } else {
        const processor = createRemarkProcessor({
          alerts: true,
          extractMeta: {},
          frontmatter: true,
          gfm: true,
          interpolateFrontmatter: frontmatter,
          mdx: true,
          removeJsx: true,
          removeMermaidCodeBlocks: true,
        })
        const tree = processor.runSync(processor.parse(fileContents)) as Root
        const pageInfo: PageInfo = {
          frontmatter: frontmatter as unknown as Record<string, unknown>,
          id: defaultSection.id,
          pathname: defaultSection.pathname,
          title: defaultSection.title,
          url: defaultSection.pathname,
        }
        const {sections, toc} = this.sectionExtractor.extract(tree, pageInfo)
        indexedPage = {sections, toc}
      }
    } catch (error: any) {
      console.debug(
        `${chalk.yellowBright.bold(
          "Failed to parse mdx page content.",
        )} ${chalk.blueBright.bold(filePath)}`,
      )

      if (this.config.throwOnError) {
        throw new Error(error)
      }

      return {metadata, pageSections: [defaultSection]}
    }

    const {sections, toc} = indexedPage

    if (previousPage) {
      for (let i = 0; i < toc.length; i++) {
        const previousHeading = previousPage.toc[i]
        const currentHeading = toc[i]
        if (previousHeading?.id !== currentHeading.id) {
          metadata.changed.toc = true
          break
        }
      }
    }

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

    if (!cached) {
      this.mdxFileReader.updateCache(filePath, fileContents, {
        frontmatter,
        page: indexedPage,
        pageDocProps: docProps,
        pageDocPropSections: docPropSections,
      })
    }

    // omit entries from pages that are explicitly omitted from the index.
    if (frontmatter.hideFromSearch) {
      return {metadata, pageSections: [defaultSection]}
    }

    if (!sections.length && !docPropSections.length) {
      return {metadata, pageSections: [defaultSection]}
    }

    const sectionReturn: PageSection[] = [
      ...this.formatContentSections(sections, defaultSection),
    ]

    if (this.config.typeDocPropsOptions?.includeInSearchIndex) {
      sectionReturn.push(
        ...this.formatDocPropSections(docPropSections, defaultSection),
      )
    }

    return {metadata, pageSections: sectionReturn}
  }

  private formatContentSections(
    sections: SectionEntry[],
    {toc: _toc, ...defaultSection}: PageSection,
  ): PageSection[] {
    return sections.map((section, index): PageSection => {
      const heading = section.headerPath.at(-1) ?? defaultSection.title
      return {
        ...defaultSection,
        content: section.content || undefined,
        heading,
        headingLevel: section.headingLevel,
        href: section.url ?? defaultSection.pathname,
        id: `${defaultSection.id}-${index}`,
      }
    })
  }

  private formatDocPropSections(
    sections: IndexedSection[],
    {toc: _toc, ...defaultSection}: PageSection,
  ): PageSection[] {
    return sections.map((section, index): PageSection => {
      const content = section.content.map((c) => c.text.join(" ")).join(" ")
      return {
        ...defaultSection,
        content: content || undefined,
        heading: section.heading?.textContent ?? defaultSection.title,
        headingLevel: section.heading?.headingLevel,
        href: section.heading
          ? `${defaultSection.pathname}#${section.heading.id}`
          : defaultSection.pathname,
        id: `${defaultSection.id}-${index}-prop`,
        isDocProp: true,
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

  buildIndex(
    inputFileGlob: string[],
    logWarnings: boolean = true,
  ): CompiledMdxFile[] {
    this.logWarnings = logWarnings
    this.mdxFileReader.logWarnings = logWarnings
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
    this.mdxFileReader.gitMetadataMap = buildGitMetadataMap(
      this.config.srcDir,
      this.mdxFileReader.pageTimestampMetadata,
    )
    const compiledFiles = mdxFileGlob.map((file) => this.compileMdxFile(file))

    const mdxIndex = compiledFiles
      .map((fileData) => fileData.pageSections)
      .flat()

    filterFileGlob(
      fileGlob,
      "tsx",
      this.config.srcDir,
      this.config.routingStrategy,
    ).map((file) => this.compileTsxFile(file))

    this._searchIndex.push(...mdxIndex.filter((entry) => !entry.hideFromSearch))

    this.navBuilder.build()

    return compiledFiles
  }
}
