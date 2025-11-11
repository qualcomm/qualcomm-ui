// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Heading, Link, Root} from "mdast"
import {toString} from "mdast-util-to-string"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

export interface RemarkSelfLinkOptions {
  /**
   * @default [2, 3, 4]
   */
  allowedLevels?: number[]
  prefix?: string
}

const emptyOptions: RemarkSelfLinkOptions = {}

export function remarkSelfLinkHeadings(
  baseUrl: string = "",
  options?: RemarkSelfLinkOptions | null,
): Plugin<[], Root> {
  if (!baseUrl) {
    return () => {}
  }
  return () => {
    const settings = options || emptyOptions
    const prefix = settings.prefix || ""
    const allowedLevels = new Set<number>(settings.allowedLevels || [2, 3, 4])
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
      visit(tree, "heading", (node: Heading) => {
        if (allowedLevels.has(node.depth)) {
          const text = toString(node)
          const slug = prefix + createSlug(text)

          const linkNode: Link = {
            children: node.children,
            type: "link",
            url: `${baseUrl}#${slug}`,
          }

          node.children = [linkNode]
        }
      })
    }
  }
}
