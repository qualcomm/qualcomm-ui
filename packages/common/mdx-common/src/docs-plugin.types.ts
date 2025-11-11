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
   * The section content of the indexed section with a bit more metadata.
   */
  contentSections?: PageSectionContent[]

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
 *
 * @public
 */
export type PageMap = Record<string, PageSection>

export interface NavItem {
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

export interface SiteData {
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
