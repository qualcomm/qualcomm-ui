/**
 * See: https://github.com/style-dictionary/style-dictionary/issues/848#issuecomment-2855874849
 */
import type {RGBA} from "@figma/rest-api-spec"
import JSON5 from "json5"
import {readFile} from "node:fs/promises"
import {transformTypes} from "style-dictionary/enums"
import type {PlatformConfig} from "style-dictionary/types"
import {resolveReferences, usesReferences} from "style-dictionary/utils"
import {StyleDictionary} from "style-dictionary-utils"

import type {
  ColorRawValue,
  DimensionRawValue,
  DimensionValue,
} from "./token-types"
import {rgbaToOklch, toCssVar} from "./utils"

function isMeasurementAlias(value: unknown): value is string {
  return typeof value === "string" && value.includes("{measurements")
}

function isAlias(value: unknown): value is string {
  return (
    typeof value === "string" && value.startsWith("{") && value.endsWith("}")
  )
}

function getBasePxFontSize(config: PlatformConfig) {
  return config?.basePxFontSize || 16
}

function isUnitValue(
  obj: unknown,
): obj is {unit: string; value: string | number} {
  return obj
    ? typeof obj === "object" && "value" in obj && "unit" in obj
    : false
}

function formatUnitValue<T>(obj: T): string | number | T {
  if (!isUnitValue(obj)) {
    return obj
  }
  const {unit, value} = obj
  if (typeof unit !== "string") {
    return obj
  }
  return value === 0 || value === "0" ? value : `${value}${unit}`
}

export function registerCustomTransformsForDtcg({
  measurements,
}: {
  measurements: Record<string, DimensionRawValue>
}) {
  function transformColor(value: ColorRawValue) {
    const {alpha, colorSpace, components, hex} = value

    if (hex) {
      if (alpha) {
        const a = Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")
        return hex + a
      }
      return hex
    }

    if (colorSpace === "srgb" && components?.length === 3) {
      const [red, green, blue] = components
      if (red !== undefined && green !== undefined && blue !== undefined) {
        // TODO: remove cast
        return rgbaToOklch({a: alpha, b: blue, g: green, r: red} as RGBA)
      }
    }
    return value
  }

  StyleDictionary.registerTransform({
    filter: (token) =>
      token.$type === "color" &&
      token.$value &&
      typeof token.$value === "object",
    name: "web/flatten-properties-color",
    transform: (token) => transformColor(token.$value),
    transitive: false,
    type: transformTypes.value,
  })

  StyleDictionary.registerTransform({
    filter: (token) =>
      token.$type === "dimension" && typeof token.$value === "object",
    name: "web/flatten-properties-dimension",
    transform: (token) => {
      const {$value} = token
      return formatUnitValue($value)
    },
    transitive: true,
    type: transformTypes.value,
  })

  // fontFamily fallback to sans-serif to prevent FOUC on first load.
  StyleDictionary.registerTransform({
    filter: (token) => token.$type === "fontFamily",
    name: "web/font-family-fallback",
    transform: (token) => {
      const {$value} = token
      if (typeof $value === "string") {
        if ($value.includes("Mono")) {
          return `${$value}, monospace`
        } else {
          return `${$value}, sans-serif`
        }
      }
      return $value
    },
    type: transformTypes.value,
  })

  function resolveMeasurementValue(
    value: string | number | DimensionValue,
  ): string | number | null {
    // TODO: fix any type
    let result = value
    if (isUnitValue(value)) {
      if (`${value.value}`.includes("{measurements")) {
        const measurement = measurements[value.value]
        if (measurement) {
          result = formatUnitValue(measurement)
        }
      } else {
        result = formatUnitValue(value)
      }
    } else if (typeof result === "string" && result.includes("measurements")) {
      const measurement = measurements[result]
      if (measurement) {
        result = formatUnitValue(measurement)
      }
    }
    return typeof result === "object" ? null : result
  }

  StyleDictionary.registerTransform({
    filter: (token) => token.$type === "shadow",
    name: "web/expand-shadows",
    transform: (token) => {
      const {$value, original} = token
      const originalValue = original.$value
      const {blur, offsetX, offsetY, spread} = originalValue
      let color = originalValue.color
      if (color) {
        color = transformColor(originalValue.color.$value)
      }
      const resolvedBlur = resolveMeasurementValue(blur)
      const resolvedOffsetX = resolveMeasurementValue(offsetX)
      const resolvedOffsetY = resolveMeasurementValue(offsetY)
      const resolvedSpread = resolveMeasurementValue(spread)

      const values = [
        resolvedOffsetX,
        resolvedOffsetY,
        resolvedBlur,
        resolvedSpread,
        color,
      ]

      if (values.some((value) => value === null)) {
        return $value
      }
      return `${resolvedOffsetX} ${resolvedOffsetY} ${resolvedBlur} ${resolvedSpread} ${color}`
    },
    transitive: true,
    type: transformTypes.value,
  })

  StyleDictionary.registerTransform({
    filter: (token) => token.name.includes("opacity"),
    name: "web/transform-opacity",
    transform: (token) => {
      const {$value, original} = token
      const originalValue = original.$value
      if (isMeasurementAlias(originalValue) && measurements[originalValue]) {
        const measurementValue = measurements[originalValue].value
        return (
          (typeof measurementValue === "string"
            ? parseInt(measurementValue)
            : measurementValue) / 100
        )
      }
      return $value
    },
    transitive: true,
    type: transformTypes.value,
  })

  StyleDictionary.registerTransform({
    filter: (token) => token.$type === "typography",
    name: "web/flatten-properties-typography",
    transform: (token, platform) => {
      const {original} = token
      const {fontFamily, fontSize, fontWeight, lineHeight} = original.$value

      let flatFontSize = fontSize
      if (isUnitValue(fontSize)) {
        if (isMeasurementAlias(`${fontSize.value}`)) {
          const measurement = measurements[fontSize.value]
          if (measurement) {
            flatFontSize = formatUnitValue(measurement)
          }
        } else {
          flatFontSize = formatUnitValue(fontSize)
        }
      } else if (isMeasurementAlias(fontSize)) {
        const measurement = measurements[fontSize]
        if (measurement) {
          flatFontSize = formatUnitValue(measurement)
        }
      }

      // replace measurements with inline sizes.
      let flatLineHeight = lineHeight
      if (isUnitValue(lineHeight)) {
        if (`${lineHeight.value}`.includes("{measurements")) {
          const measurement = measurements[lineHeight.value]
          if (measurement) {
            flatLineHeight = formatUnitValue(measurement)
          }
        } else {
          flatLineHeight = formatUnitValue(lineHeight)
        }
      } else if (
        typeof flatLineHeight === "string" &&
        flatLineHeight.includes("measurements")
      ) {
        const measurement = measurements[flatLineHeight]
        if (measurement) {
          flatLineHeight = formatUnitValue(measurement)
        }
      }

      let resolvedFontWeight = fontWeight
      if (isAlias(fontWeight)) {
        resolvedFontWeight = toCssVar(
          fontWeight.substring(1, fontWeight.length - 1),
        )
      }

      let resolvedFontFamily = fontFamily
      if (isAlias(fontFamily)) {
        resolvedFontFamily = toCssVar(
          fontFamily.substring(1, fontFamily.length - 1),
        )
      } else if (Array.isArray(fontFamily)) {
        resolvedFontFamily = fontFamily.map((familyStr) => {
          if (isAlias(familyStr)) {
            return toCssVar(familyStr.substring(1, familyStr.length - 1))
          }
          return familyStr
        })
      }

      const typographyCssShorthand = `${resolvedFontWeight ? `${resolvedFontWeight} ` : ""}${
        flatFontSize ? `${flatFontSize} ` : `${getBasePxFontSize(platform)}px `
      }${flatLineHeight ? `/ ${flatLineHeight} ` : " "}${resolvedFontFamily}`

      // console.debug(typographyCssShorthand)

      return typographyCssShorthand
    },
    transitive: true,
    type: transformTypes.value,
  })

  StyleDictionary.registerTransform({
    filter: (token) => token.$type === "border",
    name: "web/flatten-properties-border",
    transform: async (token) => {
      const {$type, $value, original} = token
      if (!$value || $type !== "border") {
        return undefined
      }

      const dictionary = JSON5.parse(await readFile(token.filePath, "utf8"))
      const {width} = original.$value
      if (!width) {
        return undefined
      }

      const resolveIfReference = (value: string) =>
        usesReferences(value)
          ? resolveReferences(value, dictionary, {usesDtcg: true})
          : value
      const flattenWidth = formatUnitValue(resolveIfReference(width))

      if ($value.includes("[object Object]")) {
        const op = $value.split("[object Object] ")
        return `${flattenWidth}${op.join(" ")}`
      }

      return $value
    },
    transitive: true,
    type: transformTypes.value,
  })

  StyleDictionary.registerTransformGroup({
    name: "custom/css-extended",
    transforms: [
      ...StyleDictionary.hooks.transformGroups.css,
      "web/transform-opacity",
      "web/expand-shadows",
      "web/font-family-fallback",
      "web/flatten-properties-color",
      "web/flatten-properties-dimension",
      "web/flatten-properties-typography",
      "web/flatten-properties-border",
    ],
  })
}
