import {type ReactNode, useState} from "react"

import type {DiscriminatorObject, SchemaObject} from "../../types"

import {SchemaEnumValues} from "./schema-enum-values"
import {SchemaObjectProperties} from "./schema-object-properties"
import {SchemaPropertyHeading} from "./schema-property-heading"

export interface SchemaPropertyProps {
  breadcrumb?: string[]
  children?: ReactNode
  compact?: boolean
  discriminator?: DiscriminatorObject
  hideHeading?: boolean
  hideModelNames?: boolean
  level?: number
  name: string
  noncollapsible?: boolean
  required?: boolean
  schema: SchemaObject
  variant?: "default" | "additionalProperties"
}

function hasNestedProperties(schema: SchemaObject): boolean {
  return Boolean(
    schema.properties ||
      schema.additionalProperties ||
      (schema.type === "object" && !schema.enum),
  )
}

function hasArrayItems(schema: SchemaObject): boolean {
  return Boolean(
    (schema.type === "array" ||
      (Array.isArray(schema.type) && schema.type.includes("array"))) &&
      schema.items &&
      typeof schema.items === "object" &&
      (("properties" in schema.items && schema.items.properties) ||
        ("type" in schema.items && schema.items.type === "object")),
  )
}

export function SchemaProperty({
  breadcrumb,
  children,
  compact,
  discriminator,
  hideHeading,
  hideModelNames,
  level = 0,
  name,
  noncollapsible,
  required,
  schema,
  variant = "default",
}: SchemaPropertyProps) {
  const [showChildren, setShowChildren] = useState(false)
  const isDiscriminator = discriminator?.propertyName === name
  const hasEnum = Boolean(schema.enum && schema.enum.length > 0)
  const isNested = hasNestedProperties(schema) && !noncollapsible
  const isArrayWithObjects = hasArrayItems(schema) && !noncollapsible

  return (
    <div
      className="openapi-schema-property"
      data-required={required || undefined}
      data-deprecated={schema.deprecated || undefined}
      data-variant={variant}
      data-level={level}
    >
      {!hideHeading && (
        <div className="openapi-schema-property__heading-row">
          <SchemaPropertyHeading
            value={schema}
            name={name}
            required={required}
            isDiscriminator={isDiscriminator}
            enum={hasEnum}
            additional={variant === "additionalProperties"}
            hideModelNames={hideModelNames}
          />
          {(isNested || isArrayWithObjects) && (
            <button
              type="button"
              className="openapi-schema-property__toggle"
              onClick={() => setShowChildren(!showChildren)}
              aria-expanded={showChildren}
              aria-label={showChildren ? "Hide child attributes" : "Show child attributes"}
            >
              <ToggleIcon open={showChildren} />
            </button>
          )}
        </div>
      )}

      {schema.description && (
        <p className="openapi-schema-property__description">
          {schema.description}
        </p>
      )}

      {hasEnum && <SchemaEnumValues value={schema} />}

      {showChildren && isNested && (
        <div className="openapi-schema-property__nested">
          <SchemaObjectProperties
            schema={schema}
            breadcrumb={breadcrumb}
            compact={compact}
            discriminator={discriminator}
            level={level + 1}
            hideModelNames={hideModelNames}
          />
        </div>
      )}

      {showChildren && isArrayWithObjects && schema.items && (
        <div className="openapi-schema-property__nested">
          <SchemaObjectProperties
            schema={schema.items as SchemaObject}
            breadcrumb={breadcrumb}
            compact={compact}
            discriminator={discriminator}
            level={level + 1}
            hideModelNames={hideModelNames}
          />
        </div>
      )}

      {children && (
        <div className="openapi-schema-property__children">{children}</div>
      )}
    </div>
  )
}

function ToggleIcon({open}: {open: boolean}) {
  return (
    <svg
      className="openapi-schema-property__toggle-icon"
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
      <line x1="12" y1="5" x2="12" y2="19" />
      {!open && <line x1="5" y1="12" x2="19" y2="12" />}
    </svg>
  )
}
