// Modified from https://github.com/etler/remark-unravel-mdx/
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root, Paragraph} from "mdast"
import {visit} from "unist-util-visit"

/**
 * Remark plugin to unravel paragraphs containing only JSX elements and paragraphs
 * inside MDX components
 *
 * This plugin:
 * 1. Finds paragraphs that contain only MDX JSX elements (and whitespace) and
 * replaces them with their children directly
 * 2. Finds paragraphs that are immediate children of MDX JSX elements and unwraps
 * them
 * 3. Unwraps other nodes like images.
 *
 * @returns A unified transformer function
 *
 * @example
 * ```js
 * unified()
 *   .use(remarkParse)
 *   .use(remarkMdx)
 *   .use(remarkUnravelMdx)
 * ```
 */
export function remarkUnwrapParagraphs() {
  return function (tree: Root): void {
    // First pass: unwrap paragraphs containing only JSX elements and whitespace
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      // Check if paragraph contains only JSX elements and whitespace
      const shouldBeSkipped = node.children.every((child) => {
        switch (child.type) {
          case "mdxJsxTextElement":
          /**
           * Markdown images render as the block-level ImageViewer (see the `img`
           * mapping in react-mdx's MdxProvider), so they shouldn't be wrapped in
           * a paragraph.
           */
          case "image":
            return true
          case "text":
            // Allow only whitespace text nodes
            return child.value.trim() === ""
          default:
            return false
        }
      })

      if (shouldBeSkipped && parent && index !== undefined) {
        // Remove the paragraph and replace it with its children
        parent.children.splice(index, 1, ...node.children)
        // Return the index adjusted for the number of new nodes
        return index + node.children.length - 1
      }
      return
    })

    // Second pass: unwrap paragraphs that are immediate children of MDX JSX elements
    visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => {
      if (
        node.type !== "mdxJsxFlowElement" &&
        node.type !== "mdxJsxTextElement"
      ) {
        return
      }
      const [child, ...rest] = node.children
      // Remove child if only child is a paragraph
      if (rest.length === 0 && child?.type === "paragraph") {
        // Remove the paragraph and replace it with its children
        node.children.splice(0, 1, ...child.children)
        // Return the index adjusted for the number of new nodes
        return child.children.length - 1
      }
    })
  }
}
