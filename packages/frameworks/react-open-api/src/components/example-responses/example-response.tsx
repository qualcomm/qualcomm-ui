import {useMemo} from "react"

import type {ExampleObject, MediaTypeObject} from "../../types"

export interface ExampleResponseProps {
  example?: ExampleObject
  response?: MediaTypeObject
}

function prettyPrintJson(value: unknown): string {
  if (value === undefined || value === null) {
    return ""
  }

  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }

  return JSON.stringify(value, null, 2)
}

export function ExampleResponse({example, response}: ExampleResponseProps) {
  const content = useMemo(() => {
    if (example?.value !== undefined) {
      return prettyPrintJson(example.value)
    }

    if (response?.example !== undefined) {
      return prettyPrintJson(response.example)
    }

    if (response?.schema) {
      return prettyPrintJson(response.schema)
    }

    return ""
  }, [example, response])

  if (!content) {
    return <div className="openapi-example-response__empty">No Body</div>
  }

  return (
    <div className="openapi-example-response">
      <pre className="openapi-example-response__code">
        <code>{content}</code>
      </pre>
    </div>
  )
}
