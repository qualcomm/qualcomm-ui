import {useMemo} from "react"

import type {OpenAPIV3_1} from "../types"

export interface ParsedOperation {
  deprecated?: boolean
  description?: string
  id: string
  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head"
  operationId?: string
  parameters?: OpenAPIV3_1.ParameterObject[]
  path: string
  requestBody?: OpenAPIV3_1.RequestBodyObject
  responses?: Record<string, OpenAPIV3_1.ResponseObject>
  summary?: string
  tags?: string[]
}

export interface ParsedTag {
  description?: string
  name: string
  operations: ParsedOperation[]
}

export interface ParsedModel {
  name: string
  schema: OpenAPIV3_1.SchemaObject
}

export interface ParsedDocument {
  externalDocs?: OpenAPIV3_1.ExternalDocumentationObject
  info: OpenAPIV3_1.InfoObject
  models: ParsedModel[]
  servers?: OpenAPIV3_1.ServerObject[]
  tags: ParsedTag[]
}

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
] as const

/**
 * Parses an OpenAPI document into a structure optimized for rendering.
 */
export function useOpenApiDocument(
  document: OpenAPIV3_1.Document | undefined,
): ParsedDocument | null {
  return useMemo(() => {
    if (!document || !document.info) {
      return null
    }

    const operations: ParsedOperation[] = []
    const tagMap = new Map<string, ParsedTag>()

    // Initialize tags from document
    for (const tag of document.tags || []) {
      tagMap.set(tag.name, {
        description: tag.description,
        name: tag.name,
        operations: [],
      })
    }

    // Parse paths and operations
    for (const [path, pathItem] of Object.entries(document.paths || {})) {
      if (!pathItem) {
        continue
      }

      for (const method of HTTP_METHODS) {
        const operation = pathItem[method]
        if (!operation) {
          continue
        }

        const parsed: ParsedOperation = {
          deprecated: operation.deprecated,
          description: operation.description,
          id: operation.operationId || `${method}-${path}`,
          method,
          operationId: operation.operationId,
          parameters: resolveParameters(
            operation.parameters,
            pathItem.parameters,
          ),
          path,
          requestBody: operation.requestBody as
            | OpenAPIV3_1.RequestBodyObject
            | undefined,
          responses: operation.responses as
            | Record<string, OpenAPIV3_1.ResponseObject>
            | undefined,
          summary: operation.summary,
          tags: operation.tags,
        }

        operations.push(parsed)

        // Group by tags
        const opTags = operation.tags?.length ? operation.tags : ["default"]
        for (const tagName of opTags) {
          if (!tagMap.has(tagName)) {
            tagMap.set(tagName, {
              description: undefined,
              name: tagName,
              operations: [],
            })
          }
          tagMap.get(tagName)!.operations.push(parsed)
        }
      }
    }

    // Parse models from components/schemas
    const models: ParsedModel[] = []
    if (document.components?.schemas) {
      for (const [name, schema] of Object.entries(
        document.components.schemas,
      )) {
        if (schema && !("$ref" in schema)) {
          models.push({
            name,
            schema: schema as OpenAPIV3_1.SchemaObject,
          })
        }
      }
    }

    return {
      externalDocs: document.externalDocs,
      info: document.info,
      models,
      servers: document.servers,
      tags: Array.from(tagMap.values()).filter(
        (tag) => tag.operations.length > 0,
      ),
    }
  }, [document])
}

function resolveParameters(
  operationParams?: (
    | OpenAPIV3_1.ParameterObject
    | OpenAPIV3_1.ReferenceObject
  )[],
  pathParams?: (OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject)[],
): OpenAPIV3_1.ParameterObject[] {
  const params: OpenAPIV3_1.ParameterObject[] = []
  const seen = new Set<string>()

  // Operation params override path params
  for (const param of operationParams || []) {
    if ("$ref" in param) {
      continue
    }
    const key = `${param.in}-${param.name}`
    if (!seen.has(key)) {
      seen.add(key)
      params.push(param)
    }
  }

  for (const param of pathParams || []) {
    if ("$ref" in param) {
      continue
    }
    const key = `${param.in}-${param.name}`
    if (!seen.has(key)) {
      seen.add(key)
      params.push(param)
    }
  }

  return params
}
