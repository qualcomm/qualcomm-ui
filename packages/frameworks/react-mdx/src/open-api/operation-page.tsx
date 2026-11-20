// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import type {Root} from "hast"

import {HttpMethod, PageHeader} from "@qualcomm-ui/react-mdx/docs-layout"
import {NotFound} from "@qualcomm-ui/react-mdx/not-found"
import {Badge} from "@qualcomm-ui/react/badge"

import {CodeSamplesPanel} from "./code-samples-panel.js"
import {Description} from "./description.js"
import {omitDirectionalOperation} from "./directional-schema.js"
import {normalizeOperation} from "./normalize-schema.js"
import {type OpenApiParameter, Parameters} from "./parameters.js"
import {type OpenApiRequestBody, RequestBody} from "./request-body.js"
import {type OpenApiResponse, Responses} from "./responses.js"

export interface OpenApiOperationData {
  deprecated?: boolean
  description?: Root
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

function Endpoint({
  badgeSize,
  deprecated,
  method,
  path,
}: Pick<OpenApiOperationData, "deprecated" | "method" | "path"> & {
  badgeSize: "md" | "lg"
}): ReactNode {
  return (
    <>
      <HttpMethod method={method} />
      <code className="qui-docs-openapi__path">
        {path.split(/(\{[^}]+\})/).map((segment, index) =>
          index % 2 ? (
            <span key={index} className="qui-docs-openapi__path-param">
              {segment}
            </span>
          ) : (
            segment
          ),
        )}
      </code>
      {deprecated ? <Badge size={badgeSize}>Deprecated</Badge> : null}
    </>
  )
}

/**
 * Renders an OpenAPI operation from the data of the loader exported by
 * `@qualcomm-ui/docs-plugin/openapi`.
 *
 * @since next-release
 */
export function OperationPage({loaderData}: OperationPageProps): ReactNode {
  const operation = useMemo(
    () =>
      loaderData && omitDirectionalOperation(normalizeOperation(loaderData)),
    [loaderData],
  )
  if (!operation) {
    return <NotFound />
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
  } = operation

  return (
    <div className="qui-docs-openapi__operation">
      {summary ? (
        <>
          <PageHeader>{summary}</PageHeader>
          <div className="qui-docs-openapi__endpoint">
            <Endpoint
              badgeSize="md"
              deprecated={deprecated}
              method={method}
              path={path}
            />
          </div>
        </>
      ) : (
        <PageHeader className="qui-docs-openapi__endpoint-title">
          <Endpoint
            badgeSize="lg"
            deprecated={deprecated}
            method={method}
            path={path}
          />
        </PageHeader>
      )}

      {description ? (
        <div className="qui-docs-openapi__description">
          <Description tree={description} />
        </div>
      ) : null}

      <div className="qui-docs-openapi__columns">
        <div className="qui-docs-openapi__main">
          <Parameters parameters={parameters} />
          <RequestBody body={requestBody} />
          <Responses key={path + method} responses={responses} />
        </div>
        <CodeSamplesPanel operation={operation} />
      </div>
    </div>
  )
}
