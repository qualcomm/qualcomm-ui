// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import type {Root} from "mdast"
import {join} from "node:path"

import type {
  NavItem,
  PageFrontmatter,
  PageMap,
  PageSection,
  SectionEntry,
} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"
import {defined} from "@qualcomm-ui/utils/guard"

import {
  collectRouteKeys,
  type ConfigIssues,
  countConfigIssues,
  reportConfigIssues,
  validateNavRoutes,
} from "./config-validator.js"
import {
  type QuiDocsLintOptions,
  resolveLintOptions,
  type SearchIndexerOptions,
} from "./config/index.js"
import {DocPropsIndexer} from "./doc-props/index.js"
import {
  collectAnchorIds,
  type CollectedLink,
  collectLinks,
  findNonFileLinks,
  reportFileLinkIssues,
  reportInvalidLinks,
  validateLinks,
} from "./link-validator.js"
import {
  buildGitMetadataMap,
  type CompiledMdxFile,
  type CompiledMdxFileMetadata,
  createRemarkProcessor,
  type IndexedPage,
  type IndexedSection,
  MdxFileReader,
} from "./markdown/index.js"
import {
  type PageInfo,
  SectionExtractor,
} from "./markdown/knowledge/section-extractor.js"
import {isInRoutesDir, type MdxFileLinkOptions} from "./mdx-file-links.js"
import {
  filterFileGlob,
  getCategoriesFromPathSegments,
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
  getRouteKey,
  getRouteMeta,
  NavBuilder,
  transformRouteMetaArray,
} from "./nav-builder/index.js"
import {
  type ListedNavRoute,
  loadFolderNavConfig,
} from "./nav-builder/load-folder-nav.js"
import type {
  RouteMetaEntryInternal,
  RouteMetaInternal,
  RouteMetaNavInternal,
} from "./nav-builder/types.js"
import {
  type PageTitleIssue,
  reportPageTitleIssues,
  validatePageTitle,
} from "./page-title-validator.js"
import {fixPath, realPath} from "./path-utils.js"
import {remarkSerializeJsxKnowledge} from "./remark/index.js"

interface PageRoute {
  filePath: string
  pathSegments: string[]
}

export class SearchIndexer {
  private readonly docPropsIndexer: DocPropsIndexer
  private readonly sectionExtractor: SectionExtractor
  private readonly navBuilder: NavBuilder
  private readonly mdxFileReader: MdxFileReader
  private readonly allowedHeadings: Set<string>
  private readonly metaJson: RouteMetaInternal
  private _collectedLinks: CollectedLink[] = []
  private _anchorIds: Record<string, Set<string>> = {}
  private _docPropIds: Record<string, Set<string>> = {}
  private _invalidLinkCount = 0
  private _fileLinkIssueCount = 0
  private _pageFiles: Record<string, string> = {}
  private readonly fileLinkOptions: MdxFileLinkOptions
  private _pageTitleIssues: PageTitleIssue[] = []
  private _configIssueCount = 0
  private readonly listedNavRoutes: ListedNavRoute[]
  private readonly lint: Required<QuiDocsLintOptions>
  private readonly routeMetaNav: Record<string, RouteMetaNavInternal> = {}
  private readonly structuralRoutes: ReadonlySet<string>
  readonly config: SearchIndexerOptions
  logWarnings: boolean
  /**
   * Resolved path to the Vite public directory. Links to files in this directory
   * pass link validation.
   */
  publicDir: string | undefined

  /**
   * Number of issues found by lint rules set to `"error"` during the last build.
   */
  get lintErrorCount(): number {
    return (
      (this.lint.brokenLinks === "error" ? this._invalidLinkCount : 0) +
      (this.lint.configs === "error" ? this._configIssueCount : 0) +
      (this.lint.fileLinks === "error" ? this._fileLinkIssueCount : 0) +
      (this.lint.pageTitle === "error" ? this._pageTitleIssues.length : 0)
    )
  }

  /**
   * Number of issues found by lint rules set to `"warn"` during the last build.
   */
  get lintWarningCount(): number {
    return (
      (this.lint.brokenLinks === "warn" ? this._invalidLinkCount : 0) +
      (this.lint.configs === "warn" ? this._configIssueCount : 0) +
      (this.lint.fileLinks === "warn" ? this._fileLinkIssueCount : 0) +
      (this.lint.pageTitle === "warn" ? this._pageTitleIssues.length : 0)
    )
  }

  /**
   * Number of invalid `_nav.json` files. These are skipped when building the nav.
   */
  get navConfigErrorCount(): number {
    return this._navConfigErrorCount
  }
  private readonly _navConfigErrorCount: number

  /**
   * Number of `_nav.json` files in the page directory, including invalid files.
   */
  get navFileCount(): number {
    return this._navFileCount
  }
  private readonly _navFileCount: number

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

  get ignoredMdxFiles(): ReadonlySet<string> {
    return this._ignoredMdxFiles
  }
  private _ignoredMdxFiles = new Set<string>()

  get navItems(): NavItem[] {
    return this.navBuilder.navItems
  }

  get fileLinkRoutesDir(): string {
    return this.fileLinkOptions.routesDir
  }

  /**
   * MDX source file path for each indexed page pathname.
   */
  get pageFiles(): Readonly<Record<string, string>> {
    return this._pageFiles
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
    this._collectedLinks = []
    this._anchorIds = {}
    this._docPropIds = {}
    this._invalidLinkCount = 0
    this._fileLinkIssueCount = 0
    this._pageFiles = {}
    this._pageTitleIssues = []
    this._configIssueCount = 0
    this._ignoredMdxFiles = new Set()
    this._pageDocProps = {}
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
    this.lint = resolveLintOptions(config)
    this.logWarnings = logWarnings
    this.publicDir = config.publicDir
    this.fileLinkOptions = {
      routesDir: realPath(join(config.srcDir, config.pageDirectory)),
      routingStrategy: config.routingStrategy,
    }
    this.allowedHeadings = new Set<string>(
      Array.from(config?.headings || ["h2", "h3", "h4"]),
    )
    const folderNav = loadFolderNavConfig(this.config.navConfig ?? [], {
      pageDirectory: config.pageDirectory,
      routesDir: fixPath(join(config.srcDir, config.pageDirectory)),
      routingStrategy: config.routingStrategy,
      srcDir: config.srcDir,
      throwOnError: config.throwOnError,
    })
    this._navConfigErrorCount = folderNav.errorCount
    this._navFileCount = folderNav.fileCount
    this.listedNavRoutes = folderNav.listedRoutes
    this.structuralRoutes = folderNav.structuralRoutes
    this.metaJson = transformRouteMetaArray(
      folderNav.navConfig,
      this.routeMetaNav,
      folderNav.unorderedRoutes,
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
   * `.tsx` pages are only added to the nav when they have a nav config entry.
   * Ancestors created only to reach a nested `_nav.json` don't count.
   */
  private getTsxRouteMeta(
    pathSegments: string[],
  ): RouteMetaEntryInternal | undefined | null {
    const segments = pathSegments.length ? pathSegments : ["_index"]
    if (this.structuralRoutes.has(getRouteKey(segments))) {
      return undefined
    }
    return getRouteMeta(segments, this.metaJson)
  }

  /**
   * Resolves a page's properties from the combined frontmatter and RouteMeta.
   * RouteMeta properties take precedence.
   */
  private getPageEntry(
    {filePath, pathSegments}: PageRoute,
    frontmatter: Partial<PageFrontmatter>,
  ): PageSection {
    const pagePath = filePath.replace(this.config.srcDir, "")

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
      data: frontmatter,
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
  private compileMdxFile(route: PageRoute): CompiledMdxFile {
    const {filePath} = route
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

    const defaultSection: PageSection = this.getPageEntry(route, frontmatter)
    if (!defaultSection.categories.length && defaultSection.title) {
      defaultSection.categories = [defaultSection.title]
    }

    if (!defaultSection.hidden) {
      this.navBuilder.add(defaultSection, frontmatter)
    }

    this._pageMap[defaultSection.pathname] = defaultSection
    this._pageFiles[defaultSection.pathname] = filePath

    let indexedPage: IndexedPage
    let collectedLinks: CollectedLink[] = []
    let anchorIds = new Set<string>()
    let pageTitleIssues: PageTitleIssue[] = []
    const shouldValidateLinks = this.lint.brokenLinks !== "off"
    const shouldCollectLinks =
      shouldValidateLinks || this.lint.fileLinks !== "off"

    const addLintResults = () => {
      if (shouldValidateLinks && anchorIds.size) {
        this._anchorIds[defaultSection.pathname] = anchorIds
      }
      if (this.lint.pageTitle !== "off") {
        this._pageTitleIssues.push(...pageTitleIssues)
      }
    }

    try {
      if (cached?.page) {
        indexedPage = cached.page
        collectedLinks = cached.collectedLinks
        anchorIds = cached.anchorIds
        pageTitleIssues = cached.pageTitleIssues
        addLintResults()
        this._collectedLinks.push(...collectedLinks)
      } else {
        const processor = createRemarkProcessor({
          alerts: true,
          extractMeta: {},
          frontmatter: true,
          gfm: true,
          interpolateFrontmatter: frontmatter,
          mdx: true,
          plugins: [remarkSerializeJsxKnowledge],
          removeJsx: true,
          removeMermaidCodeBlocks: true,
        })
        const rawTree = processor.parse(fileContents)
        /**
         * The anchor and page title rules and the doc props entries read the raw
         * MDX tree, before the transforms remove JSX. The lint results are cached
         * regardless of lint settings so that cache hits never need to re-parse.
         */
        anchorIds = collectAnchorIds(rawTree)
        pageTitleIssues = validatePageTitle(
          rawTree,
          filePath,
          defaultSection.pathname,
        )
        addLintResults()
        if (this.config.typeDocProps) {
          this.docPropsIndexer.collectEntries(rawTree)
        }
        const tree = processor.runSync(rawTree) as Root

        if (shouldCollectLinks) {
          collectedLinks = collectLinks(
            tree,
            filePath,
            defaultSection.pathname,
            this.fileLinkOptions,
          )
          this._collectedLinks.push(...collectedLinks)
        }

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
        cached?.pageDocPropSections || (this.docPropsIndexer.build(toc) ?? [])
      docProps = cached?.pageDocProps || this.docPropsIndexer.getDocProps()
    }

    const hasDocProps = docPropSections.length || Object.keys(docProps).length

    if (hasDocProps) {
      this._pageDocProps[defaultSection.pathname] = docProps

      if (shouldValidateLinks) {
        const ids = new Set<string>()
        for (const section of docPropSections) {
          if (section.heading?.id) {
            ids.add(section.heading.id)
          }
        }
        if (ids.size) {
          this._docPropIds[defaultSection.pathname] = ids
        }
      }
    }

    if (!cached) {
      this.mdxFileReader.updateCache(filePath, fileContents, {
        anchorIds,
        collectedLinks,
        frontmatter,
        page: indexedPage,
        pageDocProps: docProps,
        pageDocPropSections: docPropSections,
        pageTitleIssues,
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

  private compileTsxFile(route: PageRoute) {
    const entry = this.getPageEntry(route, {})

    const routeMeta = this.getTsxRouteMeta(entry.pathSegments)

    if (!routeMeta) {
      return null
    }

    if (!entry.hidden) {
      this.navBuilder.add(entry, {}, routeMeta)
    }

    this._pageMap[entry.pathname] = entry

    return entry
  }

  private getPageRoute(filePath: string): PageRoute {
    return {
      filePath,
      pathSegments: getPathSegmentsFromFileName(
        filePath.replace(this.config.srcDir, ""),
        this.config.pageDirectory,
        this.config.routingStrategy,
      ),
    }
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

    const mdxRoutes = filterFileGlob(
      fileGlob,
      "mdx",
      this.config.srcDir,
      this.config.routingStrategy,
    ).map((file) => this.getPageRoute(file))

    const allTsxRoutes = filterFileGlob(
      fileGlob,
      "tsx",
      this.config.srcDir,
      this.config.routingStrategy,
    ).map((file) => this.getPageRoute(file))
    const tsxRoutes = allTsxRoutes.filter(({pathSegments}) =>
      this.getTsxRouteMeta(pathSegments),
    )

    const parentPathnames = new Set<string>()
    for (const {pathSegments} of [...mdxRoutes, ...tsxRoutes]) {
      // Start at one segment to preserve the root home page.
      for (let depth = 1; depth < pathSegments.length; depth++) {
        parentPathnames.add(
          getPathnameFromPathSegments(pathSegments.slice(0, depth)),
        )
      }
    }

    const isParentRoute = ({pathSegments}: PageRoute) =>
      parentPathnames.has(getPathnameFromPathSegments(pathSegments))

    const mdxPageRoutes = mdxRoutes.filter((route) => {
      if (isParentRoute(route)) {
        this._ignoredMdxFiles.add(route.filePath)
        return false
      }
      return true
    })

    this._mdxFileCount = mdxPageRoutes.length
    if (
      !this.mdxFileReader.enabled ||
      this.mdxFileReader.gitMetadataMap.size === 0
    ) {
      this.mdxFileReader.gitMetadataMap = buildGitMetadataMap(
        this.config.srcDir,
        this.mdxFileReader.pageTimestampMetadata,
      )
    }

    const compiledFiles = mdxPageRoutes.map((route) =>
      this.compileMdxFile(route),
    )

    const mdxIndex = compiledFiles
      .map((fileData) => fileData.pageSections)
      .flat()

    for (const route of tsxRoutes) {
      if (!isParentRoute(route)) {
        this.compileTsxFile(route)
      }
    }

    if (!this.config.disableLegacySearchIndex) {
      this._searchIndex.push(
        ...mdxIndex.filter((entry) => !entry.hideFromSearch),
      )
    }

    this.navBuilder.build()

    if (this.lint.brokenLinks !== "off") {
      const invalidLinks = validateLinks(
        this._collectedLinks,
        this._pageMap,
        this._docPropIds,
        this._anchorIds,
        this.publicDir,
      )
      this._invalidLinkCount = invalidLinks.length
      reportInvalidLinks(invalidLinks, this.lint.brokenLinks)
    }

    if (this.lint.fileLinks !== "off") {
      const sharedSourceFiles = new Set(
        Object.values(this._pageFiles).filter(
          (file) => !isInRoutesDir(file, this.fileLinkOptions.routesDir),
        ),
      )
      const fileLinkIssues = findNonFileLinks(
        this._collectedLinks.filter(
          (link) => !sharedSourceFiles.has(link.sourceFile),
        ),
        this._pageFiles,
      )
      this._fileLinkIssueCount = fileLinkIssues.length
      reportFileLinkIssues(fileLinkIssues, this.lint.fileLinks)
    }

    if (this.lint.pageTitle !== "off") {
      reportPageTitleIssues(this._pageTitleIssues, this.lint.pageTitle)
    }

    if (this.lint.configs !== "off") {
      const configIssues: ConfigIssues = {
        // .tsx pages without a nav entry still exist, so every route file counts.
        navRoutes: validateNavRoutes(
          this.listedNavRoutes,
          collectRouteKeys([...mdxRoutes, ...allTsxRoutes]),
        ),
        unrecognizedKeys: this.config.unrecognizedConfigKeys,
      }
      this._configIssueCount = countConfigIssues(configIssues)
      reportConfigIssues(configIssues, this.lint.configs)
    }

    return compiledFiles
  }
}
