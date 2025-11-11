// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AvatarApi} from "@qualcomm-ui/core/avatar"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [AvatarContextProvider, useAvatarContext] =
  createGuardedContext<AvatarApi>({
    hookName: "useAvatarContext",
    providerName: "<AvatarContextProvider>",
    strict: true,
  })
