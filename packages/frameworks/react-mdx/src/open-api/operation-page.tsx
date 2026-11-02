// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {httpMethodBadges, PageHeader} from "@qualcomm-ui/react-mdx/docs-layout"
import {Badge} from "@qualcomm-ui/react/badge"

import {CodeSamplesPanel} from "./code-samples-panel.js"
import {type OpenApiParameter, Parameters} from "./parameters.js"
import {type OpenApiRequestBody, RequestBody} from "./request-body.js"
import {type OpenApiResponse, Responses} from "./responses.js"

export interface OpenApiOperationData {
  deprecated?: boolean
  description?: string
  method: string
  parameters: OpenApiParameter[]
  path: string
  requestBody?: OpenApiRequestBody
  responses?: Record<string, OpenApiResponse>
  servers: {url?: string}[]
  summary?: string
}

/**
 * @since next-release
 */
export interface OperationPageProps {
  loaderData: OpenApiOperationData | null
}

/**
 * Renders an OpenAPI operation from the data of the loader exported by
 * `@qualcomm-ui/docs-plugin/openapi`.
 *
 * @since next-release
 */
export function OperationPage({loaderData}: OperationPageProps): ReactNode {
  if (!loaderData) {
    return null
  }
  const {
    deprecated,
    description,
    method,
    parameters,
    path,
    requestBody,
    responses,
    summary,
  } = loaderData

  return (
    <div className="qui-docs-openapi__operation">
      <PageHeader>{summary ?? `${method.toUpperCase()} ${path}`}</PageHeader>

      <div className="qui-docs-openapi__endpoint">
        <Badge size="lg" {...httpMethodBadges[method]}>
          {method.toUpperCase()}
        </Badge>
        <code className="qui-docs-openapi__path">{path}</code>
        {deprecated ? <Badge size="lg">Deprecated</Badge> : null}
      </div>

      {description ? (
        <p className="qui-docs-openapi__description mdx">{description}</p>
      ) : null}

      <div className="qui-docs-openapi__columns">
        <div className="qui-docs-openapi__main">
          <Parameters parameters={parameters} />
          <RequestBody body={requestBody} />
          <Responses key={path + method} responses={responses} />
        </div>
        <CodeSamplesPanel operation={loaderData} />
      </div>
    </div>
  )
}
