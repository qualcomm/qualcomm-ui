// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactElement} from "react"

import {
  SpoilerContent,
  SpoilerRoot,
  SpoilerSummary,
} from "@qualcomm-ui/mdx-docs/spoiler"
import type {QuiCommentTag} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "./prop-description-summary"

export interface PropDescriptionBlockTagsProps {
  tags: QuiCommentTag[]
}

export function PropDescriptionBlockTags({
  tags,
}: PropDescriptionBlockTagsProps): ReactElement {
  const filteredTags = tags.filter((tag) => tag.tag in tagComponents)
  return (
    <>
      {filteredTags.map((tag, index) => {
        const Component = tagComponents[tag.tag]
        return (
          <Fragment key={`${tag.name}-${index}`}>
            {Component ? (
              <Component tag={tag} />
            ) : (
              <PropDescriptionSummary summary={tag.content} />
            )}
          </Fragment>
        )
      })}
    </>
  )
}

const tagComponents: Record<
  string,
  (props: {tag: QuiCommentTag}) => ReactElement
> = {
  "@example": ({tag}) => {
    return (
      <div className="doc-props-description__example-tag">
        <PropDescriptionSummary summary={tag.content} />
      </div>
    )
  },
  "@remarks": function Row({tag}: {tag: QuiCommentTag}) {
    return (
      <div className="doc-props-description__remarks-tag">
        <SpoilerRoot>
          <SpoilerSummary>Remarks</SpoilerSummary>
          <SpoilerContent>
            <PropDescriptionSummary summary={tag.content} />
          </SpoilerContent>
        </SpoilerRoot>
      </div>
    )
  },
}
