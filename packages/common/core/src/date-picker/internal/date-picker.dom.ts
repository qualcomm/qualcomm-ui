// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isHTMLElement, query, queryAll} from "@qualcomm-ui/dom/query"
import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  DatePickerElementIds,
  DatePickerScope,
  DatePickerDateView,
} from "../date-picker.types.js"

export const domIds: ScopeDomIds<DatePickerElementIds, DatePickerScope> = {
  clearTrigger: (scope: DatePickerScope) => scope.ids.get("clearTrigger"),
  content: (scope: DatePickerScope) => scope.ids.get("content"),
  control: (scope: DatePickerScope) => scope.ids.get("control"),
  errorText: (scope: DatePickerScope) => scope.ids.get("errorText"),
  hint: (scope: DatePickerScope) => scope.ids.get("hint"),
  input: (scope, itemKey) => scope.ids.collection("input").get(itemKey),
  positioner: (scope: DatePickerScope) => scope.ids.get("positioner"),
  trigger: (scope: DatePickerScope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<DatePickerElementIds, DatePickerScope> = {
  clearTrigger: (scope: DatePickerScope) =>
    scope.getById(domIds.clearTrigger(scope)),
  content: (scope: DatePickerScope) => scope.getById(domIds.content(scope)),
  control: (scope: DatePickerScope) => scope.getById(domIds.control(scope)),
  errorText: (scope: DatePickerScope) => scope.getById(domIds.errorText(scope)),
  hint: (scope: DatePickerScope) => scope.getById(domIds.hint(scope)),
  input: (scope: DatePickerScope, itemKey) =>
    scope.getById(domIds.input(scope, itemKey) as string),
  positioner: (scope: DatePickerScope) =>
    scope.getById(domIds.positioner(scope)),
  trigger: (scope: DatePickerScope) => scope.getById(domIds.trigger(scope)),
}

export function getInputEls(scope: DatePickerScope): HTMLInputElement[] {
  return queryAll<HTMLInputElement>(
    domEls.control(scope),
    `[data-date-picker-part=input]`,
  )
}

export function getFocusedCell(
  scope: DatePickerScope,
  view: DatePickerDateView,
): HTMLElement | null {
  return query(
    domEls.content(scope),
    `[data-date-picker-part=table-cell-trigger][data-view=${view}][data-focus]:not([data-outside-range])`,
  )
}

/**
 * True when the event originated from a control nested inside the field, such
 * as a value tag or the clear button, rather than from the field itself.
 */
export function isInteractiveDescendantEvent(event: {
  currentTarget: EventTarget | null
  target: EventTarget | null
}): boolean {
  const {currentTarget, target} = event
  if (target === currentTarget) {
    return false
  }
  if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) {
    return false
  }
  const interactiveEl = target.closest(
    "a[href], button, input, select, textarea",
  )
  return !!interactiveEl && interactiveEl !== currentTarget
}
