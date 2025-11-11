// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {query} from "@qualcomm-ui/dom/query"
import type {ScopeDomIds, ScopeWithIds} from "@qualcomm-ui/utils/machine"

import type {SegmentedControlSchema} from "../segmented-control.types"

type Scope = ScopeWithIds<SegmentedControlSchema>

export const domIds: ScopeDomIds<SegmentedControlSchema["ids"], Scope> = {
  root: (scope) => scope.ids.get("root"),
}

export function getFirstCheckedItemValue(scope: Scope): string | undefined {
  const rootId = domIds.root(scope)
  const rootEl = scope.getById(rootId)
  const selector = `[data-scope="checkbox"][data-part="hidden-input"][data-state="checked"]:not([data-disabled])`
  return (query(rootEl, selector) as HTMLInputElement)?.value
}
