// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Dict} from "@qualcomm-ui/utils/object"

import type {JSX} from "./jsx"

// It's still fundamentally Dict, but signals transformation
type NormalizedPropsDict = Dict // Or Record<string, any>

export interface ElementCleanup {
  onDestroy?: (callback: () => void) => void
}

/**
 * Describes an object containing methods for low-level prop normalization.
 * Each method applies general transformations (style, children, prop names).
 * Note: While methods are typed per element, the underlying implementation (fn)
 * in the standard createNormalizer often applies the same logic to all.
 */
export type PropNormalizer<Style = JSX.CSSProperties> = {
  button<T extends Dict>(
    props: T,
  ): NormalizedPropsDict & JSX.ButtonHTMLAttributes<HTMLButtonElement> & T
  element<T extends Dict>(
    props: T,
  ): NormalizedPropsDict & T & {style?: Record<string, string>}
  img<T extends Dict>(props: T): NormalizedPropsDict & T
  input<T extends Dict>(
    props: T,
  ): NormalizedPropsDict & JSX.InputHTMLAttributes<HTMLInputElement> & T
  label<T extends Dict>(
    props: T,
  ): NormalizedPropsDict & JSX.LabelHTMLAttributes<HTMLLabelElement> & T
  select<T extends Dict>(
    props: T,
  ): NormalizedPropsDict & JSX.SelectHTMLAttributes<HTMLSelectElement> & T
  // Style property (assumes the normalizer handles extracting/transforming it)
  style: Style
}

export function createPropNormalizer(
  fn: (props: Dict) => NormalizedPropsDict,
): PropNormalizer {
  return new Proxy(
    {},
    {
      get(_target, key: string) {
        if (key === "style") {
          return (props: Dict) => {
            return fn({style: props}).style
          }
        }
        return fn
      },
    },
  ) as PropNormalizer
}
