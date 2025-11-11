// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionBlockTags} from "./prop-description-block-tags"

export interface PropDescriptionExtraDetailsProps {
  prop: QuiPropDeclaration
}

export function PropDescriptionExtraDetails({
  prop,
}: PropDescriptionExtraDetailsProps): ReactElement {
  const blockTags = prop.comment?.blockTags ?? []
  return (
    <div className="doc-props-description__extra-details">
      <PropDescriptionBlockTags tags={blockTags} />
    </div>
  )
}

export function getHasExtraDetails(
  prop: QuiPropDeclaration,
): boolean | undefined {
  return (
    prop.comment &&
    prop.comment.blockTags?.some(
      (tag) => tag.tag === "@example" || tag.tag === "@remarks",
    )
  )
}
