// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreTree, type CoreTreeNodeTextProps} from "@qualcomm-ui/react-core/tree"

export interface TreeNodeTextProps extends CoreTreeNodeTextProps {}

/**
 * The primary title of the tree item. Renders a `<span>` element by default.
 */
export function TreeNodeText(props: TreeNodeTextProps): ReactElement {
  return <CoreTree.NodeText {...props} />
}
