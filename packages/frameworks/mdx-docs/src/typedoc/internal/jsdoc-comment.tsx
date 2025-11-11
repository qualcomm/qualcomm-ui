// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QuiComment} from "@qualcomm-ui/typedoc-common"

import {
  PropDescriptionBlockTags,
  PropDescriptionSummary,
} from "../prop-description"

export interface JsdocCommentProps {
  comment?: QuiComment | null
}

export function JsdocComment({
  comment,
}: JsdocCommentProps): ReactElement | null {
  const summary = comment?.summary || []
  const blockTags = comment?.blockTags || []

  if (!summary.length && !blockTags.length) {
    return null
  }

  return (
    <div className="doc-props-description__root doc-props__top-level-jsdoc-comment">
      {summary.length ? <PropDescriptionSummary summary={summary} /> : null}
      {blockTags.length ? <PropDescriptionBlockTags tags={blockTags} /> : null}
    </div>
  )
}
