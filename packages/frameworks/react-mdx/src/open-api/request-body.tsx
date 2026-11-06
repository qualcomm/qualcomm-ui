// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  MediaSchema,
  MediaTypePicker,
  type OpenApiContent,
  useMediaTypes,
} from "./media-content.js"

export interface OpenApiRequestBody {
  content?: OpenApiContent
  description?: string
  required?: boolean
}

export function RequestBody({body}: {body?: OpenApiRequestBody}): ReactNode {
  const mediaTypes = useMediaTypes(body?.content)
  if (!mediaTypes.groups.length) {
    return null
  }

  return (
    <section>
      <div className="qui-docs-openapi__section-header">
        <h2 className="mdx">
          Request body
          {body?.required ? (
            <span className="doc-props-item__required-indicator qui-docs-openapi__heading-required">
              *
            </span>
          ) : null}
        </h2>
        <MediaTypePicker state={mediaTypes} />
      </div>
      {body?.description ? (
        <p className="qui-docs-openapi__description mdx">{body.description}</p>
      ) : null}
      <div className="qui-docs-openapi__section-body">
        <MediaSchema group={mediaTypes.group} />
      </div>
    </section>
  )
}
