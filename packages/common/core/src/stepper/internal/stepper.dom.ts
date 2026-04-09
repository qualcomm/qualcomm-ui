// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {StepperElementIds, StepperScope} from "../stepper.types"

export const domIds: ScopeDomIds<StepperElementIds, StepperScope> = {
  content: (scope, itemKey) => scope.ids.collection("content").get(itemKey),
  list: (scope) => scope.ids.get("list"),
  root: (scope) => scope.ids.get("root"),
  trigger: (scope, itemKey) => {
    return scope.ids.collection("trigger").get(itemKey)
  },
}
