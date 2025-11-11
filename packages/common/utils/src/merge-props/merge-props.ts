// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {clsx} from "@qualcomm-ui/utils/clsx"
import {callAll} from "@qualcomm-ui/utils/functions"

interface Props {
  [key: string]: any
}

const CSS_REGEX = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g

const serialize = (style: string): Record<string, string> => {
  const res: Record<string, string> = {}
  let match: RegExpExecArray | null
  while ((match = CSS_REGEX.exec(style))) {
    res[match[1]] = match[2]!
  }
  return res
}

const css = (
  a: Record<string, string> | string | undefined,
  b: Record<string, string> | string | undefined,
): Record<string, string> | string => {
  if (typeof a === "string") {
    if (typeof b === "string") {
      return `${a};${b}`
    }
    a = serialize(a)
  } else if (typeof b === "string") {
    b = serialize(b)
  }
  return Object.assign({}, a ?? {}, b ?? {})
}

type MaybeProps = Props | undefined
type PropsArray = Array<MaybeProps>

type MergeProps<T extends PropsArray> = T extends readonly [
  infer First extends MaybeProps,
  ...infer Rest extends PropsArray,
]
  ? First & MergeProps<Rest>
  : {}

/**
 * Merges N objects of type `Props` into a single one. It provides specific
 * handling for certain keys such as event handlers, `className`, `class`, and
 * `style`. For event handlers starting with "on", it combines them into a single
 * callable function. For `className` and `class`, it merges them using a utility
 * for class names. For `style` strings or objects, it serializes and merges the
 * styles into a single object.
 */
export function mergeProps<T extends PropsArray>(...args: T): MergeProps<T> {
  const result: Props = {}

  for (const props of args) {
    if (!props) {
      continue
    }

    for (const key in props) {
      if (result[key] !== undefined) {
        if (
          key.startsWith("on") &&
          typeof result[key] === "function" &&
          typeof props[key] === "function"
        ) {
          result[key] = callAll(result[key], props[key])
          continue
        }

        if (key === "className" || key === "class") {
          result[key] = clsx(result[key], props[key])
          continue
        }

        if (key === "style") {
          result[key] = css(result[key], props[key])
          continue
        }
      }

      result[key] = props[key]
    }
  }

  return result as MergeProps<T>
}
