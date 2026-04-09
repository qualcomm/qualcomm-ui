// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsBreadcrumbsItemSegments} from "./breadcrumbs.types"

export function getItemSegments<T>(
  items: T[],
  maxItems: number | undefined,
  startItems: number,
  endItems: number,
): QdsBreadcrumbsItemSegments<T> {
  if (
    maxItems === undefined ||
    items.length <= maxItems ||
    startItems + endItems >= items.length
  ) {
    return {after: items, before: [], collapsed: []}
  }

  const end = items.length - endItems

  return {
    after: items.slice(end),
    before: items.slice(0, startItems),
    collapsed: items.slice(startItems, end),
  }
}
