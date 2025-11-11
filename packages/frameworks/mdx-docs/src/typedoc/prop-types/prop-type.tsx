// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import type {QuiPropDeclaration} from "@qualcomm-ui/mdx-docs-common"

import {useTypeDocContext} from "../use-typedoc-context"

import {Reference} from "./reference"
import {Reflection} from "./reflection"
import {SimpleType} from "./simple-type"
import {TypeInfoPopup} from "./type-info-popup"

interface Props {
  prop: QuiPropDeclaration
}

export function PropType({prop}: Props): ReactNode {
  const {layout} = useTypeDocContext()
  const {renderLink: Link} = useMdxDocsContext()

  if (!prop.resolvedType) {
    console.debug("unsupported type", prop.type)
    return <></>
  }

  const resolvedType = prop.resolvedType

  const prettyType = resolvedType.prettyType ?? ""
  switch (resolvedType.baseType ?? prop.type) {
    case "intrinsic":
      return <SimpleType content={prettyType} />

    case "reference":
      const importStatement =
        resolvedType.typeArgs?.[0]?.importStatement ||
        resolvedType.importStatement
      return (
        <div className="doc-props__type-wrapper">
          {importStatement ? (
            <TypeInfoPopup importStatement={importStatement} />
          ) : null}
          <Reference prop={prop} />
        </div>
      )

    case "array":
      if (resolvedType.docLink && resolvedType.inheritDoc) {
        return (
          <pre className="qui-docs-code font-code-demo fit">
            <Link href={resolvedType.docLink}>
              {prettyType || resolvedType.type}
            </Link>
          </pre>
        )
      }
      break

    case "reflection":
      return <Reflection prop={prop} />

    case "union":
      if (layout === "table") {
        return (
          <div className="doc-props__type-wrapper">
            {resolvedType.importStatement ? (
              <TypeInfoPopup importStatement={resolvedType.importStatement} />
            ) : null}
            <CodeHighlight
              className="prop-type__union qui-docs-code fit"
              code={prettyType}
              disableCopy
              language="tsx"
            />
          </div>
        )
      } else if (resolvedType.type) {
        const opts = resolvedType.type.split("|")
        return (
          <pre className="qui-docs-code font-code-demo doc-props__resolved-type">
            {opts.map((opt, index) => {
              return (
                <span key={opt}>
                  {opt}
                  {index < opts.length - 1 ? "|" : ""}
                </span>
              )
            })}
          </pre>
        )
      }
  }

  return <SimpleType content={prettyType} />
}
