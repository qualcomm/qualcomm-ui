// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QuiCommentTag} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "./prop-description-summary.js"

export interface PropDescriptionReturnsTagProps {
  tag: QuiCommentTag
}

export function PropDescriptionReturnsTag({
  tag,
}: PropDescriptionReturnsTagProps): ReactElement {
  return (
    <div className="doc-props-description__returns-tag-root">
      <div className="doc-props-description__returns-tag-label">Returns:</div>
      <div className="doc-props-description__returns-tag-content">
        <PropDescriptionSummary summary={tag.content} />
      </div>
    </div>
  )
}
