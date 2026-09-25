// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {JsonViewerRoot, type JsonViewerRootProps} from "./json-viewer-root"
import {JsonViewerTree, type JsonViewerTreeProps} from "./json-viewer-tree"

export interface JsonViewerProps
  extends Omit<JsonViewerRootProps, "children">,
    Omit<JsonViewerTreeProps, "renderValue"> {
  /**
   * Props forwarded to the inner `JsonViewer.Tree` element.
   *
   * @inheritDoc
   */
  treeProps?: JsonViewerTreeProps
}

export function JsonViewerSimple({
  arrow = ChevronRight,
  indentGuide = true,
  treeProps,
  ...rootProps
}: JsonViewerProps): ReactElement {
  return (
    <JsonViewerRoot {...rootProps}>
      <JsonViewerTree arrow={arrow} indentGuide={indentGuide} {...treeProps} />
    </JsonViewerRoot>
  )
}
