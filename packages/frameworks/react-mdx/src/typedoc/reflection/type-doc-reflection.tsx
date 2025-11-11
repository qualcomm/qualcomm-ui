// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import type {QuiComment, SerializedType} from "@qualcomm-ui/typedoc-common"

import {usePropsLayoutContext} from "../use-props-layout-context"

import {TypeDocParametersTable} from "./type-doc-parameters-table"
import {TypeDocReflectionReturn} from "./type-doc-reflection-return"

export interface TypeDocReflectionProps {
  comment?: QuiComment
  name: string
  resolvedType: SerializedType
}

export function TypeDocReflection({
  resolvedType,
}: TypeDocReflectionProps): ReactNode {
  const {propsLayout} = usePropsLayoutContext()

  const parameters = resolvedType.parameters || []

  if (!parameters.length) {
    return resolvedType.prettyType ? (
      <div className="doc-props__symbol-wrapper">
        <CodeHighlight
          code={resolvedType.prettyType}
          disableCopy
          language="tsx"
        />
      </div>
    ) : null
  }

  return (
    <div className="doc-props__root">
      {propsLayout === "table" ? (
        <>
          <div className="docs-table__wrapper">
            <TypeDocParametersTable parameters={parameters} />
          </div>
          {/* TODO: list view in mobile layout */}
          <div className="docs-list-wrapper"></div>
        </>
      ) : (
        <></>
      )}

      <h5 className="mdx">Full Signature:</h5>

      <TypeDocReflectionReturn resolvedType={resolvedType} />
    </div>
  )
}
