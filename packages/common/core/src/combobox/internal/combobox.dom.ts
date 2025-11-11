// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {query} from "@qualcomm-ui/dom/query"
import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {ComboboxElementIds, ComboboxScope} from "../combobox.types"

export const domIds: ScopeDomIds<
  Omit<ComboboxElementIds, "itemGroupLabel">,
  ComboboxScope
> = {
  clearTrigger: (scope) => scope.ids.get("clearTrigger"),
  content: (scope) => scope.ids.get("content"),
  control: (scope) => scope.ids.get("control"),
  errorText: (scope) => scope.ids.get("errorText"),
  hint: (scope) => scope.ids.get("hint"),
  input: (scope) => scope.ids.get("input"),
  label: (scope) => scope.ids.get("label"),
  positioner: (scope) => scope.ids.get("positioner"),
  root: (scope) => scope.ids.get("root"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<
  Omit<ComboboxElementIds, "itemGroup" | "itemGroupLabel" | "input">,
  ComboboxScope
> & {
  input: (scope: ComboboxScope) => HTMLInputElement | null
} = {
  clearTrigger: (scope) => scope.getById(domIds.clearTrigger(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  control: (scope) => scope.getById(domIds.control(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  input: (scope) => scope.getById(domIds.input(scope)),
  label: (scope) => scope.getById(domIds.label?.(scope)),
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
  trigger: (scope) => scope.getById(domIds.trigger(scope)),
}

export function getItemGroupId(scope: ComboboxScope, id: string) {
  return `${scope.ids.get("root")}-item-group-${id}`
}

export function getItemId(ctx: ComboboxScope, id: string) {
  return `${domIds.root(ctx)}-item-${id}`
}

export function getItemGroupLabelId(ctx: ComboboxScope, id: string) {
  return `${domIds.root(ctx)}-item-group-label-${id}`
}

export function getItemEl(
  ctx: ComboboxScope,
  value: string | null,
): HTMLElement | null {
  if (value == null) {
    return null
  }
  const selector = `[role=option][data-value="${CSS.escape(value)}"]`
  return query(domEls.content(ctx), selector)
}

export function focusInputEl(ctx: ComboboxScope): void {
  const inputEl = domEls.input(ctx)
  if (ctx.isActiveElement(inputEl)) {
    return
  }
  inputEl?.focus({preventScroll: true})
}

export function focusTriggerEl(ctx: ComboboxScope): void {
  const triggerEl = domEls.trigger(ctx)
  if (ctx.isActiveElement(triggerEl)) {
    return
  }
  triggerEl?.focus({preventScroll: true})
}
