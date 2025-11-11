// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {CheckboxElementIds, CheckboxScope} from "../checkbox.types"

export const domIds: ScopeDomIds<CheckboxElementIds, CheckboxScope> = {
  control: (scope) => scope.ids.get("control"),
  errorText: (scope) => scope.ids.get("errorText"),
  hiddenInput: (scope) => scope.ids.get("hiddenInput"),
  label: (scope) => scope.ids.get("label"),
  root: (scope) => scope.ids.get("root"),
}

export const domEls: ScopeDomElements<
  CheckboxElementIds,
  CheckboxScope,
  {
    hiddenInput: HTMLInputElement | null
  }
> = {
  control: (scope: CheckboxScope) => scope.getById(domIds.control(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hiddenInput: (scope: CheckboxScope) =>
    scope.getById<HTMLInputElement>(domIds.hiddenInput(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
}
