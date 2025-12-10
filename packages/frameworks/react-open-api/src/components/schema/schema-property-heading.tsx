import {type ReactNode, useMemo} from "react"

import type {SchemaObject} from "../../types"
import {Badge} from "../badge"

import {RenderString} from "./render-string"
import {SchemaPropertyDetail} from "./schema-property-detail"
import {SchemaPropertyExamples} from "./schema-property-examples"

export interface SchemaPropertyHeadingProps {
  additional?: boolean
  enum?: boolean
  hideModelNames?: boolean
  isDiscriminator?: boolean
  name?: ReactNode
  required?: boolean
  value: SchemaObject | undefined
  withExamples?: boolean
}

interface ValidationProperty {
  code?: boolean
  key: string
  prefix?: string
  truncate?: boolean
  value: string | number
}

function isArraySchema(schema: SchemaObject): boolean {
  return (
    schema.type === "array" ||
    (Array.isArray(schema.type) && schema.type.includes("array"))
  )
}

function isStringSchema(schema: SchemaObject): boolean {
  return (
    schema.type === "string" ||
    (Array.isArray(schema.type) && schema.type.includes("string"))
  )
}

function isNumberSchema(schema: SchemaObject): boolean {
  return (
    schema.type === "number" ||
    schema.type === "integer" ||
    (Array.isArray(schema.type) &&
      (schema.type.includes("number") || schema.type.includes("integer")))
  )
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

function getSchemaType(schema: SchemaObject): string {
  if (schema.type) {
    return Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type
  }
  return "unknown"
}

function getModelName(
  schema: SchemaObject,
  hideModelNames: boolean,
): string | null {
  if (hideModelNames) {
    return null
  }
  return schema["x-model-name"] || schema.title || null
}

function getConstValue(schema: SchemaObject): unknown | undefined {
  if (schema.const !== undefined) {
    return schema.const
  }

  if (schema.enum?.length === 1) {
    return schema.enum[0]
  }

  if (isArraySchema(schema) && schema.items) {
    if (isDefined(schema.items.const)) {
      return schema.items.const
    }
    if (schema.items.enum?.length === 1) {
      return schema.items.enum[0]
    }
  }

  return undefined
}

function getValidationProperties(schema: SchemaObject): ValidationProperty[] {
  const properties: ValidationProperty[] = []

  if (isArraySchema(schema)) {
    if (schema.minItems || schema.maxItems) {
      properties.push({
        key: "array-range",
        value: `${schema.minItems || ""}…${schema.maxItems || ""}`,
      })
    }

    if (schema.uniqueItems) {
      properties.push({
        key: "unique-items",
        value: "unique!",
      })
    }
  }

  if (isStringSchema(schema)) {
    if (schema.minLength) {
      properties.push({
        key: "min-length",
        prefix: "min length:",
        value: schema.minLength,
      })
    }

    if (schema.maxLength) {
      properties.push({
        key: "max-length",
        prefix: "max length:",
        value: schema.maxLength,
      })
    }

    if (schema.pattern) {
      properties.push({
        code: true,
        key: "pattern",
        truncate: true,
        value: schema.pattern,
      })
    }
  }

  if (isStringSchema(schema) || isNumberSchema(schema)) {
    if (schema.format) {
      properties.push({
        key: "format",
        truncate: true,
        value: schema.format,
      })
    }
  }

  if (isNumberSchema(schema)) {
    if (isDefined(schema.exclusiveMinimum)) {
      properties.push({
        key: "exclusive-minimum",
        prefix: "greater than:",
        value: schema.exclusiveMinimum,
      })
    }

    if (isDefined(schema.minimum)) {
      properties.push({
        key: "minimum",
        prefix: "min:",
        value: schema.minimum,
      })
    }

    if (isDefined(schema.exclusiveMaximum)) {
      properties.push({
        key: "exclusive-maximum",
        prefix: "less than:",
        value: schema.exclusiveMaximum,
      })
    }

    if (isDefined(schema.maximum)) {
      properties.push({
        key: "maximum",
        prefix: "max:",
        value: schema.maximum,
      })
    }

    if (isDefined(schema.multipleOf)) {
      properties.push({
        key: "multiple-of",
        prefix: "multiple of:",
        value: schema.multipleOf,
      })
    }
  }

  return properties
}

function flattenDefaultValue(
  value: SchemaObject | undefined,
): string | undefined {
  if (!value?.default) {
    return undefined
  }

  if (value.default === null) {
    return "null"
  }

  if (Array.isArray(value.default) && value.default.length === 1) {
    return String(value.default[0])
  }

  if (typeof value.default === "string") {
    return JSON.stringify(value.default)
  }

  if (Array.isArray(value.default) || typeof value.default === "object") {
    return JSON.stringify(value.default)
  }

  return String(value.default)
}

export function SchemaPropertyHeading({
  additional = false,
  enum: isEnum,
  hideModelNames = false,
  isDiscriminator = false,
  name,
  required = false,
  value,
  withExamples = true,
}: SchemaPropertyHeadingProps) {
  const constValue = useMemo(
    () => (value ? getConstValue(value) : undefined),
    [value],
  )
  const validationProperties = useMemo(
    () => (value ? getValidationProperties(value) : []),
    [value],
  )
  const modelName = useMemo(
    () => (value ? getModelName(value, hideModelNames) : null),
    [value, hideModelNames],
  )
  const flattenedDefaultValue = useMemo(
    () => flattenDefaultValue(value),
    [value],
  )

  const shouldShowType = useMemo(() => {
    if (!value || !("type" in value)) {
      return false
    }
    if (value.type === "array") {
      return true
    }
    return constValue === undefined
  }, [value, constValue])

  const displayType = useMemo(() => {
    if (!value) {
      return ""
    }
    return modelName || getSchemaType(value)
  }, [value, modelName])

  return (
    <div className="openapi-schema-property-heading">
      {name && (
        <div
          className="openapi-schema-property-heading__name"
          data-deprecated={value?.deprecated || undefined}
        >
          {name}
        </div>
      )}

      {isDiscriminator && (
        <div className="openapi-schema-property-heading__discriminator">
          Discriminator
        </div>
      )}

      {value && (
        <>
          {shouldShowType && (
            <SchemaPropertyDetail truncate>{displayType}</SchemaPropertyDetail>
          )}

          {validationProperties.map((property) => (
            <SchemaPropertyDetail
              key={property.key}
              code={property.code}
              truncate={property.truncate}
              prefix={property.prefix}
            >
              {property.value}
            </SchemaPropertyDetail>
          ))}

          {isEnum && <SchemaPropertyDetail>enum</SchemaPropertyDetail>}

          {flattenedDefaultValue !== undefined && (
            <SchemaPropertyDetail truncate prefix="default:">
              {flattenedDefaultValue}
            </SchemaPropertyDetail>
          )}
        </>
      )}

      {additional && (
        <div className="openapi-schema-property-heading__additional">
          {value?.["x-additionalPropertiesName"] || "additional properties"}
        </div>
      )}

      {value?.deprecated && (
        <div className="openapi-schema-property-heading__deprecated">
          <Badge variant="deprecated">deprecated</Badge>
        </div>
      )}

      {constValue !== undefined && (
        <div className="openapi-schema-property-heading__const">
          <SchemaPropertyDetail truncate prefix="const:">
            <RenderString value={constValue} />
          </SchemaPropertyDetail>
        </div>
      )}

      {constValue === undefined &&
        (value as SchemaObject)?.nullable === true && (
          <SchemaPropertyDetail>nullable</SchemaPropertyDetail>
        )}

      {value?.writeOnly && (
        <div className="openapi-schema-property-heading__write-only">
          write-only
        </div>
      )}

      {!value?.writeOnly && value?.readOnly && (
        <div className="openapi-schema-property-heading__read-only">
          read-only
        </div>
      )}

      {required && (
        <div className="openapi-schema-property-heading__required">
          required
        </div>
      )}

      {withExamples && (
        <SchemaPropertyExamples
          example={
            value?.example || (isArraySchema(value!) && value?.items?.example)
          }
          examples={value?.examples}
        />
      )}
    </div>
  )
}
