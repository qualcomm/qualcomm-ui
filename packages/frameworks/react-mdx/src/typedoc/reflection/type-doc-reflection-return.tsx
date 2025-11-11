// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import type {SerializedType} from "@qualcomm-ui/typedoc-common"

export interface TypeDocReflectionReturnProps {
  resolvedType: SerializedType
}

export function TypeDocReflectionReturn({
  resolvedType,
}: TypeDocReflectionReturnProps): ReactElement {
  return (
    <CodeHighlight
      code={resolvedType.prettyType || ""}
      disableCopy
      language="tsx"
    />
  )
}
