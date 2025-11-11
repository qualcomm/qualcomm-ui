import type {
  GetLocalVariablesResponse,
  LocalVariableCollection,
  RGBA,
  VariableAlias,
} from "@figma/rest-api-spec"
import {kebabCase} from "change-case"
import {oklch as toOklch} from "culori"
import {mkdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const styleOutputDir = resolve(__dirname, "../src/styles")

export type Brand = "qualcomm" | "snapdragon" | "dragonwing"
export type Theme = "light" | "dark"

export const brands: Brand[] = ["qualcomm", "snapdragon", "dragonwing"]
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
export const rgbaToOklch = (rgba: RGBA): string => {
  const {a = 1, b, g, r} = rgba

  // Basic range validation
  if (![r, g, b].every((c) => c >= 0 && c <= 255)) {
    throw new RangeError("RGB channels must be between 0 and 255")
  }
  if (a < 0 || a > 1) {
    throw new RangeError("Alpha channel must be between 0 and 1")
  }

  const {
    c = 0,
    h = 0,
    l = 0,
  } = toOklch({
    alpha: a !== 1 ? a : undefined,
    b,
    g,
    mode: "rgb",
    r,
  })

  return oklchToString({alpha: a === 1 ? undefined : a, c, h, l})
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
