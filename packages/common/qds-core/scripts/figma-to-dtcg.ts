import type {GetLocalVariablesResponse} from "@figma/rest-api-spec"
import {camelCase, kebabCase} from "change-case"
import {sortBy} from "lodash-es"

import type {
  ColorRawValue,
  DimensionValue,
  JsonTokenTree,
  JsonValue,
  ShadowToken,
  TokenSignature,
  TokenType,
  TypographyToken,
} from "./token-types"
import {isVariableAlias} from "./utils"
import {resolveTokenTypeFromVariable} from "./variable-type"
import {resolveTokenValueFromVariable} from "./variable-value"

interface TokenGroup {
  path: string[]
  values: Record<string, number | string>
}

function groupTokens(obj: Record<string, unknown>): TokenGroup[] {
  const groups: TokenGroup[] = []

  function findTypographyGroups(
    current: Record<string, unknown>,
    path: string[] = ["type"],
  ): void {
    const currentGroup: TokenGroup = {
      path: [...path],
      values: {},
    }

    let hasTokens = false

    for (const [key, value] of Object.entries(current)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const valueObj = value as Record<string, unknown>

        if (valueObj.$type) {
          // This is a token definition
          currentGroup.values[camelCase(key)] = valueObj?.$value as string
          hasTokens = true
        } else {
          // Check if this contains typography tokens deeper
          const deeperPath = [...path, key]
          findTypographyGroups(valueObj, deeperPath)
        }
      }
    }

    if (hasTokens) {
      groups.push(currentGroup)
    }
  }

  findTypographyGroups(obj)
  return groups
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown,
): void {
  const [head, ...tail] = path

  if (tail.length === 0) {
    obj[head] = value
    return
  }

  if (!obj[head] || typeof obj[head] !== "object" || Array.isArray(obj[head])) {
    obj[head] = {}
  }

  setNestedValue(obj[head] as Record<string, unknown>, tail, value)
}

function toDimension<T extends string | number | DimensionValue>(
  value: T,
): DimensionValue {
  if (typeof value === "number") {
    return {
      unit: "px",
      value,
    }
  } else if (typeof value === "string") {
    // is alias
    return value as DimensionValue
  }
  return value
}

function groupTypography(data: TokenData): Record<string, unknown> | undefined {
  const typographyTree = data.type
  if (!typographyTree) {
    return
  }

  const grouped = groupTokens(typographyTree)
    .map((group) => {
      const name = group.path.join("-")
      return {name, path: group.path, values: group.values}
    })
    .filter(
      ({name}) =>
        name.startsWith("type-static") || name.startsWith("type-dynamic"),
    )

  if (!grouped.length) {
    return
  }

  const result: Record<string, unknown> = {}

  for (const {path, values} of grouped) {
    const typographyToken: TypographyToken = {
      $type: "typography",
      $value: {
        fontFamily: (values.fontFamily as any) || undefined,
        fontSize: toDimension(values.fontSize),
        fontWeight: values.fontWeight || undefined,
        letterSpacing: toDimension(values.letterSpacing),
        lineHeight: toDimension(values.lineHeight),
      },
    }

    setNestedValue(result, ["font", ...path.slice(1)], typographyToken)
  }

  return result
}

function groupShadows(data: TokenData): Record<string, unknown> | undefined {
  const shadowTree = data.elevation
  if (!shadowTree) {
    return
  }

  const grouped = groupTokens(shadowTree).map((group) => {
    const name = group.path.join("-")
    return {name, path: group.path, values: group.values}
  })

  if (!grouped.length) {
    return
  }

  const result: Record<string, unknown> = {}

  for (const {path, values} of grouped) {
    const shadowToken: ShadowToken = {
      $type: "shadow",
      $value: {
        blur: toDimension(values.blur),
        color: {
          $type: "color",
          $value: values.color,
        } as unknown as ColorRawValue,
        offsetX: toDimension(values.positionX),
        offsetY: toDimension(values.positionY),
        spread: toDimension(values.spread),
      },
    }

    setNestedValue(result, path.slice(1), shadowToken)
  }

  return result
}

/**
 * Defines what we expect a Design Tokens file to look like in the codebase.
 *
 * Follow this discussion for updates: https://github.com/design-tokens/community-group/issues/210
 */
export type TokenData = {
  [key: string]: JsonTokenTree
}

/**
 * Transforms variables from the Figma REST API into the DTCG JSON format.
 *
 * @param localVariablesResponse
 */
export function tokenFilesFromLocalVariables(
  localVariablesResponse: GetLocalVariablesResponse,
): {
  [fileName: string]: TokenData
} {
  const tokenGroups: {
    [fileName: string]: TokenData
  } = {}
  const localVariableCollections =
    localVariablesResponse.meta.variableCollections
  const localVariables = localVariablesResponse.meta.variables

  for (const variable of sortBy(Object.values(localVariables), "name")) {
    // Skip remote variables because we only want to generate tokens for local
    // variables (only the variables present in the Figma file we're processing)
    if (variable.remote) {
      continue
    }

    const collection = localVariableCollections[variable.variableCollectionId]

    for (const mode of collection.modes) {
      const groupName = kebabCase(`${collection.name}-${mode.name}`)

      if (!tokenGroups[groupName]) {
        tokenGroups[groupName] = {}
      }

      let obj: Record<string, any> = tokenGroups[groupName]

      const type = resolveTokenTypeFromVariable(variable)

      const value = resolveTokenValueFromVariable(
        variable,
        type,
        mode.modeId,
        localVariables,
      )

      if (isVariableAlias(value)) {
        // value will only be a variable alias at this point if it's unresolved, so
        // we skip it.
        continue
      }

      if (
        variable.name.includes("opacity") &&
        collection.name.includes("Primitives")
      ) {
        // resolve opacity circular dependency
        for (const namePart of variable.name.split("/")) {
          const resolvedName =
            namePart === "opacity" ? "base-opacity" : namePart
          obj[resolvedName] = obj[resolvedName] || {}
          obj = obj[resolvedName]
        }
      } else {
        for (const namePart of variable.name.split("/")) {
          obj[namePart] = obj[namePart] || {}
          obj = obj[namePart]
        }
      }

      const isBrandOpacity =
        variable.name.includes("opacity") && collection.name.includes("Brand")

      const token: TokenSignature<TokenType, JsonValue> = {
        $description: variable.description || undefined,
        $type: type,
        $value: isBrandOpacity
          ? value.replace("{opacity.", "{base-opacity.")
          : value,
      }

      Object.assign(obj, token)
    }
  }

  for (const data of Object.values(tokenGroups)) {
    const typography = groupTypography(data)
    const shadows = groupShadows(data)
    if (typography) {
      Object.assign(data, typography)
    }
    if (shadows) {
      Object.assign(data, shadows)
    }
  }

  return tokenGroups
}
