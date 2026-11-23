// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  OverflowListElementIds,
  OverflowListScope,
} from "../overflow-list.types.js"

export const domIds: ScopeDomIds<OverflowListElementIds, OverflowListScope> = {
  indicator: (scope) => scope.ids.get("indicator"),
  root: (scope) => scope.ids.get("root"),
}

export const domEls: ScopeDomElements<
  OverflowListElementIds,
  OverflowListScope
> = {
  indicator: (scope) => scope.getById(domIds.indicator(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
}

/**
 * Item ids derive from the root id, so items don't need to register their own.
 */
export function getItemId(scope: OverflowListScope, index: number): string {
  return `${domIds.root(scope)}:item:${index}`
}

export function getItemEl(
  scope: OverflowListScope,
  index: number,
): HTMLElement | null {
  return scope.getById(getItemId(scope, index))
}

/**
 * Calls `onChange` when the root or any of its children resize, and when
 * children are added or removed. Observing every child covers the items, the
 * indicator, and any trailing content, such as an input.
 */
export function trackRootLayout(
  root: HTMLElement,
  onChange: VoidFunction,
): VoidFunction {
  const win = root.ownerDocument.defaultView ?? window
  const resizeObserver = new win.ResizeObserver(onChange)
  const observeChildren = () => {
    resizeObserver.disconnect()
    resizeObserver.observe(root)
    for (const child of Array.from(root.children)) {
      resizeObserver.observe(child)
    }
  }
  observeChildren()
  const mutationObserver = new win.MutationObserver(() => {
    observeChildren()
    onChange()
  })
  mutationObserver.observe(root, {childList: true})
  return () => {
    resizeObserver.disconnect()
    mutationObserver.disconnect()
  }
}
