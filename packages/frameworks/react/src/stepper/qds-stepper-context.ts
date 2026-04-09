// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsStepperApi} from "@qualcomm-ui/qds-core/stepper"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsStepperContextProvider, useQdsStepperContext] =
  createGuardedContext<QdsStepperApi>({
    hookName: "useQdsStepperContext",
    providerName: "<QdsStepperContextProvider>",
    strict: true,
  })
