// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {StepperItemProps} from "@qualcomm-ui/core/stepper"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [StepperItemContextProvider, useStepperItemContext] =
  createGuardedContext<StepperItemProps>({
    hookName: "useStepperItemContext",
    providerName: "<StepperItemContextProvider>",
    strict: true,
  })
