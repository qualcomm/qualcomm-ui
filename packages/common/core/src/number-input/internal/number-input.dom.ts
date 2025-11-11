// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  HintValue,
  NumberInputElementIds,
  NumberInputScope,
} from "../number-input.types"

export const domIds: ScopeDomIds<NumberInputElementIds, NumberInputScope> = {
  decrementTrigger: (scope) => scope.ids.get("decrementTrigger"),
  errorText: (scope) => scope.ids.get("errorText"),
  hint: (scope) => scope.ids.get("hint"),
  incrementTrigger: (scope) => scope.ids.get("incrementTrigger"),
  input: (scope) => scope.ids.get("input"),
  label: (scope) => scope.ids.get("label"),
}

export const domEls: ScopeDomElements<
  NumberInputElementIds,
  NumberInputScope,
  {
    decrementTrigger: HTMLButtonElement | null
    incrementTrigger: HTMLButtonElement | null
    input: HTMLInputElement | null
  }
> = {
  decrementTrigger: (scope) => scope.getById(domIds.decrementTrigger(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  incrementTrigger: (scope) => scope.getById(domIds.incrementTrigger(scope)),
  input: (scope: NumberInputScope) => scope.getById(domIds.input(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
}

export function getPressedTriggerEl(
  ctx: NumberInputScope,
  hint: HintValue | null,
): HTMLButtonElement | null {
  let btnEl: HTMLButtonElement | null = null
  if (hint === "increment") {
    btnEl = domEls.incrementTrigger(ctx)
  }
  if (hint === "decrement") {
    btnEl = domEls.decrementTrigger(ctx)
  }
  return btnEl
}
