// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  DatePickerElementIds,
  DatePickerScope,
} from "../date-picker.types"

export const domIds: ScopeDomIds<DatePickerElementIds, DatePickerScope> = {
  calendar: (scope) => scope.ids.get("calendar"),
  calendarCell: ((scope: DatePickerScope, date: string) => `${scope.ids.get("root")}-cell-${date}`) as any,
  calendarRow: ((scope: DatePickerScope, rowIndex: number) =>
    `${scope.ids.get("root")}-row-${rowIndex}`) as any,
  clearTrigger: (scope) => scope.ids.get("clearTrigger"),
  content: (scope) => scope.ids.get("content"),
  controls: (scope) => scope.ids.get("controls"),
  errorText: (scope) => scope.ids.get("errorText"),
  hint: (scope) => scope.ids.get("hint"),
  input: (scope) => scope.ids.get("input"),
  label: (scope) => scope.ids.get("label"),
  nextTrigger: (scope) => scope.ids.get("nextTrigger"),
  positioner: (scope) => scope.ids.get("positioner"),
  prevTrigger: (scope) => scope.ids.get("prevTrigger"),
  root: (scope) => scope.ids.get("root"),
  todayTrigger: (scope) => scope.ids.get("todayTrigger"),
  trigger: (scope) => scope.ids.get("trigger"),
  viewTrigger: (scope) => scope.ids.get("viewTrigger"),
}

export const domEls: ScopeDomElements<
  Omit<DatePickerElementIds, "calendarCell" | "calendarRow">,
  DatePickerScope
> & {
  calendarCell: (scope: DatePickerScope, date: string) => HTMLElement | null
} = {
  calendar: (scope) => scope.getById(domIds.calendar(scope)),
  calendarCell: (scope, date) => scope.getById((domIds.calendarCell as any)(scope, date)),
  clearTrigger: (scope) => scope.getById(domIds.clearTrigger(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  controls: (scope) => scope.getById(domIds.controls(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  input: (scope) => scope.getById(domIds.input(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
  nextTrigger: (scope) => scope.getById(domIds.nextTrigger(scope)),
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  prevTrigger: (scope) => scope.getById(domIds.prevTrigger(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
  todayTrigger: (scope) => scope.getById(domIds.todayTrigger(scope)),
  trigger: (scope) => scope.getById(domIds.trigger(scope)),
  viewTrigger: (scope) => scope.getById(domIds.viewTrigger(scope)),
}
