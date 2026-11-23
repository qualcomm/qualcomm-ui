// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {dummyTypePrefix} from "@qualcomm-ui/react-mdx/shiki"
import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

import {displayedType} from "../internal/prop-types.utils.js"
import {useHighlightedReferences} from "../internal/use-highlighted-references.js"
import {useTypeDocContext} from "../use-typedoc-context.js"

import {TypeInfoPopup} from "./type-info-popup.js"

export interface ReflectionProps {
  prop: QuiPropDeclaration
}

export function Reflection({prop}: ReflectionProps): ReactElement {
  const {resolvedType} = prop
  const {collapseRefs} = useTypeDocContext()
  const references = useHighlightedReferences()
  const prettyType = displayedType(resolvedType, collapseRefs).prettyType ?? ""

  return (
    <div className="doc-props__type-wrapper">
      {resolvedType.importStatement ? (
        <TypeInfoPopup importStatement={resolvedType.importStatement} />
      ) : null}
      <CodeHighlight
        code={`${dummyTypePrefix}${prettyType}`}
        disableCopy
        highlightedReferences={references}
        language="tsx"
        style={{width: "fit-content"}}
      />
    </div>
  )
}
