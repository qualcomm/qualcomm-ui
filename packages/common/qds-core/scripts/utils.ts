import type {
  GetLocalVariablesResponse,
  LocalVariableCollection,
  RGBA,
  VariableAlias,
} from "@figma/rest-api-spec"
import {mkdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {kebabCase} from "@qualcomm-ui/utils/change-case"

import type {TokenSignature} from "./token-types"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const styleOutputDir = resolve(__dirname, "../src/styles")

export type Brand =
  | "qualcomm"
  | "snapdragon"
  | "dragonwing"
  | "dragonfly"
  | "arduino"
export type Theme = "light" | "dark"

export const brands: Brand[] = [
  "qualcomm",
  "snapdragon",
  "dragonwing",
  "dragonfly",
  "arduino",
]
export const themes: Theme[] = ["light", "dark"]

type Oklch = Readonly<{alpha?: number; c: number; h: number; l: number}>

const isFiniteNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n)

const formatNumber = (value: number, precision: number): string =>
  !isFiniteNumber(value) ? "0" : Number(value.toFixed(precision)).toString()

/**
 * Convert an RGBA colour (0-255, alpha 0-1) to an `oklch(...)` CSS string.
 * Throws if any channel is out of range.
 */
export function rgbaToHex({a, b, g, r}: RGBA): string {
  const to8Bit = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255)
  const toHex = (v: number) => to8Bit(v).toString(16).padStart(2, "0")

  const hex = [r, g, b].map(toHex).join("")
  const alpha = to8Bit(a)

  return `#${hex}${alpha === 255 ? "" : alpha.toString(16).padStart(2, "0")}`
}

/**
 * Serialize an OKLCH object to an `oklch(...)` CSS string.
 */
export const oklchToString = ({alpha, c, h, l}: Oklch): string => {
  const parts = [formatNumber(l, 3), formatNumber(c, 3), formatNumber(h, 2)]

  const alphaPart =
    alpha === undefined ? "" : ` / ${formatNumber(alpha * 100, 2)}%`

  return `oklch(${parts.join(" ")}${alphaPart})`
}

export function isVariableAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" && !!value && "type" in value && "id" in value
  )
}

export function isRgbValue(value: unknown): value is RGBA {
  return (
    typeof value === "object" &&
    !!value &&
    "r" in value &&
    "g" in value &&
    "b" in value
  )
}

export function isScreenSizeCollection(
  collection: LocalVariableCollection | undefined,
) {
  return collection && collection.name.toLowerCase() === "screen size"
}

export function toCssVar(value: string): string {
  return `var(--${kebabCase(value)})`
}

export type Primitive = string | number | boolean

export async function updateFoundationsFile(
  response: GetLocalVariablesResponse,
) {
  await mkdir(resolve(__dirname, "./temp"), {recursive: true}).catch()
  return writeFile(
    resolve(__dirname, "./temp/foundations-variables-response.json"),
    JSON.stringify(response, null, 2),
    "utf-8",
  )
}

type NestedDict = {[key: string]: TokenSignature<any, any> | NestedDict}

interface FilterOptions {
  hoistKeys?: Set<string>
  keepPatterns: Set<string>
  parentKey?: string | null
}

function isTokenValue(obj: unknown): obj is TokenSignature<any, any> {
  return (
    typeof obj === "object" && obj !== null && "$type" in obj && "$value" in obj
  )
}

/**
 * Recursively filters a nested token dictionary, keeping only branches
 * that terminate in tokens matching `{parentKey}.{key}` patterns.
 *
 * @param obj - Nested dictionary to filter
 * @param options.keepPatterns - Patterns to match against final two keys before token (e.g., "default.line-height")
 * @param options.hoistKeys - Keys to remove, merging their children into the parent level
 * @param options.parentKey - Internal: tracks parent key during recursion
 * @returns Filtered dictionary or null if empty
 */
export function filterObject(
  obj: NestedDict,
  options: FilterOptions,
): NestedDict | null {
  const {hoistKeys = new Set(), keepPatterns, parentKey = null} = options
  const result: NestedDict = {}

  for (const [key, value] of Object.entries(obj)) {
    if (isTokenValue(value)) {
      const pattern = `${parentKey}.${key}`
      if (keepPatterns.has(pattern)) {
        result[key] = value
      }
    } else if (typeof value === "object" && value !== null) {
      const filtered = filterObject(value, {
        hoistKeys,
        keepPatterns,
        parentKey: key,
      })
      if (filtered) {
        if (hoistKeys.has(key)) {
          Object.assign(result, filtered)
        } else {
          result[key] = filtered
        }
      }
    }
  }

  return Object.keys(result).length > 0 ? result : null
}
