import {useMemo, useState} from "react"

import type {DiscriminatorObject, SchemaObject} from "../../types"

export type CompositionKeyword = "oneOf" | "anyOf" | "allOf"

export interface SchemaCompositionProps {
  breadcrumb?: string[]
  compact?: boolean
  composition: CompositionKeyword
  discriminator?: DiscriminatorObject
  hideHeading?: boolean
  level: number
  name?: string
  schema: SchemaObject
}

interface ListboxOption {
  id: string
  label: string
}

function getSchemaType(schema: SchemaObject): string {
  if (schema["x-model-name"]) {
    return schema["x-model-name"]
  }
  if (schema.title) {
    return schema.title
  }
  if (schema.type) {
    return Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type
  }
  return "Schema"
}

/**
 * Converts camelCase composition keywords to readable format.
 * oneOf -> "One of", anyOf -> "Any of", allOf -> "All of"
 */
function humanizeType(compositionType: CompositionKeyword): string {
  return compositionType
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^(\w)/, (c) => c.toUpperCase())
}

/**
 * Merges allOf schemas into a single schema by combining properties.
 */
function mergeAllOfSchemas(schema: SchemaObject): SchemaObject {
  if (!schema.allOf) {
    return schema
  }

  const merged: SchemaObject = {properties: {}, type: "object"}

  for (const subSchema of schema.allOf) {
    if (subSchema.properties) {
      merged.properties = {...merged.properties, ...subSchema.properties}
    }
    if (subSchema.type && !merged.type) {
      merged.type = subSchema.type
    }
  }

  return merged
}

export function SchemaComposition({
  breadcrumb,
  compact = false,
  composition,
  discriminator,
  hideHeading = false,
  level,
  name,
  schema,
}: SchemaCompositionProps) {
  const compositionSchemas = useMemo(() => {
    const schemas = schema[composition]
    if (!schemas) {
      return []
    }
    return schemas.map((s: SchemaObject, index: number) => ({
      id: String(index),
      original: s,
      value: s,
    }))
  }, [schema, composition])

  const listboxOptions: ListboxOption[] = useMemo(
    () =>
      compositionSchemas.map(
        (
          s: {id: string; original: SchemaObject; value: SchemaObject},
          index: number,
        ) => ({
          id: String(index),
          label: getSchemaType(s.original) || "Schema",
        }),
      ),
    [compositionSchemas],
  )

  const [selectedId, setSelectedId] = useState<string>(
    listboxOptions[0]?.id ?? "0",
  )

  const selectedComposition = useMemo(
    () => compositionSchemas[Number(selectedId)]?.value,
    [compositionSchemas, selectedId],
  )

  const selectedOption = listboxOptions.find((opt) => opt.id === selectedId)

  // For allOf, we merge all schemas into one
  if (composition === "allOf") {
    return (
      <div className="openapi-schema-composition">
        <Schema
          breadcrumb={breadcrumb}
          compact={compact}
          discriminator={discriminator}
          hideHeading={hideHeading}
          level={level}
          name={name}
          noncollapsible
          schema={mergeAllOfSchemas(schema)}
        />
      </div>
    )
  }

  return (
    <div className="openapi-schema-composition">
      <div className="openapi-schema-composition__selector">
        <button
          className="openapi-schema-composition__button"
          type="button"
          aria-haspopup="listbox"
        >
          <span className="openapi-schema-composition__type">
            {humanizeType(composition)}
          </span>
          <span
            className="openapi-schema-composition__label"
            data-deprecated={selectedComposition?.deprecated || undefined}
          >
            {selectedOption?.label || "Schema"}
          </span>
          {selectedComposition?.deprecated && (
            <span className="openapi-schema-composition__deprecated">
              deprecated
            </span>
          )}
          <CaretDownIcon />
        </button>

        <div
          className="openapi-schema-composition__dropdown"
          role="listbox"
          aria-label="Select schema variant"
        >
          {listboxOptions.map((option) => (
            <button
              key={option.id}
              className="openapi-schema-composition__option"
              role="option"
              aria-selected={option.id === selectedId}
              data-selected={option.id === selectedId || undefined}
              type="button"
              onClick={() => setSelectedId(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="openapi-schema-composition__panel">
        {selectedComposition && (
          <Schema
            breadcrumb={breadcrumb}
            compact={compact}
            discriminator={discriminator}
            hideHeading={hideHeading}
            level={level + 1}
            name={name}
            noncollapsible
            schema={selectedComposition}
          />
        )}
      </div>
    </div>
  )
}

function CaretDownIcon() {
  return (
    <svg
      className="openapi-schema-composition__caret"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

interface SchemaPlaceholderProps {
  breadcrumb?: string[]
  compact?: boolean
  discriminator?: DiscriminatorObject
  hideHeading?: boolean
  level: number
  name?: string
  noncollapsible?: boolean
  schema: SchemaObject
}

/**
 * Placeholder for the Schema component to handle circular dependency.
 * The actual Schema component will be imported and used at runtime.
 */
function Schema(props: SchemaPlaceholderProps) {
  return (
    <div className="openapi-schema" data-level={props.level}>
      {props.name && <span className="openapi-schema__name">{props.name}</span>}
      {props.schema.type && (
        <span className="openapi-schema__type">
          {Array.isArray(props.schema.type)
            ? props.schema.type.join(" | ")
            : props.schema.type}
        </span>
      )}
    </div>
  )
}
