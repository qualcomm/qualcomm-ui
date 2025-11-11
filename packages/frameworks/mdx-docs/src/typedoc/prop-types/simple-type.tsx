// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {dummyTypePrefix} from "@qualcomm-ui/mdx-docs/shiki"

interface Props {
  /**
   * string content
   */
  content?: string | null
}

export function SimpleType({content}: Props): ReactElement {
  if (content === "''") {
    return <></>
  }
  return (
    <CodeHighlight
      className="qui-docs-code fit"
      code={content ? `${dummyTypePrefix}${content}` : ""}
      disableCopy
      language="tsx"
    />
  )
}
