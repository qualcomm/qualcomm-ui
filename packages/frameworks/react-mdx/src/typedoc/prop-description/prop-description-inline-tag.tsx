// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {QuiInlineTagDisplayPart} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionLink} from "./prop-description-link.js"

interface Props {
  inlineTag: QuiInlineTagDisplayPart
}

export function PropDescriptionInlineTag({inlineTag}: Props): ReactNode {
  const {tag} = inlineTag

  if (tag === "@link") {
    return <PropDescriptionLink inlineTag={inlineTag} />
  }

  return <></>
}
