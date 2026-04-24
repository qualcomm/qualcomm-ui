// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Heading, Parent, Root} from "mdast"
import type {Plugin} from "unified"
import {EXIT, visit} from "unist-util-visit"

/**
 * Replaces the first h1 heading in the document with a `PageHeader`
 * JSX element. This allows the page title to be enhanced with extra features
 * like a since tag or a copy markdown button.
 */
export const remarkFrontmatterTitle: Plugin<[], Root> = () => {
  return (tree) => {
    visit(
      tree,
      "heading",
      (node: Heading, index, parent: Parent | undefined) => {
        if (index === undefined || !parent || node.depth !== 1) {
          return
        }

        const wrappedNode = {
          attributes: [],
          children: node.children,
          name: "PageHeader",
          type: "mdxJsxFlowElement",
        }

        parent.children[index] = wrappedNode as (typeof parent.children)[number]

        return EXIT
      },
    )
  }
}
