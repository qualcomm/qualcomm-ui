// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getRouteKey} from "./get-route-meta.js"
import type {NavConfig, NavMeta, RouteMeta, RouteMetaInternal} from "./types.js"

/**
 * @param unorderedRoutes route keys that have an entry but no position in their
 * parent's nav config, like a folder with a `_nav.json` that its parent doesn't
 * list. These are sorted like routes without an entry.
 */
export function transformRouteMetaArray(
  meta: NavConfig[],
  routeMetaNav: Record<string, NavMeta>,
  unorderedRoutes?: ReadonlySet<string>,
  parentSegments: string[] = [],
): RouteMetaInternal {
  let ignoringOrder = 0
  return meta.reduce((acc: RouteMetaInternal, item, index) => {
    // strip the nav meta and populate a separate record. This will be used for
    // lookup while building the nav items.
    if (!("id" in item)) {
      if ("separator" in item || "sectionTitle" in item) {
        // offset the navMeta index by the number of items that will be sorted to
        // the back of the nav order.
        routeMetaNav[index - ignoringOrder] = item
      }
      return acc
    }
    const current = item as RouteMeta
    const segments = [...parentSegments, current.id]
    const ignoreOrder =
      current.ignoreRouteMetaOrder ||
      unorderedRoutes?.has(getRouteKey(segments))
    if (ignoreOrder || current.hidden) {
      // items with ignored order are always sorted to the back of the nav order. We
      // need to account for this when splicing in the navMeta entries.
      ignoringOrder++
    }
    acc[current.id] = {
      children: current.children
        ? transformRouteMetaArray(
            current.children,
            routeMetaNav,
            unorderedRoutes,
            segments,
          )
        : undefined,
      expanded: current.expanded,
      flattenChildren: current.flattenChildren,
      group: current.group,
      groupOrder: current.groupOrder,
      hidden: current.hidden,
      hideBreadcrumbs: current.hideBreadcrumbs,
      hideFromSearch: current.hideFromSearch,
      hidePageLinks: current.hidePageLinks,
      hideSideNav: current.hideSideNav,
      hideToc: current.hideToc,
      order: ignoreOrder ? undefined : index + 1,
      restricted: current.restricted,
      sideNavTitle: current.sideNavTitle,
      title: current.title,
    }
    return acc
  }, {})
}
