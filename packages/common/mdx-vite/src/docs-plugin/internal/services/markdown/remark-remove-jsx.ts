// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Plugin} from "unified"
import {remove} from "unist-util-remove"

export const remarkRemoveJsx: Plugin = () => {
  return (tree, _file, done) => {
    remove(tree, "mdxjsEsm")
    remove(tree, "mdxJsxFlowElement")
    done()
  }
}
