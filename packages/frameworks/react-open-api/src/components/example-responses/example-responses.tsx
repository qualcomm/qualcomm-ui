import {useCallback, useMemo, useState} from "react"

import type {ResponseObject} from "../../types"

import {ExampleResponse} from "./example-response"

export interface ExampleResponsesProps {
  responses: Record<string, ResponseObject>
}

function getStatusCategory(
  status: string,
): "success" | "redirect" | "error" | "info" {
  const code = parseInt(status, 10)
  if (code >= 200 && code < 300) {
    return "success"
  }
  if (code >= 300 && code < 400) {
    return "redirect"
  }
  if (code >= 400) {
    return "error"
  }
  return "info"
}

export function ExampleResponses({responses}: ExampleResponsesProps) {
  const orderedStatusCodes = useMemo(
    () => Object.keys(responses || {}).sort(),
    [responses],
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showSchema, setShowSchema] = useState(false)

  const currentStatusCode = orderedStatusCodes[selectedIndex] || ""
  const currentResponse = responses[currentStatusCode]

  const currentContent = useMemo(() => {
    const content = currentResponse?.content
    if (!content) {
      return undefined
    }

    return (
      content["application/json"] ||
      content["application/xml"] ||
      content["text/plain"] ||
      content["text/html"] ||
      content["*/*"] ||
      Object.values(content)[0]
    )
  }, [currentResponse])

  const exampleKeys = useMemo(
    () => Object.keys(currentContent?.examples || {}),
    [currentContent],
  )

  const [selectedExampleKey, setSelectedExampleKey] = useState(
    exampleKeys[0] || "",
  )

  const currentExample = useMemo(() => {
    if (exampleKeys.length > 1 && selectedExampleKey) {
      return currentContent?.examples?.[selectedExampleKey]
    }
    if (currentContent?.examples) {
      return Object.values(currentContent.examples)[0]
    }
    return undefined
  }, [currentContent, exampleKeys, selectedExampleKey])

  const copyToClipboard = useCallback(() => {
    const content = currentContent?.example || currentExample?.value
    if (content && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(
        typeof content === "string"
          ? content
          : JSON.stringify(content, null, 2),
      )
    }
  }, [currentContent, currentExample])

  if (orderedStatusCodes.length === 0) {
    return null
  }

  return (
    <div className="openapi-example-responses" aria-label="Example Responses">
      <div className="openapi-example-responses__header">
        <div className="openapi-example-responses__tabs" role="tablist">
          {orderedStatusCodes.map((status, index) => (
            <button
              key={status}
              className="openapi-example-responses__tab"
              role="tab"
              aria-selected={index === selectedIndex}
              data-selected={index === selectedIndex || undefined}
              data-category={getStatusCategory(status)}
              type="button"
              onClick={() => setSelectedIndex(index)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="openapi-example-responses__actions">
          {(currentContent?.example || currentExample) && (
            <button
              className="openapi-example-responses__copy"
              type="button"
              onClick={copyToClipboard}
              aria-label="Copy to clipboard"
            >
              <ClipboardIcon />
            </button>
          )}

          {currentContent?.schema && (
            <label className="openapi-example-responses__schema-toggle">
              <input
                type="checkbox"
                checked={showSchema}
                onChange={(e) => setShowSchema(e.target.checked)}
              />
              <span>Show Schema</span>
            </label>
          )}
        </div>
      </div>

      <div className="openapi-example-responses__content" role="tabpanel">
        {showSchema && currentContent?.schema ? (
          <pre className="openapi-example-responses__schema">
            <code>{JSON.stringify(currentContent.schema, null, 2)}</code>
          </pre>
        ) : (
          <ExampleResponse response={currentContent} example={currentExample} />
        )}
      </div>

      {(currentResponse?.description || exampleKeys.length > 1) && (
        <div className="openapi-example-responses__footer">
          {currentResponse?.description && (
            <p className="openapi-example-responses__description">
              {currentResponse.description}
            </p>
          )}

          {exampleKeys.length > 1 && (
            <select
              className="openapi-example-responses__example-select"
              value={selectedExampleKey}
              onChange={(e) => setSelectedExampleKey(e.target.value)}
              aria-label="Select example"
            >
              {exampleKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  )
}

function ClipboardIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
