// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {capitalCase} from "change-case"
import {sortBy} from "lodash-es"
import {v4 as uuidv4} from "uuid"

import type {
  NavItem,
  PageFrontmatter,
  PageSection,
} from "@qualcomm-ui/mdx-common"

import type {
  NavMeta,
  RouteMetaEntryInternal,
  RouteMetaInternal,
} from "../../../types"
import {defined} from "../../utils"

import {getRouteMeta} from "./get-route-meta"

interface InitialRoute {
  pageFrontmatter: Partial<PageFrontmatter>
  pageSection: PageSection
  routeMeta?: RouteMetaEntryInternal
}

/**
 * Given a flat remix route structure, computes nested navigation items for the QUI
 * side nav.
 */
export class NavBuilder {
  private initialRoutes: InitialRoute[] = []
  private flatNavItems: NavItem[] = []

  get navItems(): NavItem[] {
    return this._navItems
  }
  private _navItems: NavItem[] = []

  private readonly metaJson: RouteMetaInternal
  private readonly navMeta: Record<number, NavMeta>

  constructor(metaJson: RouteMetaInternal, navMeta: Record<number, NavMeta>) {
    this.navMeta = navMeta
    this.metaJson = metaJson
  }

  add(
    pageSection: PageSection,
    pageFrontmatter: Partial<PageFrontmatter>,
    routeMeta?: RouteMetaEntryInternal,
  ): void {
    this.initialRoutes.push({pageFrontmatter, pageSection, routeMeta})
  }

  reset(): void {
    this.initialRoutes = []
    this.flatNavItems = []
    this._navItems = []
  }

  /**
   * Sorts nav items. Nav items with an order defined take precedence over nav items
   * without an order. Nav items with the same order are sorted alphabetically by
   * title.
   */
  private navItemSort(a: NavItem, b: NavItem, groupOrder?: string[]) {
    if (a.depth !== b.depth) {
      return a.depth - b.depth
    }

    if (a.order && !b.order) {
      return -1
    }
    if (!a.order && b.order) {
      return 1
    } else if (a.order && b.order && a.order !== b.order) {
      return a.order - b.order
    }

    if (groupOrder && a.group && b.group) {
      const aIndex = a.group ? groupOrder.indexOf(a.group) : -1
      const bIndex = b.group ? groupOrder.indexOf(b.group) : -1

      if (aIndex === bIndex) {
        // continue
      } else if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      } else if (aIndex !== -1) {
        return -1
      } else if (bIndex !== -1) {
        return 1
      }
    }

    // group items with the same group
    if (a.group !== b.group) {
      if (!a.group && b.group) {
        return -1
      }
      if (a.group && !b.group) {
        return 1
      }
      if (a.group && b.group) {
        return a.group.localeCompare(b.group)
      }
    }

    return a.title.localeCompare(b.title)
  }

  resolveSideNavTitle(
    frontmatter: Partial<PageFrontmatter>,
    routeMeta: Partial<RouteMetaEntryInternal>,
    fallback: string,
  ): string {
    return (
      (defined(routeMeta.sideNavTitle)
        ? routeMeta.sideNavTitle || ""
        : frontmatter.sideNavTitle || "") || fallback
    )
  }

  /**
   * Builds a flat list of nav items from the MDX pages and _meta.json. If a page
   * does not exist, it is not added to the side nav (even if it has an entry in
   * _meta.json).
   */
  private buildNavItem({
    pageFrontmatter,
    pageSection: {pathname, pathSegments, title},
    routeMeta: routeMetaParam,
  }: InitialRoute) {
    const id = pageFrontmatter?.id || ""

    // handle home page (this route does not have path segments)
    if (!pathSegments.length && pathname === "/") {
      const routeMeta =
        routeMetaParam || getRouteMeta(id ? [id] : [], this.metaJson)
      if (!routeMeta) {
        return
      }

      this.flatNavItems.push({
        depth: 1,
        expanded: routeMeta?.expanded || false,
        id: `/`,
        order: routeMeta?.order,
        pathname,
        pathSegments: [],
        title: this.resolveSideNavTitle(
          pageFrontmatter,
          routeMeta,
          routeMeta?.title || title,
        ),
      })
    }

    pathSegments.forEach((segment, index) => {
      const depth = index + 1

      // we only add an item if it doesn't already exist, which we determine by
      // comparing the path segments iteratively.
      const navItem = this.flatNavItems.find((item) =>
        pathSegments
          .slice(0, depth)
          .every((value, i) => value === item.pathSegments[i]),
      )

      if (!navItem) {
        const isPage = index === pathSegments.length - 1
        const adjustedSegments = pathSegments.slice(0, depth)

        const routeMeta =
          getRouteMeta(
            isPage ? pathSegments : adjustedSegments,
            this.metaJson,
          ) ?? {}

        this.flatNavItems.push({
          depth,
          expanded: routeMeta?.expanded || false,
          group: isPage
            ? routeMeta.group || pageFrontmatter.group
            : routeMeta.group,
          id: `/${adjustedSegments.join("/")}`,
          items: [],
          order: routeMeta?.order,
          pathname: isPage ? pathname : undefined,
          pathSegments: adjustedSegments,
          title: this.resolveSideNavTitle(
            pageFrontmatter,
            routeMeta,
            routeMeta?.title
              ? routeMeta.title
              : isPage
                ? title
                : capitalCase(segment),
          ),
        })
      }
    })
  }

  /**
   * Iterates through a nav item's path segments and ensures that all of its parent
   * elements exist in the recursive structure.
   */
  private ensureParent(navItem: NavItem) {
    const segments = navItem.pathSegments
    let items: NavItem[] = this.navItems
    let item: NavItem | undefined
    let prevItem: NavItem | undefined = undefined

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i]
      item = items?.find((entry) => entry.pathSegments[i] === segment)
      if (item) {
        // point to the found item's children and keep iterating
        items = item.items ?? []
        prevItem = item
        continue
      }
      if (prevItem) {
        const pathSegments = segments.slice(0, i + 1)
        const routeMeta = getRouteMeta(pathSegments, this.metaJson)

        items = []
        const base = {
          depth: pathSegments.length,
          id: `/routes/${pathSegments.join("/")}`,
          items,
          pathSegments,
          title: segment,
        }
        const newItem = routeMeta
          ? {
              ...base,
              expanded: routeMeta.expanded,
              order: routeMeta.order,
              restricted: routeMeta.restricted,
              title: routeMeta.title ?? segment,
            }
          : base
        prevItem.items = prevItem.items
          ? [...prevItem.items, newItem]
          : [newItem]
      }
      prevItem = item
    }
  }

  /**
   * Deeply inserts a nav item into the array, iterating through parent routes
   * (based on the pathSegments) and adding them if they don't exist.
   *
   * For example, given a leaf node 4 path segments deep, this function will create
   * all parent nav items as nested children of the top-most nav item.
   */
  private nestedInsert(
    item: NavItem,
    pathSegments: string[],
    items: NavItem[],
  ) {
    const segment = pathSegments[0]
    const parentItem = items.find(
      (parent) =>
        parent.pathSegments[parent.pathSegments.length - 1] === segment,
    )
    if (parentItem) {
      this.nestedInsert(item, pathSegments.slice(1), parentItem.items ?? [])
    } else if (pathSegments.length === 1) {
      items.push(item)
    }
  }

  private buildNestedNavItems() {
    for (let i = 0; i < this.flatNavItems.length; i++) {
      const navItem = this.flatNavItems[i]
      if (navItem.depth === 1) {
        this.navItems.push(navItem)
        continue
      }

      this.ensureParent(navItem)
      this.nestedInsert(navItem, navItem.pathSegments, this.navItems)
    }
  }

  private sortNestedNavItems(items: NavItem[], groupOrder?: string[]) {
    items.sort((a, b) => this.navItemSort(a, b, groupOrder))
    items.forEach((item) => {
      if (item.items?.length) {
        const meta = getRouteMeta(item.pathSegments, this.metaJson)
        this.sortNestedNavItems(item.items, meta?.groupOrder)
      }
    })
  }

  /**
   * To be called after every mdx page route has been added through the {@link add}
   * function.
   */
  build(): NavItem[] {
    // We need to process parent items first, so we sort by path segment. Routes
    // with shorter path segments will be processed first.
    sortBy(
      this.initialRoutes,
      (item) => item.pageSection.pathSegments.length,
    ).map((r) => this.buildNavItem(r))

    this.buildNestedNavItems()

    const rootMeta = getRouteMeta([], this.metaJson)
    this.sortNestedNavItems(this.navItems, rootMeta?.groupOrder)

    if (this.navMeta) {
      Object.entries(this.navMeta).forEach(([index, value]) => {
        this._navItems.splice(parseInt(index), 0, {
          depth: 1,
          id: uuidv4(),
          pathSegments: [],
          sectionTitle: value.sectionTitle,
          separator: value.separator,
          title: "",
        })
      })
    }

    this._navItems = this.groupNavItems(this.navItems)
    this._navItems = this.buildSearchMeta(this.navItems, [])
    return this.navItems
  }

  private groupNavItems(items: NavItem[]): NavItem[] {
    const result: NavItem[] = []
    const seenGroups = new Set<string>()

    for (const item of items) {
      if (item.group && !seenGroups.has(item.group)) {
        seenGroups.add(item.group)
        result.push({
          depth: item.depth,
          group: item.group,
          id: uuidv4(),
          pathSegments: [],
          sectionTitle: item.group,
          title: "",
        })
      }

      result.push({
        ...item,
        items: item.items ? this.groupNavItems(item.items) : undefined,
      })
    }

    return result
  }

  /**
   * Walks over the tree and builds search metadata using the nearest sectionTitle.
   */
  private buildSearchMeta(items: NavItem[], meta: string[]): NavItem[] {
    let sectionTitle = ""
    const results: NavItem[] = []

    for (const ogItem of items) {
      const item = {...ogItem}

      if (item.sectionTitle) {
        sectionTitle = item.sectionTitle
      } else if (item.separator) {
        sectionTitle = ""
      }

      if (!item.separator) {
        const currentMeta = sectionTitle ? [...meta, sectionTitle] : [...meta]
        const nextMeta = [...(item.searchMeta || []), ...currentMeta]
        if (nextMeta.length) {
          item.searchMeta = [...nextMeta]
        }

        if (item.items) {
          item.items = this.buildSearchMeta(item.items, currentMeta)
        }
      }

      results.push(item)
    }

    return results
  }
}
