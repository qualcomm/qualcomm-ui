// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, Fragment, type ReactElement} from "react"

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import {useHighlight, type UseHighlightProps} from "./use-highlight"

const highlightProps = createProps<UseHighlightProps>()(
  "exactMatch",
  "ignoreCase",
  "matchAll",
  "query",
  "text",
)

const splitProps = createSplitProps<UseHighlightProps>(highlightProps)

export interface HighlightTextProps
  extends ComponentProps<"mark">,
    UseHighlightProps {}

export function HighlightText(props: HighlightTextProps): ReactElement {
  if (typeof props.text !== "string") {
    throw new Error("[@qualcomm-ui/react-core/highlight] text must be a string")
  }

  const [highlightProps, localProps] = splitProps(props)

  const chunks = useHighlight(highlightProps)

  return (
    <Fragment>
      {chunks.map(({match, text}, i) =>
        match ? (
          <mark key={i} {...localProps}>
            {text}
          </mark>
        ) : (
          <Fragment key={i}>{text}</Fragment>
        ),
      )}
    </Fragment>
  )
}
