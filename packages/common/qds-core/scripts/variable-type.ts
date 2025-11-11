import type {LocalVariable} from "@figma/rest-api-spec"
import {kebabCase} from "change-case"

import type {TokenType} from "./token-types"

export function getVariableTypeFromName(name: string): TokenType | undefined {
  if (["measurement", "stroke"].some((part) => name.includes(part))) {
    return "dimension"
  }
  if (name.includes("opacity")) {
    return "number"
  }
  if (name.includes("color")) {
    return "color"
  }
  if (name.includes("font-family")) {
    return "fontFamily"
  }
  if (name.includes("font-weight")) {
    return "fontWeight"
  }
  if (name.includes("fontWidth") || name.includes("font-width")) {
    return "fontStretch"
  }
  if (name.includes("font-size")) {
    return "number"
  }
  if (name.includes("line-height")) {
    return "number"
  }
}

export function resolveTokenTypeFromVariable(
  variable: LocalVariable,
): TokenType {
  const variableName = kebabCase(variable.name)
  const typeFromName = getVariableTypeFromName(variableName)
  if (typeFromName) {
    return typeFromName
  }
  switch (variable.resolvedType) {
    case "BOOLEAN":
      return "boolean"
    case "COLOR":
      return "color"
    case "FLOAT":
      return "number"
    case "STRING":
      return "string"
  }
}
