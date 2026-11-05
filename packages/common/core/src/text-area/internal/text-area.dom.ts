// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {TextAreaElementIds, TextAreaScope} from "../text-area.types.js"

export const domIds: ScopeDomIds<TextAreaElementIds, TextAreaScope> = {
  counter: (scope) => scope.ids.get("counter"),
  errorText: (scope) => scope.ids.get("errorText"),
  hint: (scope) => scope.ids.get("hint"),
  input: (scope) => scope.ids.get("input"),
  label: (scope) => scope.ids.get("label"),
}

export const domEls: ScopeDomElements<
  TextAreaElementIds,
  TextAreaScope,
  {input: HTMLTextAreaElement | null}
> = {
  counter: (scope) => scope.getById(domIds.counter(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  input: (scope: TextAreaScope) => scope.getById(domIds.input(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
}
