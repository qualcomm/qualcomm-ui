// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {pascalCase} from "change-case"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import {useMdxDocsLayoutContext} from "@qualcomm-ui/mdx-docs/docs-layout"
import {dummyTypePrefix} from "@qualcomm-ui/mdx-docs/shiki"
import type {PagePropTypes} from "@qualcomm-ui/mdx-docs-common"
import {Link} from "@qualcomm-ui/react/link"
import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

import {DocsExternalLink} from "../docs-external-link"
import {usePropsContext} from "../use-props-context"

import {SimpleType} from "./simple-type"

interface Props {
  prop: QuiPropDeclaration
}

export function Reference({prop}: Props): ReactNode {
  // scoped to the TypeDocProps on the current page.
  const props = usePropsContext()
  const {toc} = useMdxDocsLayoutContext()
  const {renderLink: RenderLink} = useMdxDocsContext()

  if (prop.resolvedType.type === "ReactNode") {
    return (
      <DocsExternalLink
        href="https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d076add9f29db350a19bd94c37b197729cc02f87/types/react/index.d.ts#L237"
        text="ReactNode"
      />
    )
  }

  if (prop.resolvedType.type === "LucideIconBase") {
    return (
      <DocsExternalLink href="https://lucide.dev/icons" text="LucideIcon" />
    )
  }

  if (prop.resolvedType.type === "CSSProperties") {
    return (
      <DocsExternalLink
        href="https://www.npmjs.com/package/csstype"
        text="CSSProperties"
      />
    )
  }

  const docProp = props[prop.resolvedType.name]
  if (prop.resolvedType.type === "any" && docProp?.resolvedType?.docLink) {
    return (
      <pre className="qui-docs-code font-code-demo fit">
        <Link render={<RenderLink href={docProp?.resolvedType?.docLink} />}>
          {prop.resolvedType.name}
        </Link>
      </pre>
    )
  }

  const {
    docLink,
    inheritDoc,
    prettyType = "",
    reference,
    referenceLink,
    type,
    typeArgs,
  } = prop.resolvedType

  if (referenceLink) {
    if (inheritDoc) {
      return (
        <pre className="qui-docs-code font-code-demo fit">
          <Link render={<RenderLink href={referenceLink} />}>
            {prettyType || type}
          </Link>
        </pre>
      )
    } else if (reference) {
      return <DocsExternalLink href={referenceLink} text={reference} />
    }
  }
  if (docLink) {
    if (inheritDoc) {
      return (
        <pre className="qui-docs-code font-code-demo fit">
          <Link render={<RenderLink href={docLink} />}>
            {prettyType || type}
          </Link>
        </pre>
      )
    } else if (reference) {
      return <DocsExternalLink href={docLink} text={reference} />
    }
  } else if (inheritDoc) {
    // no doc link, but it might exist on this page, so we check here.
    let docProp: PagePropTypes | undefined
    let typeName: string | undefined
    if (typeArgs?.[0]?.baseType === "reference" && typeArgs[0].type) {
      typeName = typeArgs[0].type
      docProp = props[typeName]
    }
    if (!docProp && type) {
      typeName = type
      docProp = props[typeName]
      if (!docProp && type.endsWith(">")) {
        // remove generic and try again
        typeName = type.slice(0, type.indexOf("<"))
        docProp = props[typeName]
      }
    }
    if (docProp) {
      const headingId = toc.find((entry) => {
        if (entry.textContent === typeName) {
          return true
        }
        // if a component heading, like <Button>, then we need to check for the prop
        // name.
        if (typeName && entry.textContent.startsWith("<")) {
          if (entry.id === typeName.toLowerCase()) {
            return true
          } else if (typeName.endsWith("Props")) {
            return (
              pascalCase(entry.id) ===
              typeName.substring(0, typeName.length - 5)
            )
          }
        }
        return false
      })?.id
      if (headingId) {
        return (
          <pre className="qui-docs-code font-code-demo fit">
            <Link render={<RenderLink href={`#${headingId}`} />}>
              {typeName || type}
            </Link>
          </pre>
        )
      }
    }
  }

  if (prop.resolvedType.parentTypeParam) {
    return <SimpleType content={prop.resolvedType.parentTypeParam.type} />
  }

  if (!prettyType) {
    return null
  }

  return (
    <>
      {prop.resolvedType.docLink ? (
        <pre className="qui-docs-code font-code-demo fit">
          <Link render={<RenderLink href={prop.resolvedType.docLink} />}>
            {prettyType}
          </Link>
        </pre>
      ) : (
        <CodeHighlight
          className="qui-docs-code fit"
          code={`${dummyTypePrefix}${prettyType}`}
          disableCopy
          language="tsx"
        />
      )}
    </>
  )
}
