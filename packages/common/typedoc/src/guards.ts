// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSONOutput} from "typedoc"

import type {SerializedType} from "@qualcomm-ui/typedoc-common"

export function isReferenceType(
  type: JSONOutput.SomeType | undefined,
): type is JSONOutput.ReferenceType {
  if (!type) {
    return false
  }
  return type.type === "reference"
}

export function isArrayType(
  type: JSONOutput.SomeType | undefined,
): type is JSONOutput.ArrayType {
  return type?.type === "array"
}

export function isReflectionType(
  type: JSONOutput.SomeType | undefined,
): type is JSONOutput.ReflectionType {
  return type?.type === "reflection"
}

export function isUnionType(
  type: JSONOutput.SomeType | undefined,
): type is JSONOutput.UnionType {
  return type?.type === "union"
}

export function isUndefinedType(
  type: JSONOutput.SomeType | undefined,
): type is JSONOutput.IntrinsicType {
  return type?.type === "intrinsic" && type?.name === "undefined"
}

export function getTypeFromProperties(
  properties: SerializedType["properties"],
) {
  if (!properties?.length) {
    return ""
  }
  return properties
    .filter((property) => property.name && property.type)
    .map((property) => {
      return `${property.name}${property.required ? "" : "?"}: ${
        property.inheritDoc
          ? property.type
          : (property.referencedType ?? property.type)
      };`
    })
    .join(" ")
}

export function isInputSignal(typeName: string | null | undefined) {
  return typeName && typeName.startsWith("InputSignal")
}

export function isModelSignal(typeName: string | null | undefined) {
  return typeName && typeName.startsWith("ModelSignal")
}

export function isOutputSignal(typeName: string | null | undefined) {
  return typeName && typeName.startsWith("OutputEmitterRef")
}

export function isTypeOverride(comment: JSONOutput.Comment | undefined) {
  const customTypeOverride = (comment ?? {blockTags: []}).blockTags?.find(
    (tag) => tag.tag === "@custom",
  )

  if (customTypeOverride) {
    return customTypeOverride.content[0].text
  }

  return ""
}
