// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {NavItem} from "@qualcomm-ui/mdx-common"

import type {OpenApiOperation, TagObject} from "./get-operations.js"

interface ApiIntroPage {
  pathname: string
  title: string
}

function getTagTitle(name: string, tags: TagObject[]): string {
  const tag = tags.find((tag) => tag.name === name)
  return tag?.["x-displayName"] ?? tag?.summary ?? name
}

function toNavItem(
  intro: ApiIntroPage,
  operation: OpenApiOperation,
  idPrefix: string,
): NavItem {
  const pathname = `${intro.pathname}/${operation.slug}`
  return {
    badges: [{id: operation.method, label: operation.method.toUpperCase()}],
    depth: 1,
    id: `${idPrefix}${operation.slug}`,
    method: operation.method,
    pathname,
    pathSegments: pathname.split("/").filter(Boolean),
    title:
      operation.summary ??
      `${operation.method.toUpperCase()} ${operation.path}`,
  }
}

/**
 * Builds the sidebar of an API: the intro page, untagged operations, then one
 * section per tag. Declared tags come first, in spec order. An operation with
 * several tags is listed under each one.
 */
export function getOpenApiNavItems(
  intro: ApiIntroPage,
  operations: OpenApiOperation[],
  tags: TagObject[] = [],
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
      .map((operation) => toNavItem(intro, operation, "")),
  ]

  for (const name of tagNames) {
    const tagged = operations.filter((operation) =>
      operation.tags.includes(name),
    )
    if (!tagged.length) {
      continue
    }
    const sectionTitle = getTagTitle(name, tags)
    items.push({
      depth: 1,
      group: sectionTitle,
      id: `tag:${name}`,
      pathSegments: [],
      sectionTitle,
      title: "",
    })
    // Tag-prefixed ids keep multi-tag operations unique in the tree.
    items.push(
      ...tagged.map((operation) => ({
        ...toNavItem(intro, operation, `${name}/`),
        group: sectionTitle,
      })),
    )
  }

  return items
}
