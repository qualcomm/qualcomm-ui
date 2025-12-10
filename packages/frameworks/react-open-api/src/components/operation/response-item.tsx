import {useMemo, useState} from "react"

import type {ResponseObject} from "../../types"

export interface ResponseItemProps {
  breadcrumb?: string[]
  collapsable?: boolean
  response: ResponseObject
  status: string
}

function getStatusCategory(
  status: string,
): "success" | "redirect" | "client-error" | "server-error" | "info" {
  const code = parseInt(status, 10)
  if (code >= 200 && code < 300) {
    return "success"
  }
  if (code >= 300 && code < 400) {
    return "redirect"
  }
  if (code >= 400 && code < 500) {
    return "client-error"
  }
  if (code >= 500) {
    return "server-error"
  }
  return "info"
}

export function ResponseItem({
  breadcrumb,
  collapsable = true,
  response,
  status,
}: ResponseItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedContentType, setSelectedContentType] = useState<string>("")

  const contentTypes = useMemo(
    () => Object.keys(response.content || {}),
    [response],
  )

  const currentContentType = selectedContentType || contentTypes[0] || ""
  const selectedContent = response.content?.[currentContentType]
  const statusCategory = getStatusCategory(status)

  const hasContent = Boolean(
    response.content || response.headers || response.description,
  )

  if (collapsable && hasContent) {
    return (
      <li className="openapi-response-item">
        <button
          className="openapi-response-item__trigger"
          data-open={isOpen || undefined}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="openapi-response-item__status">
            <CaretIcon open={isOpen} />
            <span
              className="openapi-response-item__code"
              data-category={statusCategory}
            >
              {status}
            </span>
          </div>
          {!isOpen && response.description && (
            <span className="openapi-response-item__summary">
              {response.description}
            </span>
          )}
          {contentTypes.length > 1 && (
            <select
              className="openapi-response-item__content-type"
              value={currentContentType}
              onClick={(e) => e.stopPropagation()}
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
        </button>

        {isOpen && (
          <div className="openapi-response-item__content">
            {response.description && (
              <p className="openapi-response-item__description">
                {response.description}
              </p>
            )}
            {selectedContent?.schema && (
              <div className="openapi-response-item__schema">
                <pre>{JSON.stringify(selectedContent.schema, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </li>
    )
  }

  return (
    <li className="openapi-response-item">
      <div className="openapi-response-item__header">
        <span
          className="openapi-response-item__code"
          data-category={statusCategory}
        >
          {status}
        </span>
        {response.description && (
          <span className="openapi-response-item__description">
            {response.description}
          </span>
        )}
      </div>
    </li>
  )
}

function CaretIcon({open}: {open: boolean}) {
  return (
    <svg
      className="openapi-response-item__caret"
      data-open={open || undefined}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
