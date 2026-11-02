// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {MediaContent, type OpenApiContent} from "./media-content.js"

export interface OpenApiRequestBody {
  content?: OpenApiContent
  description?: string
  required?: boolean
}

export function RequestBody({body}: {body?: OpenApiRequestBody}): ReactNode {
  if (!Object.keys(body?.content ?? {}).length) {
    return null
  }

  return (
    <section>
      <h2 className="mdx">Request body</h2>
      {body?.description ? (
        <p className="qui-docs-openapi__description mdx">{body.description}</p>
      ) : null}
      <MediaContent content={body?.content} required={body?.required} />
    </section>
  )
}
