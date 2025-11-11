// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {itemById, nextById, prevById, queryAll} from "@qualcomm-ui/dom/query"
import {first, last} from "@qualcomm-ui/utils/array"
import type {BindableIds, Scope, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {TabsElementIds, TabsSchema} from "../tabs.types"

interface TabsScope extends Scope {
  ids: BindableIds<TabsSchema>
}

export const tabsDomIds: ScopeDomIds<TabsElementIds, TabsScope> = {
  dismissButton: (scope, itemKey) =>
    scope.ids.collection("dismissButton").get(itemKey),
  indicator: (scope) => scope.ids.get("indicator"),
  list: (scope) => scope.ids.get("list"),
  panel: (scope, itemKey) => scope.ids.collection("panel").get(itemKey),
  tabButton: (scope, itemKey) => scope.ids.collection("tabButton").get(itemKey),
}

export function getListEl(ctx: TabsScope): HTMLElement | null {
  return ctx.getById(tabsDomIds.list(ctx))
}

export function getTabButtonEl(
  scope: TabsScope,
  value: string,
): HTMLElement | null {
  return scope.getById(tabsDomIds.tabButton(scope, value)!) || null
}

export function getTabEl(scope: TabsScope, value: string): HTMLElement | null {
  const buttonEl = getTabButtonEl(scope, value)
  if (!buttonEl) {
    return null
  }
  return buttonEl.closest('[data-part="tab"]')
}

export function getContentEl(ctx: TabsScope, id: string): HTMLElement {
  return ctx.getById(tabsDomIds.panel(ctx, id)!)!
}

export function getIndicatorEl(ctx: TabsScope): HTMLElement | null {
  return ctx.getById(tabsDomIds.indicator(ctx))
}

export function getElements(ctx: TabsScope): HTMLElement[] {
  const ownerId = CSS.escape(tabsDomIds.list(ctx))
  const selector = `[role=tab][data-ownedby='${ownerId}']:not([disabled])`
  return queryAll(getListEl(ctx), selector)
}

export function getFirstTriggerEl(ctx: TabsScope): HTMLElement | undefined {
  return first(getElements(ctx))
}

export function getLastTriggerEl(ctx: TabsScope): HTMLElement | undefined {
  return last(getElements(ctx))
}

export function getNextTriggerEl(
  ctx: TabsScope,
  opts: {loopFocus?: boolean | undefined; value: string},
): HTMLElement {
  return nextById(
    getElements(ctx),
    tabsDomIds.tabButton(ctx, opts.value)!,
    opts.loopFocus,
  )
}

export function getPrevTriggerEl(
  ctx: TabsScope,
  opts: {loopFocus?: boolean | undefined; value: string},
): HTMLElement | null {
  return prevById(
    getElements(ctx),
    tabsDomIds.tabButton(ctx, opts.value)!,
    opts.loopFocus,
  )
}

export function getOffsetRect(el: HTMLElement | undefined): {
  height: number
  left: number
  top: number
  width: number
} {
  return {
    height: el?.offsetHeight ?? 0,
    left: el?.offsetLeft ?? 0,
    top: el?.offsetTop ?? 0,
    width: el?.offsetWidth ?? 0,
  }
}

export function getRectById(
  ctx: TabsScope,
  id: string,
): {
  height: string
  left: string
  top: string
  width: string
} {
  const tab = itemById(getElements(ctx), tabsDomIds.tabButton(ctx, id)!)
  return resolveRect(getOffsetRect(tab))
}

export const resolveRect = (
  rect: Record<"width" | "height" | "left" | "top", number>,
) => ({
  height: `${rect.height}px`,
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
})
