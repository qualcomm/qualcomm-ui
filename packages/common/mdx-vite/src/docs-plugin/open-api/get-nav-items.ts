// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {NavItem} from "@qualcomm-ui/mdx-common"

import {
  getOperationTitle,
  type OpenApiOperation,
  type TagObject,
} from "./get-operations.js"

interface ApiIntroPage {
  pathname: string
  title: string
}

interface OpenApiNavOptions {
  /**
   * Whether tag sections start expanded.
   */
  expanded?: boolean
}

function getTagTitle(name: string, tags: TagObject[]): string {
  const tag = tags.find((tag) => tag.name === name)
  return tag?.["x-displayName"] ?? tag?.summary ?? name
}

function toNavItem(
  intro: ApiIntroPage,
  operation: OpenApiOperation,
  idPrefix: string,
  depth: number,
): NavItem {
  const pathname = `${intro.pathname}/${operation.slug}`
  return {
    depth,
    id: `${idPrefix}${operation.slug}`,
    method: operation.method,
    pathname,
    pathSegments: pathname.split("/").filter(Boolean),
    title: getOperationTitle(operation),
  }
}

/**
 * Builds the sidebar of an API: the intro page, untagged operations, then one
 * collapsible section per tag. Declared tags come first, in spec order. An
 * operation with several tags is listed under each one.
 */
export function getOpenApiNavItems(
  intro: ApiIntroPage,
  operations: OpenApiOperation[],
  tags: TagObject[] = [],
  {expanded = false}: OpenApiNavOptions = {},
): NavItem[] {
  const tagNames = [
    ...new Set([
      ...tags.map((tag) => tag.name),
      ...operations.flatMap((operation) => operation.tags),
    ]),
  ]

  const items: NavItem[] = [
    {
      depth: 1,
      id: intro.pathname,
      pathname: intro.pathname,
      pathSegments: intro.pathname.split("/").filter(Boolean),
      title: intro.title,
    },
    ...operations
      .filter((operation) => !operation.tags.length)
      .map((operation) => toNavItem(intro, operation, "", 1)),
  ]

  for (const name of tagNames) {
    const tagged = operations.filter((operation) =>
      operation.tags.includes(name),
    )
    if (!tagged.length) {
      continue
    }
    const title = getTagTitle(name, tags)
    items.push({
      depth: 1,
      expanded,
      id: `tag:${name}`,
      // Tag-prefixed ids keep multi-tag operations unique in the tree. `group`
      // lets the sidebar filter match an operation by its tag's title.
      items: tagged.map((operation) => ({
        ...toNavItem(intro, operation, `${name}/`, 2),
        group: title,
      })),
      pathSegments: [],
      title,
    })
  }

  return items
}
