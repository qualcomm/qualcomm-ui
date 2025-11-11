// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {QuiCommentTag} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "./prop-description-summary"

interface Props {
  tags: QuiCommentTag[]
}

export function PropDescriptionOptionTags({tags}: Props): ReactNode {
  return (
    <ul className="doc-props-description__option-tags">
      {tags.map((tag, index) => {
        return (
          <li key={index}>
            <PropDescriptionSummary summary={tag.content} />
          </li>
        )
      })}
    </ul>
  )
}
