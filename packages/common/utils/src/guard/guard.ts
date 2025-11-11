// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>

export type AnyFunction = (...args: any[]) => any

export type MaybeFn<T> = T | (() => T)

/**
 * Makes all properties in T required while preserving their original types,
 * including undefined. Useful for ensuring that all properties are supplied to an
 * interface even if they are optional.
 */
export type Explicit<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export function isDev(): boolean {
  return process.env.NODE_ENV !== "production"
}

export function isArray(v: any): v is any[] {
  return Array.isArray(v)
}

export function isBoolean(v: any): v is boolean {
  return v === true || v === false
}

export function isObjectLike(v: any): v is Record<string, any> {
  return v != null && typeof v === "object"
}

export function isObject(v: any): v is Record<string, any> {
  return isObjectLike(v) && !isArray(v)
}

export function isNumber(v: any): v is number {
  return typeof v === "number" && !Number.isNaN(v)
}

export function isString(v: any): v is string {
  return typeof v === "string"
}

export function isFunction(v: any): v is AnyFunction {
  return typeof v === "function"
}

export function isNull(v: any): v is null | undefined {
  return v == null
}

export const hasProp = <T extends string>(
  obj: any,
  prop: T,
): obj is Record<T, any> => Object.prototype.hasOwnProperty.call(obj, prop)

function baseGetTag(v: any) {
  return Object.prototype.toString.call(v)
}

const fnToString = Function.prototype.toString
const objectCtorString = fnToString.call(Object)

export function isPlainObject(v: any): boolean {
  // eslint-disable-next-line eqeqeq
  if (!isObjectLike(v) || baseGetTag(v) != "[object Object]") {
    return false
  }
  const proto = Object.getPrototypeOf(v)
  if (proto === null) {
    return true
  }
  const Ctor = hasProp(proto, "constructor") && proto.constructor
  return (
    typeof Ctor === "function" &&
    Ctor instanceof Ctor &&
    // eslint-disable-next-line eqeqeq
    fnToString.call(Ctor) == objectCtorString
  )
}

export const isDefined = (
  value: string | boolean | object | null | undefined | number,
): boolean => typeof value !== "undefined" && value !== null

export function defined<T>(value: T | null | undefined): value is T {
  return typeof value !== "undefined" && value !== null
}

export function ensure<T>(
  c: T | null | undefined,
  m: string | (() => string),
): asserts c is T {
  if (c == null) {
    throw new Error(typeof m === "string" ? m : m())
  }
}

export function ensureProps<T, K extends keyof T>(
  props: T,
  keys: K[],
  scope?: string,
): asserts props is T & RequiredBy<T, K> {
  const missingKeys: K[] = []
  for (const key of keys) {
    if (props[key] == null) {
      missingKeys.push(key)
    }
  }
  if (missingKeys.length > 0) {
    throw new Error(
      `[${scope ? ` > ${scope}` : ""}] missing required props: ${missingKeys.join(", ")}`,
    )
  }
}
