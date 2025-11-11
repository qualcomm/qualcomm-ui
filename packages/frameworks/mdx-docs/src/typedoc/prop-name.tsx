// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {Info} from "lucide-react"

import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"
import {Icon} from "@qualcomm-ui/react/icon"
import {Link} from "@qualcomm-ui/react/link"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

import {useTypeDocContext} from "./use-typedoc-context"

interface Props {
  changelogPathname?: string | null
  id?: string
  prop: QuiPropDeclaration
}

function formatSinceUrl(
  changelogUrl: string,
  since: string | undefined,
): string {
  if (!since) {
    return ""
  }
  return since.startsWith("v")
    ? `${changelogUrl}#${since.substring(1).split(".").join("")}`
    : `${changelogUrl}#${since.split(".").join("")}`
}

export function PropName({changelogPathname, id, prop}: Props): ReactNode {
  const {renderLink: RenderLink} = useMdxDocsContext()
  const {disableRequired, linkifyPrimaryColumn} = useTypeDocContext()
  const required = prop.resolvedType.required && !disableRequired
  const deprecated = prop.resolvedType.deprecated
  const isOutput = useMemo(
    () => prop.resolvedType.type?.match(/^((EventEmitter)|(OutputEmitterRef))/),
    [prop.resolvedType.type],
  )
  const isTwoWayBindingProperty = isOutput
    ? false
    : prop.resolvedType?.type?.startsWith("ModelSignal")
  const sinceTag = prop.comment?.blockTags?.find?.(
    (tag) => tag.tag === "@since",
  )
  const sinceText = sinceTag?.content?.[0]?.text

  const name = isOutput
    ? `(${prop.name})`
    : isTwoWayBindingProperty
      ? `[(${prop.name})]`
      : prop.name

  const {docProps} = useMdxDocsContext()

  const changelogUrl =
    changelogPathname || docProps?.changelogUrl || "/changelog"

  const nameElement = linkifyPrimaryColumn ? (
    <Link
      render={<RenderLink href={`#${id || prop.name}`} />}
      style={{textDecoration: deprecated ? "line-through" : "unset"}}
      suppressHydrationWarning
    >
      {String(name)}
    </Link>
  ) : (
    <code className="qui-docs-code">{String(name)}</code>
  )

  return (
    <div className="doc-props-item__name">
      <div className="doc-props-item__label">
        {nameElement}
        {required ? (
          <div className="doc-props-item__required-indicator">
            <sup>*</sup>
          </div>
        ) : null}
        {deprecated ? (
          <div className="doc-props-item__deprecated-indicator">
            <sup>*</sup>
          </div>
        ) : null}
      </div>
      {isTwoWayBindingProperty ? (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Icon icon={Info} size="xs" />
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              This property supports two-way binding
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      ) : null}

      {sinceText ? (
        changelogPathname === null ? (
          <div className="doc-props__since">{sinceText}</div>
        ) : (
          <Link
            className="doc-props__since"
            emphasis="neutral"
            render={
              <RenderLink href={formatSinceUrl(changelogUrl, sinceText)} />
            }
          >
            {sinceText}
          </Link>
        )
      ) : null}
    </div>
  )
}
