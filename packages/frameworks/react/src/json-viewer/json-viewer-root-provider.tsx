// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {jsonViewerClasses} from "@qualcomm-ui/qds-core/json-viewer"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"
import type {JsonNode} from "@qualcomm-ui/utils/json-tree"

import {JsonViewerOptionsProvider} from "./json-viewer-context"
import type {UseJsonViewerReturn} from "./use-json-viewer"

export interface JsonViewerRootProviderProps
  extends Omit<TreeRootProps<JsonNode>, "collection"> {
  children?: ReactNode

  /**
   * Pre-computed state from `useJsonViewer`. Use this when you need to
   * access the viewer state outside the component tree.
   */
  value: UseJsonViewerReturn
}

export function JsonViewerRootProvider({
  children,
  value,
  ...props
}: JsonViewerRootProviderProps): ReactElement {
  const {collection, defaultExpandedValue, options, treeProps} = value

  return (
    <JsonViewerOptionsProvider value={options}>
      <Tree.Root<JsonNode>
        className={jsonViewerClasses.root}
        collection={collection}
        defaultExpandedValue={defaultExpandedValue}
        typeahead={false}
        {...treeProps}
        {...props}
      >
        {children}
      </Tree.Root>
    </JsonViewerOptionsProvider>
  )
}
