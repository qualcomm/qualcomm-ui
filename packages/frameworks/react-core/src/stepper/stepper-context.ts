// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {StepperApi} from "@qualcomm-ui/core/stepper"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [StepperContextProvider, useStepperContext] =
  createGuardedContext<StepperApi>({
    hookName: "useStepperContext",
    providerName: "<StepperContextProvider>",
    strict: true,
  })
