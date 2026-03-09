// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"

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
