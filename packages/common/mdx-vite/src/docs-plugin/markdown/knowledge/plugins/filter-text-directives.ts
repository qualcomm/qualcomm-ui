// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Text} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {
  isSerializeJsxBlock,
  isSpoilerBlock,
  isStepBlock,
} from "../../../remark/index.js"

export const filterTextDirectives: Plugin = () => {
  return (tree, _file, done) => {
    visit(tree, "text", (node: Text) => {
      const value = node.value?.trim?.()
      if (
        value &&
        (isStepBlock(value) ||
          isSpoilerBlock(value) ||
          isSerializeJsxBlock(value))
      ) {
        Object.assign(node, {
          value: ``,
        })
      }
    })
    done()
  }
}
