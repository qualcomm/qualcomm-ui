// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BlockContent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

function getSerializeJsxStartMatch(text: string) {
  return text.match(/^:::\s*serialize-jsx\s*$/)
}

function getSerializeJsxEndMatch(text: string) {
  return text.trim() === ":::"
}

/**
 * @since 3.8.0
 */
export function isSerializeJsxBlock(text: string): boolean {
  return !!getSerializeJsxStartMatch(text) || !!getSerializeJsxEndMatch(text)
}

const isJsxNode = (node: {type: string}) =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement"

function createSerializeJsxPlugin(
  filter: (node: BlockContent) => boolean,
): Plugin<[], Root> {
  return () => (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const firstChild = node.children[0]
      if (firstChild?.type !== "text") {
        return
      }

      if (!getSerializeJsxStartMatch(firstChild.value)) {
        return
      }

      let endIndex = index + 1
      const contentNodes: BlockContent[] = []

      while (endIndex < parent.children.length) {
        const child = parent.children[endIndex]

        if (child.type === "paragraph") {
          const firstText = child.children[0]
          if (
            firstText?.type === "text" &&
            getSerializeJsxEndMatch(firstText.value)
          ) {
            break
          }
        }

        contentNodes.push(child as BlockContent)
        endIndex++
      }

      // No closing ::: found — leave the block untouched
      if (endIndex >= parent.children.length) {
        return
      }

      parent.children.splice(
        index,
        endIndex - index + 1,
        ...contentNodes.filter(filter),
      )
    })
  }
}

/**
 * Render-pipeline variant. Keeps only the JSX children of a
 * `::: serialize-jsx` block; discards the prose and the markers.
 *
 * The prose is export-only metadata — it must not appear on the rendered site
 * where the interactive component already provides the content.
 *
 * @example
 * ```mdx
 * ::: serialize-jsx
 *
 * Reordering the `children` array reorders nested pages — "Overview" appears
 * before "Troubleshooting" because its entry comes first.
 *
 * <NestedRouteOrderDemo />
 *
 * :::
 * ```
 *
 * Result in the render pipeline:
 * ```mdx
 * <NestedRouteOrderDemo />
 * ```
 *
 * @since 3.8.0
 */
export const remarkSerializeJsxRender: Plugin<[], Root> =
  createSerializeJsxPlugin(isJsxNode)

/**
 * Knowledge-export-pipeline variant. Keeps only the non-JSX children of a
 * `::: serialize-jsx` block; discards the JSX and the markers.
 *
 * The JSX element is already removed by `remarkRemoveJsx` in the knowledge
 * export pipeline — this plugin ensures the prose stand-in replaces it.
 *
 * @example
 * ```mdx
 * ::: serialize-jsx
 *
 * Reordering the `children` array reorders nested pages — "Overview" appears
 * before "Troubleshooting" because its entry comes first.
 *
 * <NestedRouteOrderDemo />
 *
 * :::
 * ```
 *
 * Result in the knowledge export pipeline:
 * ```md
 * Reordering the `children` array reorders nested pages — "Overview" appears
 * before "Troubleshooting" because its entry comes first.
 * ```
 *
 * @since 3.8.0
 */
export const remarkSerializeJsxKnowledge: Plugin<[], Root> =
  createSerializeJsxPlugin((n) => !isJsxNode(n))
