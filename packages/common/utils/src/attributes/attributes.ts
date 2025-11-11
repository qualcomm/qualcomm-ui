// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type WithDataAttributes<T extends NonNullable<unknown>> = T & {
  [key: `data-${string}`]: string | boolean | undefined
}

export type DataAttributes = {
  [key: `data-${string}`]: any
}

export type BooleanAriaAttr = "true" | "false" | undefined

export type BooleanDataAttr = "" | undefined

export function booleanDataAttr(
  condition: boolean | undefined,
): BooleanDataAttr {
  return condition ? "" : undefined
}

export function booleanAriaAttr(
  guard: boolean | undefined,
  falseValue: "false" | undefined = "false",
): BooleanAriaAttr {
  return guard ? "true" : falseValue
}

/**
 * Returns the provided ARIA attribute value or a fallback value if the primary
 * value is undefined, null, or empty.
 */
export function ariaAttr(
  value: string | undefined,
  fallback: string | undefined = undefined,
): string | undefined {
  return value || fallback
}

export interface PartAttributes {
  "data-part": string
  "data-scope": string
}

export interface IdParam {
  id: string
}

export function normalizeAriaAttr(value: unknown): "true" | "false" {
  // eslint-disable-next-line eqeqeq
  if (value == true) {
    return "true"
  }
  // eslint-disable-next-line eqeqeq
  if (value == false) {
    return "false"
  }
  return value ? "true" : "false"
}

export function mergeAriaIds(
  ...ids: Array<string | undefined>
): string | undefined {
  return ids.filter((id) => id).join(" ") || undefined
}
