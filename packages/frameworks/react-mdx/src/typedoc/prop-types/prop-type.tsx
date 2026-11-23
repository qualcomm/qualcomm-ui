// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  CodeHighlight,
  type HighlightedReference,
  RefHoverCard,
} from "@qualcomm-ui/react-mdx/code-highlight"
import {useDocsRuntimeContext} from "@qualcomm-ui/react-mdx/context"
import {dummyTypePrefix} from "@qualcomm-ui/react-mdx/shiki"
import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

import {displayedType} from "../internal/prop-types.utils.js"
import {useHighlightedReferences} from "../internal/use-highlighted-references.js"
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
  const {collapseRefs, layout} = useTypeDocContext()
  const references = useHighlightedReferences()
  const {renderLink: Link} = useDocsRuntimeContext()

  if (!prop.resolvedType) {
    console.debug("unsupported type", prop.name)
    return <></>
  }

  const restPrefix = prop.rest ? "..." : ""

  const resolvedType = prop.resolvedType
  const displayed = displayedType(resolvedType, collapseRefs)

  const prettyType = `${restPrefix}${displayed.prettyType ?? ""}`
  switch (resolvedType.baseType) {
    case "intrinsic":
      return <SimpleType content={prettyType} references={references} />

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
              {prettyType || displayed.type}
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
              code={`${dummyTypePrefix}${prettyType}`}
              disableCopy
              highlightedReferences={references}
              language="tsx"
            />
          </div>
        )
      } else if (displayed.type) {
        const opts = displayed.type.split("|")
        const union = (
          <pre className="qui-docs-code font-code-demo doc-props__resolved-type">
            {opts.map((opt, index) => {
              return (
                <span key={opt}>
                  <UnionMember references={references} text={opt} />
                  {index < opts.length - 1 ? "|" : ""}
                </span>
              )
            })}
          </pre>
        )
        return references ? (
          <RefHoverCard references={references}>{union}</RefHoverCard>
        ) : (
          union
        )
      }
  }

  return <SimpleType content={prettyType} references={references} />
}

interface UnionMemberProps {
  references: Record<string, HighlightedReference> | undefined
  text: string
}

/**
 * A member of a union in list layout. A member that names a ref, such as
 * `DateFilterDefinition` or `CustomFilterDefinition<any>`, opens its hover card.
 */
function UnionMember({references, text}: UnionMemberProps): ReactNode {
  const name = /^\s*([\w$]+)/.exec(text)?.[1]
  if (!name || !references?.[name]) {
    return text
  }
  const start = text.indexOf(name)
  return (
    <>
      {text.slice(0, start)}
      <span data-ref={name} tabIndex={0}>
        {name}
      </span>
      {text.slice(start + name.length)}
    </>
  )
}
