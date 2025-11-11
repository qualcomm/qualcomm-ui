// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getFocusables} from "@qualcomm-ui/dom/query"
import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {PopoverElementIds, PopoverScope} from "../popover.types"

export const domIds: ScopeDomIds<PopoverElementIds, PopoverScope> = {
  anchor: (scope) => scope.ids.get("anchor"),
  arrow: (scope) => scope.ids.get("arrow"),
  closeTrigger: (scope) => scope.ids.get("closeTrigger"),
  content: (scope) => scope.ids.get("content"),
  description: (scope) => scope.ids.get("description"),
  positioner: (scope) => scope.ids.get("positioner"),
  title: (scope) => scope.ids.get("title"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<PopoverElementIds, PopoverScope> & {
  getFirstFocusableEl: (scope: PopoverScope) => HTMLElement
  getFocusableEls: (scope: PopoverScope) => HTMLElement[]
} = {
  anchor: (scope) => scope.getById(domIds.anchor(scope)),
  arrow: (scope) => scope.getById(domIds.arrow(scope)),
  closeTrigger: (scope) => scope.getById(domIds.closeTrigger(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  description: (scope) => scope.getById(domIds.description(scope)),
  getFirstFocusableEl(scope) {
    return this.getFocusableEls(scope)[0]
  },
  getFocusableEls(scope) {
    return getFocusables(this.content(scope))
  },
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  title: (scope) => scope.getById(domIds.title(scope)),
  trigger: (scope) => scope.getById(domIds.trigger(scope)),
}
