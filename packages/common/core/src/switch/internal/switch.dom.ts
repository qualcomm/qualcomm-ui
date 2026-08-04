// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {SwitchElementIds, SwitchScope} from "../switch.types.js"

export const domIds: ScopeDomIds<SwitchElementIds, SwitchScope> = {
  errorText: (scope) => scope.ids.get("errorText"),
  hiddenInput: (scope) => scope.ids.get("hiddenInput"),
  hint: (scope) => scope.ids.get("hint"),
  label: (scope) => scope.ids.get("label"),
  root: (scope) => scope.ids.get("root"),
}

export const domEls: ScopeDomElements<
  SwitchElementIds,
  SwitchScope,
  {
    hiddenInput: HTMLInputElement | null
  }
> = {
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hiddenInput: (scope: SwitchScope) =>
    scope.getById<HTMLInputElement>(domIds.hiddenInput(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
}
