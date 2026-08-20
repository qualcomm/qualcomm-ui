// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QuiPropDeclaration,
  QuiPropTypes,
} from "@qualcomm-ui/typedoc-common"

export interface PageHeading {
  /**
   * h1 is 1, h2 is 2, etc...
   */
  headingLevel: number

  /**
   * Automatically generated, unique ID. Used to generate anchor links.
   */
  id: string

  /**
   * Heading HTML tag.
   */
  tagName: string

  /**
   * The text content of the heading.
   */
  textContent: string
}

/**
 * Page data, defined in each MDX file's {@link https://mdxjs.com/guides/frontmatter/ frontmatter} section.
 *
 * @docLink /api/page-frontmatter
 *
 * @public
 */
export interface PageFrontmatter {
  /**
   * Override the categories used to render the breadcrumb labels. Note that this
   * will only match up to the length of the route's path segments. If a route only
   * has 1 path segment, and you supply 2 categories, only the first category will be
   * accounted for.
   */
  categories?: string[]

  /**
   * Page description
   */
  description?: string

  /**
   * Used for grouping pages at the same level under a common section heading.
   */
  group?: string

  /**
   * If true, this route will not be shown in the side navigation or adjacent
   * routes' page links.
   */
  hidden?: boolean

  /**
   * If true, the breadcrumbs will not render on this route.
   */
  hideBreadcrumbs?: boolean

  /**
   * If true, this page's contents will not be added to the search index.
   */
  hideFromSearch?: boolean

  /**
   * If true, the page links will be hidden on this route.
   */
  hidePageLinks?: boolean

  /**
   * If true, the side navigation will be hidden on this route.
   */
  hideSideNav?: boolean

  /**
   * If true, the table of contents be hidden on this route.
   */
  hideToc?: boolean

  /**
   * Optional id. Used to associate the page with its entry in the _meta.json.
   */
  id?: string

  /**
   * If `true`, the route will be flagged as restricted. This flag does nothing
   * internally. You will need to handle this in your application.
   */
  restricted?: boolean

  /**
   * Title for the page in the side nav. Takes precedence over {@link title}.
   */
  sideNavTitle?: string

  /**
   * The title of the page.
   */
  title: string

  /**
   * Full name of the person who last updated the page, derived from git commit
   * history.
   */
  updatedBy?: string

  /**
   * ISO 8601 timestamp of when the page was last updated, derived from git
   * commit history.
   */
  updatedOn?: string
}

export interface PageSectionContent {
  /**
   * The tagName of the HTML section.
   */
  tagName: string

  /**
   * The text paragraphs of the indexed section.
   */
  text: string[]
}

/**
 * The data structure of each linkable entity in the search index.
 *
 * @public
 */
export interface PageSection extends PageFrontmatter {
  /**
   * The `Capital Case` transformed path segments.
   */
  categories: string[]

  /**
   * The text content of the indexed section.
   */
  content?: string

  /**
   * The section content of the indexed section with the wrapping element tags.
   */
  contentSections?: PageSectionContent[]

  /**
   * Raw frontmatter for this page. Can be used to retrieve fields that aren't
   * documented.
   */
  data: Record<string, unknown>

  /**
   * Text content of the {@link content}'s closest heading.
   */
  heading?: string

  /**
   * Depth of the {@link content}'s closest heading.
   */
  headingLevel?: number

  /**
   * The href to the page content with a # pointing to the nearest anchor tag.
   */
  href?: string

  /**
   * The id of the page, typically the shortened filepath.
   */
  id: string

  /**
   * For use with the experimental TypeDoc integration. If true, this content is
   * part of a prop table.
   */
  isDocProp?: boolean

  /**
   * The href to the page.
   */
  pathname: string

  /**
   * The route path segments separated by `/`.
   */
  pathSegments: string[]

  /**
   * Page table of contents.
   */
  toc?: PageHeading[]
}

/**
 * The PageMap is a record of the available routes in the application. Each key is
 * the route's pathname.
 */
export type PageMap = Record<string, PageSection>

export interface NavItem {
  /**
   * Badges rendered in the sideNav
   *
   * @since 2.2.0
   */
  badges?: NavBadge[] | undefined

  /**
   * The depth of the nav item. The root nav item starts at 1. Each child has n+1
   * depth, where n is the depth of the parent item.
   */
  depth: number

  /**
   * If `true`, the side nav item will be expanded on initial load. Does nothing if
   * the entry is a page.
   */
  expanded?: boolean

  /**
   * Used for grouping pages at the same level under a common section heading.
   */
  group?: string

  /**
   * Path segment.
   */
  id: string

  items?: NavItem[]

  /**
   * The order of the item relative to other items at the same depth. If an item's
   * order is not defined, it is unordered. Unordered items appear after ordered
   * items. Unordered items are sorted alphabetically.
   */
  order?: number

  /**
   * Pathname, only applicable to pages (not folders).
   */
  pathname?: string

  /**
   * The route path segments.
   */
  pathSegments: string[]

  /**
   * Additional metadata to be used for filtering the nav tree.
   */
  searchMeta?: string[]

  /**
   * A label that renders above the item's content.
   */
  sectionTitle?: string

  /**
   * Whether to render this item as a separator. If this property is supplied, a
   * horizontal separator will be drawn and all content will be ignored.
   */
  separator?: boolean

  /**
   * The title of the nav item, obtained from the _meta.json or the page's
   * frontmatter.
   */
  title: string
}

export type TocHeading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export type PagePropType = QuiPropDeclaration & {id: string}

export type PagePropTypes = QuiPropTypes & {
  input?: PagePropType[] | undefined
  output?: PagePropType[] | undefined
  props?: PagePropType[] | undefined
  publicMethods?: PagePropType[] | undefined
}

export type PageDocProps = Record<string, PagePropTypes>

export interface KnowledgePageData {
  demosFolder?: string

  /**
   * Absolute path to the file on disk
   */
  filePath: string

  /**
   * Unique identifier for this page, generated from the file's path relative to the
   * docs site's routes folder.
   */
  id: string

  mdxFile: string

  name: string

  /**
   * Relative path to the page from the root of the site
   *
   * @example `/components/button`
   */
  pathname: string

  /**
   * Full link to the page
   */
  url: string | undefined
}

export interface SiteDataExports {
  /**
   * Base URL path for exported knowledge files.
   */
  dir: string

  /**
   * Whether knowledge exports are enabled.
   */
  enabled: boolean

  /**
   * List of pathnames that have knowledge exports available.
   */
  pathnames: string[]
}

export interface SiteData {
  /**
   * Markdown export configuration and available pages.
   */
  exports?: SiteDataExports

  /**
   * Nav items, typically used for the site's side navigation.
   *
   * @inheritDoc
   */
  navItems: NavItem[]

  /**
   * If QUI DocProps are detected on a page, they will be added to this array. The
   * key is the route's pathname.
   *
   * @inheritDoc
   */
  pageDocProps?: PageDocProps

  /**
   * The available routes in the application. Each key is
   * the route's pathname.
   *
   * @inheritDoc
   */
  pageMap: PageMap

  /**
   * A compiled array of page content, separated by each heading's individual
   * segments of text content.
   */
  searchIndex: PageSection[]
}

export interface SimplifiedProp {
  defaultValue?: string
  description: string
  name: string
  propType?: "input" | "output" | undefined
  required: boolean | undefined
  since?: string
  type: string
}

/**
 * A code example extracted from a section.
 */
export interface CodeExample {
  /**
   * The code content.
   */
  code: string

  /**
   * Programming language from fence info string.
   */
  language: string
}

export interface SectionTypes {
  /**
   * Props extracted from the TypeDoc code block.
   */
  props: SimplifiedProp[]

  /**
   * Version that the type was added in.
   */
  since?: string

  /**
   * Name of the type, interface, or class.
   */
  type: string
}

/**
 * A single section entry extracted from documentation.
 */
export interface SectionEntry {
  /**
   * Code examples extracted from this section.
   */
  codeExamples?: CodeExample[]

  /**
   * Prose content with code blocks removed. Used for formatted output.
   */
  content: string

  /**
   * Markdown-free prose used to build semantic search embeddings.
   */
  searchText: string

  /**
   * Hash of this section's contents. Includes {@link codeExamples}, {@link
   * metadata}, {@link headerPath}, {@link pathname}, {@link rawContent}, and
   * {@link searchText}.
   */
  hash: string

  /**
   * Breadcrumb path of headers leading to this section.
   * @example ["Button", "Examples", "Variants"]
   */
  headerPath: string[]

  /**
   * Depth of this section's heading (1-6). Matches the heading that starts
   * this section (e.g. an h2 section has headingLevel 2).
   */
  headingLevel: number

  /**
   * Frontmatter from the source page.
   */
  pageFrontmatter?: Record<string, unknown>

  /**
   * Source page identifier.
   */
  pageId: string

  /**
   * Local route pathname when this section has a navigable page.
   */
  pathname?: string

  /**
   * Raw markdown content from the AST, including code blocks.
   */
  rawContent: string

  /**
   * Generated section ID for anchor links.
   * @example "button-examples-variants"
   */
  sectionId: string

  /**
   * Hash of the section URL, used to link to the section.
   */
  sectionUrlHash?: string | undefined

  /**
   * Search terms extracted from ::: terms ::: blocks within this section.
   */
  terms?: string[]

  /**
   * Name of the types or interfaces described by typeDocProps in this section.
   */
  types?: SectionTypes[]

  /**
   * URL with anchor to this specific section.
   */
  url?: string
}

/**
 * Output structure for the sections.json export.
 */
export interface KnowledgeSections {
  generatedAt: string
  hash: string
  /** @inheritDoc */
  sections: SectionEntry[]
  totalSections: number
  version: 1
}

/**
 * A single page entry containing the full raw markdown content.
 */
export interface PageEntry {
  /**
   * Full raw markdown content of the page.
   */
  content: string

  /**
   * MD5 hash for change detection.
   */
  hash: string

  /**
   * Source page identifier.
   */
  pageId: string

  /**
   * Route pathname.
   * @example "/components/button"
   */
  pathname: string

  /**
   * Page title.
   */
  title: string
}

/**
 * Output structure for the pages.json export.
 */
export interface KnowledgePages {
  generatedAt: string
  hash: string
  /** @inheritDoc */
  pages: PageEntry[]
  totalPages: number
  version: 1
}

/**
 * @since 2.2.0
 */
export interface NavBadge {
  /**
   * If true, this badge won't be displayed in the side nav.
   */
  hideFromNav?: boolean

  /**
   * Unique key for the badge.
   */
  id: string

  /**
   * Text rendered inside the badge.
   */
  label: string

  /**
   * Optional label override for the side nav. Set to false to prevent the badge from
   * appearing in the side nav. When not defined, the side nav will render the
   * {@link label}.
   *
   * @since 2.4.0
   */
  sideNavLabel?: string | false

  /**
   * Optional HTML title attribute to show on hover.
   */
  title?: string

  /**
   * Optional URL that the badge links to. To link to a local path, start the pathname with `/`. To link to an external URL, start the url with `https://`
   *
   * @example
   * ```js
   * // local path
   * /guides/developer-preview
   *
   * // external
   * https://github.com/qualcomm/qualcomm-ui
   * ```
   */
  url?: string
}
