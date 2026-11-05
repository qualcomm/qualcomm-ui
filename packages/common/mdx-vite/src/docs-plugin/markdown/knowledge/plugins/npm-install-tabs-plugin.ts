// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Parent} from "mdast"
import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {extractNamesFromAttribute} from "../../mdx-utils.js"

export const formatNpmInstallTabs: Plugin = () => {
  return (tree, _file, done) => {
    visit(
      tree,
      "mdxJsxFlowElement",
      (
        node: MdxJsxFlowElement,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (node?.name === "NpmInstallTabs") {
          const packages = node.attributes?.find(
            (attr): attr is MdxJsxAttribute =>
              attr.type === "mdxJsxAttribute" && attr.name === "packages",
          )
          const packageNames = packages
            ? extractNamesFromAttribute(packages)
            : []

          if (packageNames.length === 0) {
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }

          Object.assign(node, {
            lang: "shell",
            meta: null,
            type: "code",
            value: `npm install ${packageNames.join(" ")}`,
          })
        }
      },
    )
    done()
  }
}
