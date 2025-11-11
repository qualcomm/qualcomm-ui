// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RouteMetaEntryInternal, RouteMetaInternal} from "../../../types"

/**
 * Retrieves the route metadata for a given path based on its path segments.
 */
export function getRouteMeta(
  pathSegments: string[],
  metaJson: RouteMetaInternal,
): RouteMetaEntryInternal | undefined | null {
  const routeMeta = metaJson[pathSegments[0]]
  if (!routeMeta) {
    // backup, fetch using id if provided
    return undefined
  }

  if (pathSegments.length === 1) {
    return routeMeta
  }

  return pathSegments
    .slice(1)
    .reduce((acc: RouteMetaEntryInternal | undefined | null, segment) => {
      return acc?.children?.[segment]
    }, routeMeta)
}
