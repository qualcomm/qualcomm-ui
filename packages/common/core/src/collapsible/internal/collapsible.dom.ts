// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  CollapsibleElementIds,
  CollapsibleScope,
} from "../collapsible.types"

export const domIds: ScopeDomIds<CollapsibleElementIds, CollapsibleScope> = {
  content: (scope) => scope.ids.get("content"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<CollapsibleElementIds, CollapsibleScope> =
  {
    content: (scope) => scope.getById(domIds.content(scope)),
    trigger: (scope) => scope.getById(domIds.trigger(scope)),
  }
