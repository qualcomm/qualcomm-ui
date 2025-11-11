// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {clsx} from "@qualcomm-ui/utils/clsx"
import {callAll} from "@qualcomm-ui/utils/functions"

interface Props {
  [key: string]: any
}

const CSS_REGEX = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g

/**
 * Converts a CSS text fragment (`"color:red; width:10px"`)
 * into a `{color:'red', width:'10px'}` object.
 */
function parseCssText(style: string): Record<string, string> {
  const out: Record<string, string> = {}
  let match: RegExpExecArray | null
  while ((match = CSS_REGEX.exec(style))) {
    out[match[1]] = match[2]
  }
  return out
}

function mergeStyle(
  a: Record<string, string> | string | undefined,
  b: Record<string, string> | string | undefined,
): Record<string, string> | string {
  if (typeof a === "string") {
    if (typeof b === "string") {
      return `${a};${b}`
    }
    a = parseCssText(a)
  } else if (typeof b === "string") {
    b = parseCssText(b)
  }
  return {...(a ?? {}), ...(b ?? {})}
}

/**
 * Construct the real resulting type so callers keep strong typing.
 */
export type MergeProps<T extends readonly Props[]> = T extends readonly [
  infer First extends Props,
  ...infer Rest extends readonly Props[],
]
  ? First & MergeProps<Rest>
  : {}

/**
 * Angular-friendly version of `mergeProps`.
 *
 * - Handlers (`on*`) are composed with `callAll`.
 * - `class` / `className` values are merged via `clsx`.
 * - `style` strings or objects are merged and normalised.
 */
export function mergeProps<T extends readonly Props[]>(
  ...sources: T
): MergeProps<T> {
  const result: Props = {}

  for (const current of sources) {
    if (!current) {
      continue
    }

    for (const key in current) {
      const prev: any = result[key]
      const next: any = current[key]

      if (prev !== undefined) {
        if (
          key.startsWith("on") &&
          typeof prev === "function" &&
          typeof next === "function"
        ) {
          result[key] = callAll(prev, next)
          continue
        }

        if (key === "class" || key === "className") {
          result[key] = clsx(prev, next)
          continue
        }

        if (key === "style") {
          result[key] = mergeStyle(prev, next)
          continue
        }
      }

      result[key] = next
    }
  }

  // Adapt the merged object to Angular-friendly prop names.
  return result as MergeProps<T>
}
