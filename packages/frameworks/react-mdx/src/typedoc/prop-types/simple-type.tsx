// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CodeHighlight,
  type HighlightedReference,
} from "@qualcomm-ui/react-mdx/code-highlight"
import {dummyTypePrefix} from "@qualcomm-ui/react-mdx/shiki"

interface Props {
  /**
   * string content
   */
  content?: string | null

  /**
   * Refs in the content that open a hover card, by name.
   */
  references?: Record<string, HighlightedReference>
}

export function SimpleType({content, references}: Props): ReactElement {
  if (content === "''") {
    return <></>
  }
  return (
    <CodeHighlight
      className="qui-docs-code fit"
      code={content ? `${dummyTypePrefix}${content}` : ""}
      disableCopy
      highlightedReferences={references}
      language="tsx"
    />
  )
}
