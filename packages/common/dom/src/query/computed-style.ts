// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getWindow} from "./node"

const styleCache = new WeakMap<Element, CSSStyleDeclaration>()

export function getComputedStyle(el: Element): CSSStyleDeclaration | undefined {
  if (!styleCache.has(el)) {
    styleCache.set(el, getWindow(el).getComputedStyle(el))
  }
  return styleCache.get(el)
}
