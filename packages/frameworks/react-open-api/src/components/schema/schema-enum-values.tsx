import {useMemo, useState} from "react"

import type {SchemaObject} from "../../types"

import {SchemaEnumPropertyItem} from "./schema-enum-property-item"

export interface SchemaEnumValuesProps {
  value: SchemaObject | undefined
}

const ENUM_DISPLAY_THRESHOLD = 9
const INITIAL_VISIBLE_COUNT = 5
const THIN_SPACE = "\u2009"

export function SchemaEnumValues({value}: SchemaEnumValuesProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const enumValues = useMemo(() => {
    if (!value) {
      return []
    }
    return value.enum || value.items?.enum || []
  }, [value])

  const shouldUseLongListDisplay = enumValues.length > ENUM_DISPLAY_THRESHOLD

  const initialVisibleCount = shouldUseLongListDisplay
    ? INITIAL_VISIBLE_COUNT
    : enumValues.length

  const visibleEnumValues = enumValues.slice(0, initialVisibleCount)
  const hiddenEnumValues = enumValues.slice(initialVisibleCount)

  const getEnumValueDescription = (
    enumValue: unknown,
    index: number,
  ): string | undefined => {
    const descriptions =
      value?.["x-enumDescriptions"] ?? value?.["x-enum-descriptions"]

    if (!descriptions) {
      return undefined
    }

    if (Array.isArray(descriptions)) {
      return descriptions[index]
    }

    if (typeof descriptions === "object" && descriptions !== null) {
      return descriptions[String(enumValue)]
    }

    return undefined
  }

  const formatEnumValueWithName = (
    enumValue: unknown,
    index: number,
  ): string => {
    const varNames = value?.["x-enum-varnames"] ?? value?.["x-enumNames"]
    const varName = Array.isArray(varNames) ? varNames[index] : undefined
    return varName
      ? `${enumValue}${THIN_SPACE}=${THIN_SPACE}${varName}`
      : String(enumValue)
  }

  if (enumValues.length === 0) {
    return null
  }

  return (
    <div className="openapi-schema-enum">
      <ul className="openapi-schema-enum-values">
        {visibleEnumValues.map((enumValue: unknown, index: number) => (
          <SchemaEnumPropertyItem
            key={String(enumValue)}
            description={getEnumValueDescription(enumValue, index)}
            label={formatEnumValueWithName(enumValue, index)}
          />
        ))}

        {shouldUseLongListDisplay && isExpanded && (
          <>
            {hiddenEnumValues.map((enumValue: unknown, index: number) => (
              <SchemaEnumPropertyItem
                key={String(enumValue)}
                description={getEnumValueDescription(
                  enumValue,
                  initialVisibleCount + index,
                )}
                label={formatEnumValueWithName(
                  enumValue,
                  initialVisibleCount + index,
                )}
              />
            ))}
          </>
        )}

        {shouldUseLongListDisplay && (
          <li>
            <button
              className="openapi-schema-enum-toggle"
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <PlusIcon rotated={isExpanded} />
              {isExpanded ? "Hide values" : "Show all values"}
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

function PlusIcon({rotated}: {rotated: boolean}) {
  return (
    <svg
      className="openapi-schema-enum-toggle__icon"
      data-rotated={rotated || undefined}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
