import {type ReactNode, useId, useMemo, useState} from "react"

import type {OpenAPIV3_1, RequestBodyObject} from "../../types"
import {SchemaRenderer} from "../schema"

export interface RequestBodyProps {
  breadcrumb?: string[]
  requestBody: RequestBodyObject
  title?: ReactNode
}

export function RequestBody({
  breadcrumb,
  requestBody,
  title,
}: RequestBodyProps) {
  const id = useId()
  const contentTypes = useMemo(
    () => Object.keys(requestBody.content || {}),
    [requestBody],
  )

  const [selectedContentType, setSelectedContentType] = useState(
    contentTypes[0] || "",
  )

  const selectedContent = useMemo(
    () => requestBody.content?.[selectedContentType],
    [requestBody, selectedContentType],
  )

  if (!requestBody.content || contentTypes.length === 0) {
    return null
  }

  return (
    <div className="openapi-request-body">
      <div className="openapi-request-body__header">
        {title && (
          <div id={id} className="openapi-request-body__title">
            {title}
          </div>
        )}

        {contentTypes.length > 1 && (
          <select
            className="openapi-request-body__content-type"
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            aria-label="Content type"
          >
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        {contentTypes.length === 1 && (
          <span className="openapi-request-body__content-type-label">
            {selectedContentType}
          </span>
        )}
      </div>

      {requestBody.description && (
        <p className="openapi-request-body__description">
          {requestBody.description}
        </p>
      )}

      {selectedContent?.schema && (
        <div className="openapi-request-body__schema">
          <SchemaRenderer
            schema={selectedContent.schema as OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject}
            breadcrumb={breadcrumb}
          />
        </div>
      )}
    </div>
  )
}
