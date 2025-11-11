// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TooltipApi} from "@qualcomm-ui/core/tooltip"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TooltipContextProvider, useTooltipContext] =
  createGuardedContext<TooltipApi>({
    hookName: "useTooltipContext",
    providerName: "<TooltipContextProvider>",
    strict: true,
  })
