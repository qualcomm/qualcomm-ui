// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

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
  description?: string
}

/**
 * Every response as a row, collapsed to its status code and description. Rows
 * with a body expand into its schema.
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
  const header = (
    <>
      <code className="qui-docs-openapi__field-name">{code}</code>
      {description ? (
        <span className="qui-docs-openapi__response-description">
          {description}
        </span>
      ) : null}
    </>
  )
  return (
    <FieldRow
      accessory={hideMediaTypes ? null : <MediaTypePicker state={mediaTypes} />}
      header={header}
    >
      {mediaTypes.group ? <MediaSchema group={mediaTypes.group} /> : null}
    </FieldRow>
  )
}
