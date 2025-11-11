// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  CodeHighlight,
  type HighlightedReference,
} from "@qualcomm-ui/mdx-docs/code-highlight"
import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import {useMdxDocsLayoutContext} from "@qualcomm-ui/mdx-docs/docs-layout"
import {dummyTypePrefix} from "@qualcomm-ui/mdx-docs/shiki"
import type {QuiPropDeclaration} from "@qualcomm-ui/mdx-docs-common"

import {usePropsContext} from "../use-props-context"

import {TypeInfoPopup} from "./type-info-popup"

export interface ReflectionProps {
  prop: QuiPropDeclaration
}

export function Reflection({prop}: ReflectionProps): ReactElement {
  const {renderLink} = useMdxDocsContext()
  const {resolvedType} = prop
  const {toc} = useMdxDocsLayoutContext()
  const props = usePropsContext()
  const prettyType = resolvedType.prettyType ?? ""

  const referenceLinks = useMemo(
    () =>
      (resolvedType.functionArgs ?? []).reduce(
        (acc: Record<string, HighlightedReference>, arg) => {
          if (
            arg.referenceType &&
            props[arg.referenceType] &&
            prettyType.includes(arg.referenceType)
          ) {
            const headingId = toc.find(
              (entry) => entry.textContent === arg.referenceType,
            )?.id
            if (headingId) {
              acc[arg.referenceType] = {
                href: `#${headingId}`,
                prettyType: arg.prettyType || arg.type,
              }
            }
          }
          return acc
        },
        {},
      ),
    [prettyType, props, resolvedType.functionArgs, toc],
  )

  return (
    <div className="doc-props__type-wrapper">
      {resolvedType.importStatement ? (
        <TypeInfoPopup importStatement={resolvedType.importStatement} />
      ) : null}
      <CodeHighlight
        code={`${dummyTypePrefix}${prettyType}`}
        disableCopy
        highlightedReferences={referenceLinks}
        language="tsx"
        renderLink={renderLink}
        style={{width: "fit-content"}}
      />
    </div>
  )
}
