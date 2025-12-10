import {useCallback, useState} from "react"

export interface SchemaPropertyExamplesProps {
  example?: unknown
  examples?: Record<string, unknown>
}

function formatExample(value: unknown): string {
  if (value === null) {
    return "null"
  }

  if (value === undefined) {
    return "undefined"
  }

  if (typeof value === "object") {
    if (
      value &&
      "value" in value &&
      typeof (value as Record<string, unknown>).value !== "undefined"
    ) {
      return formatExample((value as Record<string, unknown>).value)
    }
    return JSON.stringify(value)
  }

  return String(value as string)
}

export function SchemaPropertyExamples({
  example,
  examples,
}: SchemaPropertyExamplesProps) {
  const [isHovered, setIsHovered] = useState(false)

  const copyToClipboard = useCallback((text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }, [])

  const exampleEntries = examples
    ? Object.entries(examples).map(([key, value]) => ({
        formatted: formatExample(value),
        key,
        value,
      }))
    : []

  const hasExamples =
    example !== undefined ||
    (examples &&
      typeof examples === "object" &&
      Object.keys(examples).length > 0)

  if (!hasExamples) {
    return null
  }

  const exampleCount = example ? 1 : exampleEntries.length
  const label = exampleCount === 1 ? "Example" : "Examples"

  return (
    <div
      className="openapi-schema-property-examples"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="openapi-schema-property-examples__label" type="button">
        <span>{label}</span>
      </button>

      {isHovered && (
        <div className="openapi-schema-property-examples__list">
          {example !== undefined && (
            <button
              className="openapi-schema-property-examples__item"
              type="button"
              onClick={() => copyToClipboard(formatExample(example))}
            >
              <span>{formatExample(example)}</span>
              <ClipboardIcon />
            </button>
          )}

          {exampleEntries.map(({formatted, key}) => (
            <button
              key={key}
              className="openapi-schema-property-examples__item"
              type="button"
              onClick={() => copyToClipboard(formatted)}
            >
              <span>{formatted}</span>
              <ClipboardIcon />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ClipboardIcon() {
  return (
    <svg
      className="openapi-schema-property-examples__icon"
      width="12"
      height="12"
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
