import type {ReactElement} from "react"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import type {SerializedType} from "@qualcomm-ui/mdx-docs-common"

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
