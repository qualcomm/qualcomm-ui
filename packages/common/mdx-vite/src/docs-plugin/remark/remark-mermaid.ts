// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

/**
 * Transforms mermaid code fences into a MermaidDiagram JSX component.
 *
 * @example
 * ~~~
 * ```mermaid
 * graph TD
 *   A --> B
 * ```
 * ~~~
 *
 * result:
 *
 * ```jsx
 * <MermaidDiagram chart={"graph TD\n  A --> B"} />
 * ```
 */
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      if (node.lang !== "mermaid") {
        return
      }

      const mermaidNode = {
        attributes: [
          {
            name: "chart",
            type: "mdxJsxAttribute",
            value: node.value,
          },
        ],
        children: [],
        name: "MermaidDiagram",
        type: "mdxJsxFlowElement",
      }

      parent.children[index] = mermaidNode as any
    })
  }
}