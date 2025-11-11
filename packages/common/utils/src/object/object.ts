// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function compact<T extends Record<string, unknown> | undefined>(
  obj: T,
): T {
  if (!isPlainObject(obj) || obj === undefined) {
    return obj
  }
  const keys = Reflect.ownKeys(obj).filter((key) => typeof key === "string")
  const filtered: Partial<T> = {}
  for (const key of keys) {
    const value = (obj as any)[key]
    if (value !== undefined) {
      filtered[key as keyof T] = compact(value)
    }
  }
  return filtered as T
}

export function json(v: any): any {
  return JSON.parse(JSON.stringify(v))
}

function isPlainObject(v: any) {
  return v && typeof v === "object" && v.constructor === Object
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const filtered: Partial<T> = {}

  for (const key of keys) {
    const value = obj[key]
    if (value !== undefined) {
      filtered[key] = value
    }
  }

  return filtered as any
}

export type Dict = Record<string, any>

type StrictKeys<K extends (keyof T)[], T> = K extends (keyof T)[]
  ? [keyof T] extends [K[number]]
    ? unknown
    : `Missing required keys: ${Exclude<keyof T, K[number]>}`
  : never

export function createProps<T extends Record<never, never>>() {
  return <K extends (keyof T)[]>(...props: K & StrictKeys<K, T>): (keyof T)[] =>
    Array.from(new Set(props))
}

export function splitProps<T extends Dict, K extends keyof T = keyof T>(
  props: T,
  keys: K[],
): [Pick<T, K>, Omit<T, K>] {
  const result = {} as Pick<T, K>
  const rest = {} as Omit<T, K>
  const keySet = new Set(keys)

  for (const key in props) {
    if (keySet.has(key as unknown as K)) {
      ;(result as any)[key] = props[key]
    } else {
      // Type assertion needed because TypeScript can't infer that
      // key is not in K in this branch
      ;(rest as any)[key] = props[key]
    }
  }

  return [result, rest]
}

export const createSplitProps = <T extends Dict>(keys: (keyof T)[]) => {
  return function split<Props extends T>(props: Props) {
    return splitProps(props, keys) as [T, Omit<Props, keyof T>]
  }
}
