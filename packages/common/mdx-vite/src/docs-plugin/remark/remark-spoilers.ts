// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BlockContent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

interface SpoilerOptions {
  defaultSummary?: string
  detailsClassName?: string[]
  summaryClassName?: string[]
}

/**
 * Transforms spoiler blocks into MDX components.
 *
 * @example
 * ```
 * ::: spoiler Title
 *
 * Content
 *
 * :::
 * ```
 *
 * result:
 *
 * ```jsx
 * <SpoilerRoot>
 *   <SpoilerTrigger><p>Title</p></SpoilerTrigger>
 *   <SpoilerContent>Content</SpoilerContent>
 * </SpoilerRoot>
 * ```
 */
export const remarkSpoilers: Plugin<[SpoilerOptions?], Root> = (
  options = {},
) => {
  const {
    defaultSummary = "Open spoiler",
    detailsClassName = [],
    summaryClassName = [],
  } = options

  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const firstChild = node.children[0]
      if (firstChild?.type !== "text") {
        return
      }

      const match = firstChild.value.match(/^:::\s*spoiler\s*(.*)$/)
      if (!match) {
        return
      }

      const summary = match[1].trim() || defaultSummary
      let endIndex = index + 1
      const contentNodes: BlockContent[] = []

      while (endIndex < parent.children.length) {
        const child = parent.children[endIndex]

        if (child.type === "paragraph") {
          const firstText = child.children[0]
          if (firstText?.type === "text" && firstText.value.trim() === ":::") {
            break
          }
        }

        contentNodes.push(child as BlockContent)
        endIndex++
      }

      if (endIndex >= parent.children.length) {
        return
      }

      const summaryNode: BlockContent = {
        attributes: summaryClassName.length
          ? [
              {
                name: "className",
                type: "mdxJsxAttribute",
                value: summaryClassName.join(" "),
              },
            ]
          : [],
        children: [
          {
            children: [{type: "text", value: summary}],
            type: "paragraph",
          },
        ],
        name: "SpoilerSummary",
        type: "mdxJsxFlowElement",
      }

      const contentNode: BlockContent = {
        attributes: [],
        children: contentNodes,
        name: "SpoilerContent",
        type: "mdxJsxFlowElement",
      }

      const detailsNode: BlockContent = {
        attributes: detailsClassName.length
          ? [
              {
                name: "className",
                type: "mdxJsxAttribute",
                value: detailsClassName.join(" "),
              },
            ]
          : [],
        children: [summaryNode, contentNode],
        name: "SpoilerRoot",
        type: "mdxJsxFlowElement",
      }

      parent.children.splice(index, endIndex - index + 1, detailsNode)
    })
  }
}
