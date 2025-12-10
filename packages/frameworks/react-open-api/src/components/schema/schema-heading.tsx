import type {SchemaObject} from "../../types"

export interface SchemaHeadingProps {
  name?: string
  value: SchemaObject
}

function isTypeObject(schema: SchemaObject): boolean {
  return (
    schema.type === "object" ||
    (Array.isArray(schema.type) && schema.type.includes("object")) ||
    Boolean(schema.properties) ||
    Boolean(schema.additionalProperties)
  )
}

function isArraySchema(schema: SchemaObject): boolean {
  return (
    schema.type === "array" ||
    (Array.isArray(schema.type) && schema.type.includes("array"))
  )
}

function getFailsafeType(value: SchemaObject): string {
  if ("type" in value && value.type) {
    return Array.isArray(value.type) ? value.type.join(" | ") : value.type
  }

  if (value.enum) {
    return "enum"
  }

  if (isArraySchema(value) && value.items) {
    return "array"
  }

  if (isTypeObject(value) && (value.properties || value.additionalProperties)) {
    return "object"
  }

  return "unknown"
}

export function SchemaHeading({name, value}: SchemaHeadingProps) {
  if (typeof value !== "object" || value === null) {
    return null
  }

  const typeIcon = isTypeObject(value)
    ? "{}"
    : isArraySchema(value)
      ? "[]"
      : value.enum
        ? "enum"
        : null

  const typeTitle =
    "type" in value && typeof value.type === "string"
      ? value.type
      : "type" in value && Array.isArray(value.type)
        ? value.type.join(" | ")
        : "unknown type"

  return (
    <span className="openapi-schema-heading">
      {typeIcon && (
        <span className="openapi-schema-heading__icon" title={typeTitle}>
          {typeIcon}
        </span>
      )}
      {name ? (
        <span className="openapi-schema-heading__name">{name}</span>
      ) : (
        getFailsafeType(value)
      )}
    </span>
  )
}
