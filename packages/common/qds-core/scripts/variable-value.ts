import type {LocalVariable, RGBA} from "@figma/rest-api-spec"

import {
  ALIAS_PATH_SEPARATOR,
  type ColorRawValue,
  type DimensionRawValue,
  type TokenType,
} from "./token-types"
import {isRgbValue, isVariableAlias} from "./utils"

function resolveColorValue(value: RGBA): ColorRawValue {
  return {
    alpha: value.a,
    colorSpace: "srgb",
    components: [value.r, value.g, value.b],
  }
}

/**
 * notes, re: fontSize. The value of this property MUST be a valid dimension value
 * or a reference to a dimension token.
 *
 * Our fontSize design tokens refer to a value of the `measurements` variable group,
 * which is not a valid dimension value. We do an extra resolution step in our style
 * dictionary transformer, but this is technically not valid DTCG format. We're
 * limited on the dev side until the variables are fixed in Figma.
 */
function toDimension(value: string | number): DimensionRawValue {
  return {
    unit: "px",
    value: typeof value === "string" ? parseFloat(value) : value,
  }
}

const fontWeights: Record<string, number> = {
  black: 900,
  bold: 700,
  extrablack: 950,
  extrabold: 800,
  extralight: 200,
  light: 300,
  medium: 500,
  regular: 400,
  semibold: 600,
  thin: 100,
  ultrablack: 950,
  ultrabold: 800,
  ultralight: 200,
} as const

export function resolveTokenValueFromVariable(
  variable: LocalVariable,
  type: TokenType,
  modeId: string,
  localVariables: {[id: string]: LocalVariable},
) {
  let value: any = variable.valuesByMode[modeId]

  if (
    typeof value === "number" &&
    variable.name.includes("opacity") &&
    value > 1
  ) {
    return value / 100
  }

  if (type === "dimension" && typeof value !== "object") {
    return toDimension(value)
  }

  if (typeof value === "object") {
    if (isVariableAlias(value)) {
      const aliasedVariable = localVariables[value.id]
      if (!aliasedVariable) {
        // unresolved alias: this is handled by the calling function
        return value
      }

      value = `{${aliasedVariable.name.replace(/\//g, ALIAS_PATH_SEPARATOR)}}`
    } else if (isRgbValue(value)) {
      // is rgba color variable.
      value = resolveColorValue(value)
    } else {
      throw new Error(`Format of variable value is invalid`)
    }
  }

  switch (type) {
    case "fontFamily":
      return [value]
    case "fontWeight":
      if (typeof value === "string") {
        return fontWeights[value.toLowerCase()] || value
      }
    default:
      return value
  }
}
