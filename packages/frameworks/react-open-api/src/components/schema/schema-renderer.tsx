import {useMemo} from "react"

import {useOpenApiContext} from "../../context"
import type {OpenAPIV3_1, SchemaObject} from "../../types"
import {getRefName, isRef, resolveSchema} from "../../utils/resolve-ref"

import {SchemaObjectProperties} from "./schema-object-properties"
import {SchemaProperty} from "./schema-property"

export interface SchemaRendererProps {
  /**
   * Breadcrumb path for nested schemas.
   */
  breadcrumb?: string[]

  /**
   * Compact mode with less spacing.
   */
  compact?: boolean

  /**
   * Nesting level for indentation.
   */
  level?: number

  /**
   * Name to display for the schema.
   */
  name?: string

  /**
   * The schema to render.
   */
  schema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject | undefined
}

/**
 * Renders a schema, resolving $refs and displaying properties.
 */
export function SchemaRenderer({
  breadcrumb,
  compact = false,
  level = 0,
  name,
  schema,
}: SchemaRendererProps) {
  const {document} = useOpenApiContext()

  const resolvedSchema = useMemo(() => {
    if (!schema) {
      return undefined
    }
    if (!document) {
      // No document context, try to render as-is
      return isRef(schema) ? undefined : schema
    }
    return resolveSchema(schema, document)
  }, [schema, document])

  const schemaName = useMemo(() => {
    if (name) {
      return name
    }
    if (schema && isRef(schema)) {
      return getRefName(schema.$ref)
    }
    return undefined
  }, [name, schema])

  if (!resolvedSchema) {
    // Show ref name if we couldn't resolve
    if (schema && isRef(schema)) {
      return (
        <div className="openapi-schema-renderer openapi-schema-renderer--unresolved">
          <span className="openapi-schema-renderer__ref">{schema.$ref}</span>
        </div>
      )
    }
    return null
  }

  const hasProperties =
    resolvedSchema.properties || resolvedSchema.additionalProperties

  const isObject =
    resolvedSchema.type === "object" ||
    (Array.isArray(resolvedSchema.type) &&
      resolvedSchema.type.includes("object")) ||
    hasProperties

  const isArray =
    resolvedSchema.type === "array" ||
    (Array.isArray(resolvedSchema.type) && resolvedSchema.type.includes("array"))

  // For objects, render properties
  if (isObject && hasProperties) {
    return (
      <div className="openapi-schema-renderer">
        {schemaName && (
          <div className="openapi-schema-renderer__header">
            <span className="openapi-schema-renderer__name">{schemaName}</span>
            <span className="openapi-schema-renderer__type">object</span>
          </div>
        )}
        <div className="openapi-schema-renderer__properties">
          <SchemaObjectProperties
            schema={resolvedSchema}
            breadcrumb={breadcrumb}
            compact={compact}
            level={level}
          />
        </div>
      </div>
    )
  }

  // For arrays with items, render the items schema
  if (isArray && resolvedSchema.items) {
    const itemsSchema = document
      ? resolveSchema(
          resolvedSchema.items as
            | OpenAPIV3_1.SchemaObject
            | OpenAPIV3_1.ReferenceObject,
          document,
        )
      : (resolvedSchema.items as SchemaObject)

    return (
      <div className="openapi-schema-renderer">
        {schemaName && (
          <div className="openapi-schema-renderer__header">
            <span className="openapi-schema-renderer__name">{schemaName}</span>
            <span className="openapi-schema-renderer__type">array</span>
          </div>
        )}
        {itemsSchema && (
          <div className="openapi-schema-renderer__items">
            <SchemaRenderer
              schema={itemsSchema}
              breadcrumb={breadcrumb}
              compact={compact}
              level={level + 1}
            />
          </div>
        )}
      </div>
    )
  }

  // For simple types, use SchemaProperty
  return (
    <div className="openapi-schema-renderer">
      <SchemaProperty
        name={schemaName || ""}
        schema={resolvedSchema}
        breadcrumb={breadcrumb}
        compact={compact}
        level={level}
      />
    </div>
  )
}
