// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {QuiCommentTag, SerializedType} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "../prop-description"
import {SimpleType} from "../prop-types"

export interface FunctionReturnsProps {
  resolvedType: SerializedType
  returnsTag?: QuiCommentTag | undefined
}

export function FunctionReturns({
  resolvedType,
  returnsTag,
}: FunctionReturnsProps): ReactNode {
  return resolvedType.returnType || returnsTag ? (
    <div className="doc-function__returns">
      <span className="doc-function__returns-label">Returns</span>
      {resolvedType.returnType ? (
        <SimpleType content={resolvedType.returnType} />
      ) : null}
      {returnsTag?.content?.length ? (
        <span className="doc-function__returns-desc doc-props-description__root">
          <PropDescriptionSummary summary={returnsTag.content} />
        </span>
      ) : null}
    </div>
  ) : null
}
