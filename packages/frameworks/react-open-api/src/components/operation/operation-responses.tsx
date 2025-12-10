import {useMemo} from "react"

import type {ResponseObject} from "../../types"

import {ResponseItem} from "./response-item"

export interface OperationResponsesProps {
  breadcrumb?: string[]
  collapsable?: boolean
  responses?: Record<string, ResponseObject>
}

export function OperationResponses({
  breadcrumb,
  collapsable = true,
  responses,
}: OperationResponsesProps) {
  const responseEntries = useMemo(
    () => Object.entries(responses || {}),
    [responses],
  )

  if (responseEntries.length === 0) {
    return null
  }

  return (
    <div className="openapi-operation-responses">
      <div className="openapi-operation-responses__title">Responses</div>
      <ul className="openapi-operation-responses__list" aria-label="Responses">
        {responseEntries.map(([status, response]) => (
          <ResponseItem
            key={status}
            status={status}
            response={response}
            breadcrumb={breadcrumb}
            collapsable={collapsable}
          />
        ))}
      </ul>
    </div>
  )
}
