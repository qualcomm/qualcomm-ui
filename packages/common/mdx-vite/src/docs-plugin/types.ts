// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  PageFrontmatter,
  QuiPropTypes,
  TocHeading,
} from "@qualcomm-ui/mdx-docs-common"

export type RoutingStrategy =
  | "vite-generouted"
  | ((filePath: string) => string[])

/**
 * Side nav item data.
 */
export interface NavMeta {
  id?: never

  /**
   * A label that describes a group of nav items.
   */
  sectionTitle?: string

  /**
   * Render a horizontal separator.
   */
  separator?: boolean
}

export interface RouteMetaEntryInternal
  extends Pick<
    PageFrontmatter,
    | "group"
    | "hideToc"
    | "hideSideNav"
    | "hideFromSearch"
    | "hideBreadcrumbs"
    | "hidePageLinks"
    | "hidden"
    | "sideNavTitle"
  > {
  /**
   * Nested routes.
   */
  children?: RouteMetaInternal

  /**
   * If `true`, the side nav item will be expanded on initial load. Does nothing if
   * the entry is a leaf node.
   */
  expanded?: boolean

  /**
   * Order for the groups within this item's hierarchy.
   */
  groupOrder?: string[]

  /**
   * If specified, the route will be sorted amongst adjacent routes in this order.
   * Adjacent routes are routes at the same depth that share a parent.
   */
  order?: number

  /**
   * If `true`, the route will be flagged as restricted. This flag does nothing
   * internally. You will need to handle this in your application.
   */
  restricted?: boolean

  /**
   * This property is only available for top-level items.
   */
  sectionTitle?: never

  /**
   * This property is only available for top-level items.
   */
  separator?: never

  /**
   * The title of the item in the side nav. Will be parsed from the page's
   * frontmatter if it is not defined in the RouteMeta.
   */
  title?: string
}

export interface RouteMetaNavInternal {
  /**
   * A label that renders above the item's content.
   */
  sectionTitle?: string

  /**
   * Whether to render this item as a separator. If this property is supplied, a
   * horizontal separator will be drawn and all content will be ignored.
   */
  separator?: boolean
}

export type RouteMetaInternal = Record<string, RouteMetaEntryInternal>

export type NavConfig = RouteMeta | NavMeta

export interface RouteMeta
  extends Omit<RouteMetaEntryInternal, "children" | "order"> {
  /**
   * Nested routes.
   *
   * @inheritDoc
   */
  children?: RouteMeta[]

  /**
   * The path segment for this route.
   */
  id: string

  /**
   * By default, pages with a RouteMeta are ordered before pages that are not
   * defined. Set this property to `true` to disable that behavior.
   *
   * @default false
   */
  ignoreRouteMetaOrder?: boolean
}

export interface QuiDocsTypeDocOptions {
  /**
   * Whether to include each page's TypeDocProps property documentation in the
   * search index. If this is true, the property documentation for each occurrence
   * of `<TypeDocProps />` will be built into the search index.
   */
  includeInSearchIndex?: boolean | undefined
}

export interface SearchIndexerOptions {
  /**
   * Disable the file cache. This cache stores the result of parsed MDX files based
   * on each file's md5 checksum. On subsequent edits, values are retrieved from the
   * cache and parsing is avoided for files that have not changed.
   */
  disableCache?: boolean

  /**
   * ToC headings.
   *
   * @default ['h2','h3','h4']
   */
  headings?: TocHeading[]

  /**
   * Optional property for defining nav item hierarchy and page metadata.
   *
   * @inheritDoc
   */
  navConfig?: NavConfig[]

  /**
   * Name of the directory where the MDX pages are located. NOT the full path to the
   * directory.
   */
  pageDirectory: string

  /**
   * Strategy to use for building each route's path segments.  Omit this property if
   * you are using the default {@link https://github.com/kiliman/remix-flat-routes
   * remix-flat-routes} configuration.
   */
  routingStrategy?: RoutingStrategy

  /**
   * Resolved path to the React Router app directory.
   */
  srcDir: string

  /**
   * Resolved QUI TypeDoc props.
   */
  typeDocProps?: Record<string, QuiPropTypes>

  /**
   * Options for TypeDoc property documentation.
   */
  typeDocPropsOptions?: QuiDocsTypeDocOptions
}

export interface QuiDocsConfig
  extends Omit<
    SearchIndexerOptions,
    "srcDir" | "pageDirectory" | "typeDocProps"
  > {
  /**
   * Root app directory. NOT the full path to the directory.
   *
   * @example 'src'
   *
   * @default 'app'
   */
  appDirectory?: string

  /**
   * Matched files will not trigger a rebuild on hot update.
   */
  hotUpdateIgnore?: RegExp

  /**
   * Name of the directory where the MDX pages are located. NOT the full path to the
   * directory. This is relative to the {@link appDirectory}.
   *
   * @default 'routes'
   */
  pageDirectory?: string

  /**
   * Relative path to the typeDocProps json file. If the `<TypeDocProps />`
   * component is used in an mdx page, the data for its referenced entity will be
   * made available for property documentation rendering.
   *
   * Refer to the {@link https://docs.qui.qualcomm.com/guide/typedoc QUI typedoc guide} to learn more.
   */
  typeDocProps?: string

  /**
   * Options for TypeDoc property documentation.
   */
  typeDocPropsOptions?: QuiDocsTypeDocOptions
}
