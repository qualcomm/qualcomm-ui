export interface ReferenceObject {
  $$ref: string
  properties: Record<string, unknown>
  type: "object"
}

export interface ReferenceArray {
  items: ReferenceObject
  type: "array"
}

export function isReferenceObject(value: unknown): value is ReferenceObject {
  return !!(
    value &&
    typeof value === "object" &&
    "properties" in value &&
    "type" in value &&
    value.type === "object"
  )
}

export function isReferenceArray(value: unknown): value is ReferenceArray {
  return !!(
    value &&
    typeof value === "object" &&
    "type" in value &&
    value.type === "array" &&
    "items" in value
  )
}

export function getRefName(value: any) {
  let refName: string = ""
  if (isReferenceObject(value)) {
    refName = value.$$ref?.substring(value.$$ref?.lastIndexOf("/") + 1)
  } else if (isReferenceArray(value)) {
    refName = value.items.$$ref?.substring(
      value.items.$$ref?.lastIndexOf("/") + 1,
    )
  }

  return refName
}

export function getArrayType(value: any) {
  if (!value?.type) {
    return ""
  }
  return value.type === "string" ||
    value.type === "boolean" ||
    value.type === "integer" ||
    value.type === "null"
    ? value.type
    : ""
}
