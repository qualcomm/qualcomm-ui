import type {ReactNode} from "react"

import type {
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
} from "../../types"
import {HttpMethod} from "../http-method"
import {
  Section,
  SectionColumn,
  SectionColumns,
  SectionContent,
  SectionHeader,
} from "../section"

import {OperationParameters} from "./operation-parameters"
import {OperationResponses} from "./operation-responses"

export interface OperationProps {
  breadcrumb?: string[]
  children?: ReactNode
  deprecated?: boolean
  description?: string
  id?: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"
  parameters?: ParameterObject[]
  path: string
  requestBody?: RequestBodyObject
  responses?: Record<string, ResponseObject>
  summary?: string
}

export function Operation({
  breadcrumb,
  children,
  deprecated,
  description,
  id,
  method,
  parameters,
  path,
  requestBody,
  responses,
  summary,
}: OperationProps) {
  return (
    <Section id={id}>
      <SectionHeader>
        <div
          className="openapi-operation__header"
          data-deprecated={deprecated || undefined}
        >
          <HttpMethod method={method} />
          <span className="openapi-operation__path">{path}</span>
        </div>
      </SectionHeader>

      <SectionContent>
        <SectionColumns>
          <SectionColumn>
            {summary && (
              <h3
                className="openapi-operation__summary"
                data-deprecated={deprecated || undefined}
              >
                {summary}
              </h3>
            )}

            {description && (
              <p className="openapi-operation__description">{description}</p>
            )}

            <OperationParameters
              parameters={parameters}
              requestBody={requestBody}
              breadcrumb={breadcrumb}
            />

            <OperationResponses responses={responses} breadcrumb={breadcrumb} />
          </SectionColumn>

          <SectionColumn>{children}</SectionColumn>
        </SectionColumns>
      </SectionContent>
    </Section>
  )
}
