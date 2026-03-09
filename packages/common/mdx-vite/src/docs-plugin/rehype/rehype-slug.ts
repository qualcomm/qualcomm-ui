// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "hast"
import {headingRank} from "hast-util-heading-rank"
import {toString} from "hast-util-to-string"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {SlugGenerator} from "../markdown/create-slug"

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
  const slugGenerator = new SlugGenerator()

  return (tree) => {
    slugGenerator.reset()
    visit(tree, "element", function (node) {
      if (
        headingRank(node) &&
        !node.properties.id &&
        allowedHeadings.has(node.tagName)
      ) {
        node.properties.id = prefix + slugGenerator.createSlug(toString(node))
      }
    })
  }
}
