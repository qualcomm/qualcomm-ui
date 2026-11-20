// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "hast"
import type {Root as MdastRoot} from "mdast"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import {type Plugin, unified} from "unified"
import {visit} from "unist-util-visit"

import {parseAlert} from "../remark/remark-alerts.js"

import {isNameMap, isPayload} from "./spec-keys.js"

const safeUrl = /^(?:https?:|mailto:|[#/.?]|[^:]*$)/i

/**
 * Specs come from anywhere, remote URLs included. remark-rehype already drops
 * raw HTML, so only the URLs that Markdown itself produces are left to check.
 */
function sanitize(tree: Root): void {
  visit(tree, (node, index, parent) => {
    delete node.position
    if (node.type !== "element") {
      return
    }
    for (const property of ["href", "src"]) {
      const url = node.properties[property]
      if (typeof url === "string" && !safeUrl.test(url.trim())) {
        delete node.properties[property]
      }
    }
    // A link stripped of its URL would still look like one.
    if (
      node.tagName === "a" &&
      !node.properties.href &&
      parent &&
      index !== undefined
    ) {
      parent.children.splice(index, 1, ...node.children)
      return index
    }
  })
}

/**
 * Emits GitHub alerts as an `alert` element instead of styled markup, so the
 * renderer decides how they look.
 */
const remarkAlertElements: Plugin<[], MdastRoot> = () => (tree) => {
  visit(tree, "blockquote", (node) => {
    const alert = parseAlert(node)
    if (alert) {
      node.data = {
        hName: "alert",
        hProperties: {label: alert.title, type: alert.type},
      }
    }
  })
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkAlertElements)
  .use(remarkRehype)

/**
 * Parses a CommonMark description into a hast tree, without positions so it
 * stays small as loader data.
 */
export function parseDescription(markdown: string): Root {
  const tree = processor.runSync(processor.parse(markdown))
  sanitize(tree)
  return tree
}

/**
 * Replaces every CommonMark `description` in `node` with its hast tree. `node`
 * must be a fresh tree, as returned by `dereference`, since descriptions are
 * parsed exactly once.
 */
export function parseDescriptions<T>(node: T): T {
  function walk(value: unknown, inNameMap: boolean): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => walk(item, false))
    }
    if (!value || typeof value !== "object") {
      return value
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => {
        if (inNameMap) {
          return [key, walk(child, false)]
        }
        if (key === "description" && typeof child === "string") {
          return [key, parseDescription(child)]
        }
        if (isPayload(key, child)) {
          return [key, child]
        }
        return [key, walk(child, isNameMap(key, child))]
      }),
    )
  }
  return walk(node, false) as T
}
