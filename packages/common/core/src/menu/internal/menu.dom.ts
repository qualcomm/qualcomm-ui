// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  getByTypeahead,
  getWindow,
  isHTMLElement,
  queryAll,
  type TypeaheadState,
} from "@qualcomm-ui/dom/query"
import {first, last, next, prev} from "@qualcomm-ui/utils/array"
import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {MenuElementIds, MenuScope} from "../menu.types"

export const domIds: ScopeDomIds<MenuElementIds, MenuScope> = {
  arrow: (scope) => scope.ids.get("arrow"),
  content: (scope) => scope.ids.get("content"),
  contextTrigger: (scope) => scope.ids.get("contextTrigger"),
  group: (scope) => scope.ids.get("group"),
  positioner: (scope) => scope.ids.get("positioner"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<MenuElementIds, MenuScope> = {
  arrow: (scope) => scope.getById(domIds.arrow(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  contextTrigger: (scope) => scope.getById(domIds.contextTrigger(scope)),
  group: (scope) => scope.getById(domIds.group(scope)),
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  trigger: (scope) => scope.getById(domIds.trigger(scope)),
}

// TODO: replace with id collection
export function getItemId(ctx: MenuScope, id: string): string {
  return `${ctx.id}/${id}`
}
export function getItemValue(
  el: HTMLElement | null | undefined,
): string | null {
  return el?.dataset.value ?? null
}

export function getGroupId(ctx: MenuScope, id: string) {
  return `menu:${ctx.id}:group:${id}`
}

export function getGroupLabelId(
  ctx: MenuScope,
  id: string | undefined,
): string | undefined {
  if (!ctx.id || !id) {
    return undefined
  }
  return `menu:${ctx.id}:group-label:${id}`
}

export function isTriggerItem(el: HTMLElement | null): boolean {
  return (
    !!el?.getAttribute("role")?.startsWith("menuitem") &&
    !!el?.hasAttribute("aria-controls")
  )
}
export const getElements = (ctx: MenuScope): HTMLElement[] => {
  const ownerId = CSS.escape(domIds.content(ctx))
  const selector = `[role^="menuitem"][data-ownedby=${ownerId}]:not([data-disabled])`
  return queryAll(domEls.content(ctx), selector)
}
export const getFirstEl = (ctx: MenuScope): HTMLElement | undefined =>
  first(getElements(ctx))
export const getLastEl = (ctx: MenuScope): HTMLElement | undefined =>
  last(getElements(ctx))

const isMatch = (el: HTMLElement, value: string | null) => {
  if (!value) {
    return false
  }
  return el.id === value || el.dataset.value === value
}

export function getNextEl(
  ctx: MenuScope,
  opts: {loop?: boolean | undefined; loopFocus: boolean; value: string | null},
): HTMLElement | undefined {
  const items = getElements(ctx)
  const index = items.findIndex((el) => isMatch(el, opts.value))
  return next(items, index, {loop: opts.loop ?? opts.loopFocus})
}

export function getPrevEl(
  ctx: MenuScope,
  opts: {loop?: boolean | undefined; loopFocus: boolean; value: string | null},
): HTMLElement | undefined {
  const items = getElements(ctx)
  const index = items.findIndex((el) => isMatch(el, opts.value))
  return prev(items, index, {loop: opts.loop ?? opts.loopFocus})
}

export function getElemByKey(
  ctx: MenuScope,
  opts: {key: string; typeaheadState: TypeaheadState; value: string | null},
): HTMLElement | undefined {
  const items = getElements(ctx)
  const item = items.find((el) => isMatch(el, opts.value))
  return getByTypeahead(items, {
    activeId: item?.id ?? null,
    key: opts.key,
    state: opts.typeaheadState,
  })
}

export function getItemEl(
  ctx: MenuScope,
  value: string | null,
): HTMLElement | null {
  return value ? ctx.getById(getItemId(ctx, value)) : null
}

export function isTargetDisabled(v: EventTarget | null): boolean {
  return (
    isHTMLElement(v) &&
    (v.dataset.disabled === "" || v.hasAttribute("disabled"))
  )
}

export const itemSelectEvent = "menu:select"

export function dispatchSelectionEvent(
  el: HTMLElement | null,
  value: string,
): void {
  if (!el) {
    return
  }
  const win = getWindow(el)
  const event = new win.CustomEvent(itemSelectEvent, {detail: {value}})
  el.dispatchEvent(event)
}
