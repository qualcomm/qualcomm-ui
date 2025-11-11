import type {ReactElement} from "react"

import type {QuiComment} from "@qualcomm-ui/mdx-docs-common"

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
