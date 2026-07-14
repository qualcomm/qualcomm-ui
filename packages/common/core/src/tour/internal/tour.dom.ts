// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {raf} from "@qualcomm-ui/dom/query"
import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {TourElementIds, TourScope} from "../tour.types.js"

export const domIds: ScopeDomIds<TourElementIds, TourScope> = {
  arrow: (scope) => scope.ids.get("arrow"),
  backdrop: (scope) => scope.ids.get("backdrop"),
  content: (scope) => scope.ids.get("content"),
  description: (scope) => scope.ids.get("description"),
  positioner: (scope) => scope.ids.get("positioner"),
  heading: (scope) => scope.ids.get("heading"),
}

export const domEls: ScopeDomElements<TourElementIds, TourScope> = {
  arrow: (scope) => scope.getById(domIds.arrow(scope)),
  backdrop: (scope) => scope.getById(domIds.backdrop(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  description: (scope) => scope.getById(domIds.description(scope)),
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  heading: (scope) => scope.getById(domIds.heading(scope)),
}

export function syncZIndex(scope: TourScope): VoidFunction {
  return raf(() => {
    const content = domEls.content(scope)
    if (!content) {
      return
    }
    const zIndex = getComputedStyle(content).zIndex
    const positioner = domEls.positioner(scope)
    const backdrop = domEls.backdrop(scope)
    positioner?.style.setProperty("--z-index", zIndex)
    positioner?.style.setProperty("z-index", "var(--z-index)")
    backdrop?.style.setProperty("--z-index", zIndex)
  })
}
