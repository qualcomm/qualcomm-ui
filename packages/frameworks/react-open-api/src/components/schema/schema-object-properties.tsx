import type {DiscriminatorObject, SchemaObject} from "../../types"

import {SchemaProperty} from "./schema-property"

export interface SchemaObjectPropertiesProps {
  breadcrumb?: string[]
  compact?: boolean
  discriminator?: DiscriminatorObject
  hideHeading?: boolean
  hideModelNames?: boolean
  level?: number
  schema: SchemaObject
}

function isTypeObject(schema: SchemaObject): boolean {
  return (
    schema.type === "object" ||
    (Array.isArray(schema.type) && schema.type.includes("object")) ||
    Boolean(schema.properties) ||
    Boolean(schema.additionalProperties)
  )
}

/**
 * Sorts properties by required status first, then alphabetically.
 * Discriminator property is always placed first if present.
 */
function sortPropertyNames(
  schema: SchemaObject,
  discriminator?: DiscriminatorObject,
): string[] {
  const properties = schema.properties || {}
  const required = schema.required || []
  const propertyNames = Object.keys(properties)

  return propertyNames.sort((a, b) => {
    // Discriminator always first
    if (discriminator?.propertyName === a) {
      return -1
    }
    if (discriminator?.propertyName === b) {
      return 1
    }

    // Required properties before optional
    const aRequired = required.includes(a)
    const bRequired = required.includes(b)
    if (aRequired && !bRequired) {
      return -1
    }
    if (!aRequired && bRequired) {
      return 1
    }

    // Alphabetical
    return a.localeCompare(b)
  })
}

function getAdditionalPropertiesName(
  additionalProperties: boolean | SchemaObject,
): string {
  if (
    typeof additionalProperties === "object" &&
    typeof additionalProperties["x-additionalPropertiesName"] === "string" &&
    additionalProperties["x-additionalPropertiesName"].trim().length > 0
  ) {
    return additionalProperties["x-additionalPropertiesName"].trim()
  }

  return "propertyName"
}

/**
 * When additionalProperties is true or an empty object, it renders as { type: 'anything' }.
 */
function getAdditionalPropertiesValue(
  additionalProperties: boolean | SchemaObject,
): SchemaObject {
  if (
    additionalProperties === true ||
    (typeof additionalProperties === "object" &&
      Object.keys(additionalProperties).length === 0) ||
    typeof additionalProperties !== "object" ||
    !("type" in additionalProperties)
  ) {
    // "anything" is a custom type used by the UI to indicate any value is allowed
    return {
      type: "anything",
      ...(typeof additionalProperties === "object" ? additionalProperties : {}),
    } as SchemaObject
  }

  return additionalProperties
}

export function SchemaObjectProperties({
  breadcrumb,
  compact,
  discriminator,
  hideHeading,
  hideModelNames,
  level = 0,
  schema,
}: SchemaObjectPropertiesProps) {
  if (!isTypeObject(schema)) {
    return null
  }

  const sortedProperties = schema.properties
    ? sortPropertyNames(schema, discriminator)
    : []

  return (
    <>
      {schema.properties &&
        sortedProperties.map((property) => (
          <SchemaProperty
            key={property}
            breadcrumb={breadcrumb}
            compact={compact}
            discriminator={discriminator}
            hideHeading={hideHeading}
            hideModelNames={hideModelNames}
            level={level}
            name={property}
            required={schema.required?.includes(property)}
            schema={schema.properties![property]}
          />
        ))}

      {schema.patternProperties &&
        Object.entries(schema.patternProperties).map(([key, property]) => (
          <SchemaProperty
            key={key}
            breadcrumb={breadcrumb}
            compact={compact}
            discriminator={discriminator}
            hideHeading={hideHeading}
            hideModelNames={hideModelNames}
            level={level}
            name={key}
            schema={property as SchemaObject}
          />
        ))}

      {schema.additionalProperties && (
        <SchemaProperty
          breadcrumb={breadcrumb}
          compact={compact}
          discriminator={discriminator}
          hideHeading={hideHeading}
          hideModelNames={hideModelNames}
          level={level}
          name={getAdditionalPropertiesName(schema.additionalProperties)}
          noncollapsible
          schema={getAdditionalPropertiesValue(schema.additionalProperties)}
          variant="additionalProperties"
        />
      )}
    </>
  )
}
