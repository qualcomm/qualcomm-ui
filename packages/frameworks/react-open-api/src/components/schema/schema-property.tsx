import type {ReactNode} from "react"

import type {DiscriminatorObject, SchemaObject} from "../../types"

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
  const isDiscriminator = discriminator?.propertyName === name
  const hasEnum = Boolean(schema.enum && schema.enum.length > 0)

  return (
    <div
      className="openapi-schema-property"
      data-required={required || undefined}
      data-deprecated={schema.deprecated || undefined}
      data-variant={variant}
      data-level={level}
    >
      {!hideHeading && (
        <SchemaPropertyHeading
          value={schema}
          name={name}
          required={required}
          isDiscriminator={isDiscriminator}
          enum={hasEnum}
          additional={variant === "additionalProperties"}
          hideModelNames={hideModelNames}
        />
      )}

      {schema.description && (
        <p className="openapi-schema-property__description">
          {schema.description}
        </p>
      )}

      {children && (
        <div className="openapi-schema-property__children">{children}</div>
      )}
    </div>
  )
}
