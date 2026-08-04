// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {QuiCommentTag} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "../prop-description/index.js"
import {SimpleType} from "../prop-types/index.js"

export interface TypeDocFunctionReturnProps {
  returnsTag?: QuiCommentTag
  returnType?: string
}

export function TypeDocFunctionReturn({
  returnsTag,
  returnType,
}: TypeDocFunctionReturnProps): ReactNode {
  if (!returnType && !returnsTag) {
    return null
  }

  return (
    <div className="doc-function__return-section">
      <h5 className="mdx">Returns</h5>
      {returnType ? (
        <div className="doc-function__return-type">
          <SimpleType content={returnType} />
        </div>
      ) : null}
      {returnsTag?.content?.length ? (
        <div className="doc-function__return-description doc-props-description__root">
          <PropDescriptionSummary summary={returnsTag.content} />
        </div>
      ) : null}
    </div>
  )
}
