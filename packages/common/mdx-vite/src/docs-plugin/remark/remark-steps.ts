// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BlockContent, Heading, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

const defaultAllowedHeadings = new Set([2, 3, 4])

/**
 * Parses a heading specifier into a Set of depths.
 * Supports a single level (`h2`) or a range (`h2-h5`).
 * Returns `undefined` for invalid input.
 */
function parseHeadingRange(value: string): Set<number> | undefined {
  const match = value.match(/^h([1-6])(?:-h([1-6]))?$/)
  if (!match) {
    return undefined
  }

  const start = Number(match[1])
  const end = match[2] ? Number(match[2]) : start
  if (start > end) {
    return undefined
  }

  const depths = new Set<number>()
  for (let i = start; i <= end; i++) {
    depths.add(i)
  }
  return depths
}

function isHeading(node: {type: string}): node is Heading {
  return node.type === "heading"
}

function getStepStartMatch(text: string) {
  return text.match(/^:::\s*steps(?:\s+(h[1-6](?:-h[1-6])?))?\s*$/)
}

function getStepEndMatch(text: string) {
  return text.match(/^:::\s*\/steps\s*$/)
}

export function isStepBlock(text: string) {
  return !!(getStepStartMatch(text) || getStepEndMatch(text))
}

/**
 * Transforms `:::steps` blocks into a styled `<div>` wrapper.
 *
 * Accepts an optional heading specifier to control which headings receive
 * step numbering. Supports a single level (`h3`) or a range (`h2-h5`).
 * Defaults to `h2-h4`.
 *
 * @example
 * ```
 * :::steps
 *
 * ## Step 1
 *
 * Content for step 1.
 *
 * ## Step 2
 *
 * Content for step 2.
 *
 * :::/steps
 * ```
 *
 * With a single heading level:
 *
 * ```
 * :::steps h3
 *
 * ### Step 1
 *
 * :::/steps
 * ```
 *
 * With a custom heading range:
 *
 * ```
 * :::steps h2-h5
 *
 * ## Step 1
 *
 * :::/steps
 * ```
 *
 * result:
 *
 * ```jsx
 * <div className="qui-docs__steps">
 *   <h2 data-step>Step 1</h2>
 *   <p>Content for step 1.</p>
 *   <h2 data-step>Step 2</h2>
 *   <p>Content for step 2.</p>
 * </div>
 * ```
 */
export const remarkSteps: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const firstChild = node.children[0]
      if (firstChild?.type !== "text") {
        return
      }

      const match = getStepStartMatch(firstChild.value)
      if (!match) {
        return
      }

      const allowedHeadings = match[1]
        ? (parseHeadingRange(match[1]) ?? defaultAllowedHeadings)
        : defaultAllowedHeadings

      let endIndex = index + 1
      const contentNodes: BlockContent[] = []

      while (endIndex < parent.children.length) {
        const child = parent.children[endIndex]

        if (child.type === "paragraph") {
          const firstText = child.children[0]
          if (firstText?.type === "text" && getStepEndMatch(firstText.value)) {
            break
          }
        }

        if (isHeading(child) && allowedHeadings.has(child.depth)) {
          child.data = {
            ...child.data,
            hProperties: {
              ...(child.data as {hProperties?: Record<string, unknown>})
                ?.hProperties,
              "data-step": "",
            },
          }
        }

        contentNodes.push(child as BlockContent)
        endIndex++
      }

      if (endIndex >= parent.children.length) {
        return
      }

      const stepsNode: BlockContent = {
        attributes: [],
        children: contentNodes,
        name: "HeadingSteps",
        type: "mdxJsxFlowElement",
      }

      parent.children.splice(index, endIndex - index + 1, stepsNode)
    })
  }
}
