// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "hast"
import {headingRank} from "hast-util-heading-rank"
import {toString} from "hast-util-to-string"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

export interface RehypeSlugOptions {
  /**
   * @default ['h2', 'h3', 'h4']
   */
  allowedHeadings?: string[]
  prefix?: string
}

const emptyOptions: RehypeSlugOptions = {}

/**
 * Converts heading text to URL-friendly slugs. Converts multi-word and PascalCase
 * text to kebab-case. Lowercases single sentence-case words. Appends counter for
 * duplicate slugs.
 */
export const rehypeSlug: Plugin<[RehypeSlugOptions?], Root> = (
  options: RehypeSlugOptions | null | undefined,
) => {
  const settings = options || emptyOptions
  const prefix = settings.prefix || ""
  const allowedHeadings = new Set<string>(
    settings.allowedHeadings || ["h2", "h3", "h4"],
  )
  const seenIds = new Map<string, number>()

  function createSlug(text: string): string {
    const cleaned = text
      .replace(/[<>]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()

    let slug: string
    if (cleaned.includes(" ")) {
      slug = cleaned
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "")
    } else if ((cleaned.match(/[A-Z]/g) || []).length >= 2) {
      slug = cleaned
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase()
    } else {
      slug = cleaned.toLowerCase()
    }

    const count = seenIds.get(slug) || 0
    seenIds.set(slug, count + 1)
    return count > 0 ? `${slug}-${count}` : slug
  }

  return (tree) => {
    seenIds.clear()
    visit(tree, "element", function (node) {
      if (
        headingRank(node) &&
        !node.properties.id &&
        allowedHeadings.has(node.tagName)
      ) {
        node.properties.id = prefix + createSlug(toString(node))
      }
    })
  }
}
