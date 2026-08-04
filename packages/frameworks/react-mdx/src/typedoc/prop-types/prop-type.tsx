// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

import {useTypeDocContext} from "../use-typedoc-context.js"

import {Reference} from "./reference.js"
import {Reflection} from "./reflection.js"
import {SimpleType} from "./simple-type.js"
import {TypeInfoPopup} from "./type-info-popup.js"

interface Props {
  /**
   * Set to true to prevent reference types from expanding. This will cause them to
   * render as the type reference name.
   */
  disableReferenceExpansion?: boolean | undefined
  prop: QuiPropDeclaration
}

export function PropType({disableReferenceExpansion, prop}: Props): ReactNode {
  const {layout} = useTypeDocContext()
  const {renderLink: Link} = useMdxDocsContext()

  if (!prop.resolvedType) {
    console.debug("unsupported type", prop.type)
    return <></>
  }

  const restPrefix = prop.rest ? "..." : ""

  const resolvedType = prop.resolvedType

  const prettyType = `${restPrefix}${resolvedType.prettyType ?? ""}`
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
          <Reference
            disableReferenceExpansion={disableReferenceExpansion}
            prop={prop}
          />
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
