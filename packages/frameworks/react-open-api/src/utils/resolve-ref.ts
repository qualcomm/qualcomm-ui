import type {OpenAPIV3_1} from "../types"

/**
 * Resolves a $ref string to the actual schema object from the document.
 * Supports local refs like "#/components/schemas/Pet".
 */
export function resolveRef<T = OpenAPIV3_1.SchemaObject>(
  ref: string,
  document: OpenAPIV3_1.Document,
): T | undefined {
  if (!ref.startsWith("#/")) {
    // External refs not supported
    return undefined
  }

  const path = ref.slice(2).split("/")
  let current: unknown = document

  for (const segment of path) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment]
    } else {
      return undefined
    }
  }

  return current as T
}

/**
 * Checks if an object is a reference object.
 */
export function isRef(
  obj: unknown,
): obj is OpenAPIV3_1.ReferenceObject {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "$ref" in obj &&
    typeof (obj as OpenAPIV3_1.ReferenceObject).$ref === "string"
  )
}

/**
 * Resolves a schema, handling $ref if present.
 */
export function resolveSchema(
  schema: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject | undefined,
  document: OpenAPIV3_1.Document,
): OpenAPIV3_1.SchemaObject | undefined {
  if (!schema) {
    return undefined
  }

  if (isRef(schema)) {
    return resolveRef<OpenAPIV3_1.SchemaObject>(schema.$ref, document)
  }

  return schema
}

/**
 * Gets the name from a $ref path.
 * "#/components/schemas/Pet" -> "Pet"
 */
export function getRefName(ref: string): string {
  const parts = ref.split("/")
  return parts[parts.length - 1] || ref
}
