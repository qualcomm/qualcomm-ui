// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import type {Root} from "hast"
import type {Components} from "hast-util-to-jsx-runtime"

import {Description} from "./description.js"
import {FieldRow} from "./field-row.js"
import {
  groupMediaTypes,
  MediaSchema,
  MediaTypePicker,
  type OpenApiContent,
  useMediaTypes,
} from "./media-content.js"

export interface OpenApiResponse {
  content?: OpenApiContent
  description?: Root
}

/**
 * The row trigger is a button, so its summary keeps to phrasing content.
 */
const inlineComponents: Partial<Components> = {
  a: ({children}) => <>{children}</>,
  p: ({children}) => <>{children}</>,
}

/**
 * Splits a description into the row summary, its first paragraph, and the
 * remaining blocks.
 */
function splitDescription(tree: Root | undefined): {
  details: Root | null
  summary: Root | null
} {
  const blocks = (tree?.children ?? []).filter(
    (node) => node.type !== "text" || node.value.trim(),
  )
  const [first, ...rest] = blocks
  const hasSummary = first?.type === "element" && first.tagName === "p"
  const remaining = hasSummary ? rest : blocks
  return {
    details: remaining.length ? {children: remaining, type: "root"} : null,
    summary: hasSummary ? {children: [first], type: "root"} : null,
  }
}

/**
 * Every response as a row: its status code and the first paragraph of its
 * description, with the rest of the description below. Rows with a body expand
 * into its schema.
 */
export function Responses({
  responses,
}: {
  responses?: Record<string, OpenApiResponse>
}): ReactNode {
  const entries = Object.entries(responses ?? {})
  if (!entries.length) {
    return null
  }

  const labels = entries
    .map(([, {content}]) => groupMediaTypes(content))
    .filter((groups) => groups.length)
    .map((groups) =>
      groups.length === 1 ? groups[0].mediaTypes.join(", ") : null,
    )
  const sharedLabel =
    labels.length > 1 && labels.every((label) => label === labels[0])
      ? labels[0]
      : null

  return (
    <section>
      <div className="qui-docs-openapi__section-header">
        <h2 className="mdx">Responses</h2>
        {sharedLabel && sharedLabel !== "application/json" ? (
          <code className="qui-docs-openapi__media-types">{sharedLabel}</code>
        ) : null}
      </div>
      <div className="qui-docs-openapi__section-body">
        <div className="qui-docs-openapi__fields">
          {entries.map(([code, response]) => (
            <ResponseRow
              key={code}
              code={code}
              hideMediaTypes={Boolean(sharedLabel)}
              response={response}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ResponseRow({
  code,
  hideMediaTypes,
  response: {content, description},
}: {
  code: string
  hideMediaTypes: boolean
  response: OpenApiResponse
}): ReactNode {
  const mediaTypes = useMediaTypes(content)
  const {details, summary} = useMemo(
    () => splitDescription(description),
    [description],
  )
  const header = (
    <>
      <code className="qui-docs-openapi__field-name">{code}</code>
      {summary ? (
        <span className="qui-docs-openapi__response-description">
          <Description components={inlineComponents} tree={summary} />
        </span>
      ) : null}
    </>
  )
  const detailsBlock = details ? (
    <div className="qui-docs-openapi__description">
      <Description tree={details} />
    </div>
  ) : null
  return (
    <FieldRow
      accessory={hideMediaTypes ? null : <MediaTypePicker state={mediaTypes} />}
      details={detailsBlock}
      header={header}
    >
      {mediaTypes.group ? <MediaSchema group={mediaTypes.group} /> : null}
    </FieldRow>
  )
}
