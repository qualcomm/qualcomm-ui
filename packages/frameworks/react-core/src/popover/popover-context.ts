// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PopoverApi} from "@qualcomm-ui/core/popover"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [PopoverContextProvider, usePopoverContext] =
  createGuardedContext<PopoverApi>({
    hookName: "usePopoverContext",
    providerName: "<PopoverContextProvider>",
    strict: true,
  })
